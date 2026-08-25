// Patches @opennextjs/cloudflare's server-function esbuild bundling so `.wasm`
// imports (Prisma's query-compiler, in particular) survive as clean relative
// import specifiers instead of getting baked in as absolute build-machine paths.
//
// Why this is needed:
// Prisma generates `node_modules/.prisma/client/wasm-worker-loader.mjs` as:
//
//   export default import('./query_compiler_small_bg.wasm')
//
// — a dynamic `import()` of a relative path. OpenNext's esbuild pass for the
// Cloudflare server function (bundle-server.js) has no `.wasm` loader
// configured. Without one, esbuild can't bundle the file's contents, so it
// falls back to leaving the `import()` call in place — but it resolves the
// specifier to the *build machine's absolute filesystem path* first. Workers
// have no filesystem and can't dynamically `import()` an arbitrary path at
// runtime, so this throws on every request that touches Prisma.
//
// Cloudflare Workers can only load WASM via a genuine `import` of a `.wasm`
// file that survives, as a relative path, into the final bundle wrangler
// builds — wrangler's own bundler resolves and precompiles it into a
// `WebAssembly.Module` at deploy time (dynamic runtime compilation, e.g.
// `WebAssembly.compile()`, is disallowed by the Workers embedder for
// security, so there is no runtime-side workaround for this).
//
// This patch adds an esbuild plugin, ahead of OpenNext's own plugins, that
// resolves every `.wasm` import (static or dynamic) as external and rewrites
// its specifier to a path relative to the emitted `handler.mjs` — the file
// itself is already copied into place by Next's node_modules tracing, so no
// copying is needed, only a correct relative specifier for wrangler's build
// step to pick up.
//
// Runs after `npm install` (see package.json `postinstall`), since
// `node_modules/@opennextjs/cloudflare` is reinstalled on every install.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetFile = path.join(
  __dirname,
  "..",
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "build",
  "bundle-server.js"
);

const anchor = "        plugins: [\n";
const pluginSnippet = `        plugins: [
            {
                // Patched by scripts/patch-opennext-wasm.mjs — see that file for why.
                name: "cf-wasm-relative-import",
                setup(build) {
                    build.onResolve({ filter: /\\.wasm$/ }, (args) => {
                        const resolved = path.resolve(args.resolveDir, args.path);
                        let relative = path
                            .relative(path.dirname(openNextServerBundle), resolved)
                            .split(path.sep)
                            .join("/");
                        if (!relative.startsWith(".")) relative = \`./\${relative}\`;
                        return { path: relative, external: true };
                    });
                },
            },
`;

function patch() {
  if (!existsSync(targetFile)) {
    console.warn(`[patch-opennext-wasm] skipped, not found: ${targetFile}`);
    return;
  }
  const current = readFileSync(targetFile, "utf8");
  if (current.includes("cf-wasm-relative-import")) {
    console.log(`[patch-opennext-wasm] already patched: ${targetFile}`);
    return;
  }
  if (!current.includes(anchor)) {
    throw new Error(
      `[patch-opennext-wasm] anchor not found in ${targetFile} — @opennextjs/cloudflare's ` +
        `bundle-server.js likely changed shape. Update scripts/patch-opennext-wasm.mjs to match.`
    );
  }
  writeFileSync(targetFile, current.replace(anchor, pluginSnippet));
  console.log(`[patch-opennext-wasm] patched: ${targetFile}`);
}

patch();
