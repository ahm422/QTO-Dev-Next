/**
 * Push local D1 CONTENT data to production D1 (qtodev-d1).
 *
 * Scope: CMS/content tables only (pages, blog, services, team, jobs listing, etc).
 * Deliberately EXCLUDES transactional / user / security tables so real production
 * data is never touched:
 *   contacts, requirements, job_applications, admin_users,
 *   refresh_tokens, password_reset_tokens, audit_logs
 *
 * This wipes the content tables in production and reimports from local D1 — it is
 * destructive to whatever content currently lives in prod. Refuses to run without
 * --confirm-production.
 *
 * Usage:
 *   npx tsx scripts/migration/sync-content-to-production.ts -- --confirm-production
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TableName } from "./tables";

const DB_NAME = "qtodev-d1";

/** Content tables to sync, in FK-safe (parent-first) order. Excludes transactional/security tables. */
const CONTENT_MIGRATION_ORDER: TableName[] = [
  "process_steps",
  "featured_works",
  "why_choose_us",
  "stats",
  "testimonials",
  "industries",
  "engagement_models",
  "faqs",
  "technologies",
  "work_values",
  "about_content",
  "team_members",
  "contact_info",
  "site_config",
  "page_sections",
  "services",
  "service_technology_tags",
  "blog_posts",
  "blog_post_tags",
  "projects",
  "project_tags",
  "project_tech_stack_items",
  "jobs",
];

const CONTENT_WIPE_ORDER: TableName[] = [...CONTENT_MIGRATION_ORDER].reverse();

const EXCLUDED_TABLES = [
  "contacts",
  "requirements",
  "job_applications",
  "admin_users",
  "refresh_tokens",
  "password_reset_tokens",
  "audit_logs",
];

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function wrangler(args: string[]) {
  execFileSync("npx", ["wrangler", "d1", ...args], {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}

function wipeRemoteContent() {
  console.log("Wiping content tables in production D1…");
  wrangler(["execute", DB_NAME, "--remote", "--command", "PRAGMA foreign_keys = OFF;"]);

  for (const table of CONTENT_WIPE_ORDER) {
    wrangler(["execute", DB_NAME, "--remote", "--command", `DELETE FROM "${table}";`]);
    console.log(`  cleared remote ${table}`);
  }

  wrangler(["execute", DB_NAME, "--remote", "--command", "PRAGMA foreign_keys = ON;"]);
}

async function main() {
  if (!hasFlag("confirm-production")) {
    console.error("Refusing without --confirm-production");
    console.error(
      `\nThis will wipe and reimport these production D1 tables from local:\n  ${CONTENT_MIGRATION_ORDER.join(", ")}\n`
    );
    console.error(`These tables are NEVER touched (left as-is in prod):\n  ${EXCLUDED_TABLES.join(", ")}\n`);
    process.exit(1);
  }

  const dir = mkdtempSync(join(tmpdir(), "d1-prod-content-sync-"));
  const exportPath = join(dir, "content-data.sql");

  try {
    console.log("Exporting local D1 content tables…");
    const tableArgs = CONTENT_MIGRATION_ORDER.flatMap((table) => ["--table", table]);
    wrangler(["export", DB_NAME, "--local", "--output", exportPath, "--no-schema", "-y", ...tableArgs]);

    wipeRemoteContent();

    console.log("Importing content data to production D1…");
    wrangler(["execute", DB_NAME, "--remote", "--file", exportPath]);

    console.log("Production content sync complete.");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
