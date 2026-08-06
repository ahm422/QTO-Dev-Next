/**
 * Write SEO seed content to real production D1 via `wrangler d1 execute --remote`.
 * (getPlatformProxy remoteBindings was confirmed writing/reading local D1, not prod.)
 *
 * Usage:
 *   npx tsx scripts/seed-prod-d1-via-wrangler.ts --confirm-production
 */
import { spawnSync } from "node:child_process";
import { writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { blogPosts } from "../src/data/blog";
import { stringifyMetadata } from "../src/lib/metadata";

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function runRemoteSql(sql: string, label: string) {
  const dir = mkdtempSync(join(tmpdir(), "qto-d1-"));
  const file = join(dir, "stmt.sql");
  try {
    writeFileSync(file, sql, "utf8");
    console.log(`  → ${label}`);
    const result = spawnSync(
      "npx",
      ["wrangler", "d1", "execute", "qtodev-d1", "--remote", "--file", file],
      { encoding: "utf8", cwd: process.cwd() }
    );
    if (result.status !== 0) {
      console.error(result.stdout);
      console.error(result.stderr);
      throw new Error(`wrangler failed for ${label} (exit ${result.status})`);
    }
    if (result.stdout) console.log(result.stdout.trim().split("\n").slice(-8).join("\n"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function main() {
  if (!hasFlag("confirm-production")) {
    console.error("Refusing without --confirm-production");
    process.exit(1);
  }

  console.log("Updating production D1 blog posts via wrangler --remote…");
  for (const post of blogPosts) {
    const excerpt = post.excerpt ?? post.description;
    const sql = `UPDATE blog_posts
SET title = ${sqlString(post.title)},
    excerpt = ${sqlString(excerpt)},
    content = ${sqlString(post.content)},
    category = ${sqlString(post.category)},
    author = ${sqlString(post.author)},
    is_published = 1
WHERE slug = ${sqlString(post.slug)};`;
    runRemoteSql(sql, `blog ${post.slug} (content=${post.content.length})`);
  }

  const portfolioData = stringifyMetadata({
    subtitle: "OUR FEATURED WORK",
    title: "Our Featured Work",
    titleHighlight: "Featured",
    description:
      "Selected product and engineering work across web, mobile, and platform engagements.",
    viewAllLabel: "View All -",
    viewAllHref: "/projects",
  });
  if (!portfolioData) throw new Error("Failed to stringify portfolio section");

  console.log("Updating homepage.portfolio page section…");
  runRemoteSql(
    `UPDATE page_sections
SET data = ${sqlString(portfolioData)}
WHERE slug = 'homepage.portfolio';`,
    "page_sections homepage.portfolio"
  );

  console.log("Verifying…");
  const verify = spawnSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "qtodev-d1",
      "--remote",
      "--json",
      "--command",
      "SELECT slug, length(content) as clen, length(excerpt) as elen FROM blog_posts ORDER BY slug;",
    ],
    { encoding: "utf8", cwd: process.cwd() }
  );
  console.log(verify.stdout);
  if (verify.status !== 0) {
    console.error(verify.stderr);
    process.exit(1);
  }

  const portfolio = spawnSync(
    "npx",
    [
      "wrangler",
      "d1",
      "execute",
      "qtodev-d1",
      "--remote",
      "--json",
      "--command",
      "SELECT slug, json_extract(data, '$.description') as description FROM page_sections WHERE slug = 'homepage.portfolio';",
    ],
    { encoding: "utf8", cwd: process.cwd() }
  );
  console.log(portfolio.stdout);
  console.log("Done.");
}

main();
