/**
 * One-off Postgres → D1 ETL with Phase 1 transforms.
 *
 * Usage:
 *   npm run migrate:to-d1 -- --d1=local --dry-run
 *   npm run migrate:to-d1 -- --d1=staging
 *   npm run migrate:to-d1 -- --table=services
 */
import { loadMigrationEnv } from "./migration/env";
import { parseMigrationCli } from "./migration/cli";
import { initPgSource, disconnectPgSource } from "./migration/pg-source";
import { initD1Target, disconnectD1Target } from "./migration/d1-target";
import { MIGRATION_ORDER, emptyStats, type TableName, type TableStats } from "./migration/tables";
import { runMigration } from "./migration/migrate-runner";
import { execSync } from "node:child_process";

async function wipeIfNeeded(d1: "local" | "staging" | "remote", force: boolean, dryRun: boolean) {
  if (dryRun) {
    console.log("[dry-run] Skipping D1 wipe");
    return;
  }
  if (d1 === "remote" && !force) {
    console.log("Skipping wipe on production D1 (use --force in Phase 7 only)");
    return;
  }
  const forceFlag = force ? " --force" : "";
  console.log(`Wiping D1 (target: ${d1})…`);
  execSync(`npx tsx scripts/migration/wipe-staging.ts --d1=${d1}${forceFlag}`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}

async function main() {
  loadMigrationEnv();
  const opts = parseMigrationCli({ d1: "local" });

  const pg = await initPgSource();
  const d1 = await initD1Target(opts.d1);

  const tablesToRun = opts.table
    ? (MIGRATION_ORDER.filter((t) => t === opts.table) as TableName[])
    : MIGRATION_ORDER;

  if (opts.table && tablesToRun.length === 0) {
    throw new Error(`Unknown table "${opts.table}". Valid: ${MIGRATION_ORDER.join(", ")}`);
  }

  if (!opts.table) {
    await wipeIfNeeded(opts.d1, opts.force, opts.dryRun);
  }

  const summary: Record<string, TableStats> = {};

  for (const table of tablesToRun) {
    console.log(`\n── Migrating ${table} ──`);
    try {
      const stats = await runMigration(table, pg, d1, opts.dryRun);
      summary[table] = stats;
      console.log(
        `  read=${stats.read} written=${stats.written} children=${stats.children} errors=${stats.errors}`
      );
      if (stats.errors > 0) {
        throw new Error(`Migration failed for ${table}`);
      }
    } catch (err) {
      summary[table] = { ...emptyStats(), errors: 1 };
      console.error(`  FAILED:`, err);
      process.exit(1);
    }
  }

  console.log("\nMigration summary:");
  console.table(summary);
  console.log(opts.dryRun ? "\n[dry-run] No data written." : "\nMigration complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPgSource();
    await disconnectD1Target();
  });
