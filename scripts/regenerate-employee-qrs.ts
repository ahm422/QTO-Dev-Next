/**
 * Regenerate every employee's QR PNG against the canonical public site URL and
 * persist the resulting key. Fixes #416: QRs minted at create time baked a
 * stale `http://localhost:3000` URL and were never refreshed.
 *
 * The app writes QRs through the Workers `MEDIA` binding, which is unavailable
 * in a plain Node script — so here we render the PNG with `qrcode` and push it
 * to R2 over the S3 API (same bucket, `qtodev-media`), then update D1 via
 * `wrangler d1 execute`.
 *
 * Usage:
 *   npx tsx scripts/regenerate-employee-qrs.ts --d1 local  --dry-run
 *   npx tsx scripts/regenerate-employee-qrs.ts --d1 local
 *   npx tsx scripts/regenerate-employee-qrs.ts --d1 staging --site=https://qtodev-site-staging.example.workers.dev
 *   npx tsx scripts/regenerate-employee-qrs.ts --d1 remote  --confirm-production
 *
 * Flags:
 *   --d1 local|staging|remote   target database (default: local)
 *   --site=<url>                override the URL encoded into the QR
 *   --only-missing              skip rows that already have a qr_key
 *   --dry-run                   plan only, no R2 writes / no D1 updates
 *   --confirm-production        required when --d1 remote
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import QRCode from "qrcode";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { parseArg } from "./migration/cli";
import { loadMigrationEnv, requireR2Env } from "./migration/env";

type Target = "local" | "staging" | "remote";

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function resolveTarget(): Target {
  const t = (parseArg("d1") ?? "local") as Target;
  if (!["local", "staging", "remote"].includes(t)) {
    throw new Error(`Invalid --d1 "${t}". Use local, staging or remote.`);
  }
  return t;
}

function defaultSite(target: Target): string {
  if (target === "remote") return "https://qtodev.com";
  if (target === "local") return "http://localhost:3000";
  throw new Error("Pass --site=<url> for the staging target.");
}

function d1Args(target: Target): string[] {
  if (target === "local") return ["qtodev-d1", "--local"];
  if (target === "staging") return ["qtodev-d1-staging", "--remote", "--env", "staging"];
  return ["qtodev-d1", "--remote"];
}

function runD1(target: Target, args: string[], sql: string): unknown {
  const res = spawnSync(
    "npx",
    ["wrangler", "d1", "execute", ...d1Args(target), ...args, "--command", sql],
    { encoding: "utf8", cwd: process.cwd() },
  );
  if (res.status !== 0) {
    console.error(res.stdout);
    console.error(res.stderr);
    throw new Error(`wrangler d1 execute failed (exit ${res.status})`);
  }
  return res.stdout;
}

interface EmployeeRow {
  id: string;
  public_id: string;
  qr_key: string | null;
}

function queryEmployees(target: Target): EmployeeRow[] {
  const out = runD1(target, ["--json"], "SELECT id, public_id, qr_key FROM employees;") as string;
  const parsed = JSON.parse(out) as Array<{ results: EmployeeRow[] }>;
  return parsed[0]?.results ?? [];
}

function normalizeEndpoint(raw: string, bucket: string): string {
  const trimmed = raw.replace(/\/$/, "");
  const suffix = `/${bucket}`;
  return trimmed.endsWith(suffix) ? trimmed.slice(0, -suffix.length) : trimmed;
}

function sqlString(v: string): string {
  return `'${v.replace(/'/g, "''")}'`;
}

async function main() {
  loadMigrationEnv();
  const target = resolveTarget();
  const dryRun = hasFlag("dry-run");
  const onlyMissing = hasFlag("only-missing");
  const site = (parseArg("site") ?? defaultSite(target)).replace(/\/$/, "");

  if (target === "remote" && !hasFlag("confirm-production")) {
    console.error("Refusing to touch production without --confirm-production");
    process.exit(1);
  }
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(site) && target !== "local") {
    console.error(`Refusing to bake a loopback URL (${site}) into ${target} QRs`);
    process.exit(1);
  }

  const r2 = requireR2Env();
  const s3 = new S3Client({
    endpoint: normalizeEndpoint(r2.endpoint, r2.bucket),
    region: r2.region,
    credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  } as ConstructorParameters<typeof S3Client>[0]);

  const rows = queryEmployees(target);
  const targets = onlyMissing ? rows.filter((r) => !r.qr_key) : rows;
  console.log(
    `Target ${target} · site ${site} · ${targets.length}/${rows.length} employee(s) to process${dryRun ? " (dry run)" : ""}`,
  );

  const report: Array<{ id: string; publicId: string; key: string; status: string }> = [];
  let updated = 0;
  let failed = 0;

  for (const row of targets) {
    const key = `employees/${row.id}/qr.png`;
    const url = `${site}/employee/${row.public_id}`;
    try {
      if (!dryRun) {
        const png = await QRCode.toBuffer(url, { type: "png", width: 512, margin: 2 });
        await s3.send(
          new PutObjectCommand({ Bucket: r2.bucket, Key: key, Body: png, ContentType: "image/png" }),
        );
        if (row.qr_key !== key) {
          runD1(target, [], `UPDATE employees SET qr_key = ${sqlString(key)} WHERE id = ${sqlString(row.id)};`);
        }
      }
      updated += 1;
      report.push({ id: row.id, publicId: row.public_id, key, status: dryRun ? "planned" : "ok" });
      console.log(`  ✓ ${row.public_id} → ${url}`);
    } catch (err) {
      failed += 1;
      report.push({ id: row.id, publicId: row.public_id, key, status: `error: ${(err as Error).message}` });
      console.error(`  ✗ ${row.public_id}: ${(err as Error).message}`);
    }
  }

  const outDir = resolve(process.cwd(), "scripts/output");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(
    outDir,
    `regenerate-employee-qrs-${target}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  writeFileSync(outPath, JSON.stringify({ target, site, dryRun, updated, failed, report }, null, 2));
  console.log(`\nprocessed=${targets.length} updated=${updated} failed=${failed}\nreport → ${outPath}`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
