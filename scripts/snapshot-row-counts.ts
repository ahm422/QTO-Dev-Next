/**
 * Snapshot row counts from Postgres or D1 for Phase 0 baseline / post-migration validation.
 *
 * Usage:
 *   npx tsx scripts/snapshot-row-counts.ts --source=postgres --out docs/migration-snapshots/phase0-row-counts.json
 *   npx tsx scripts/snapshot-row-counts.ts --source=d1 --d1=local
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { loadMigrationEnv } from "./migration/env";
import { parseMigrationCli } from "./migration/cli";
import { initPgSource, disconnectPgSource } from "./migration/pg-source";
import { initD1Target, disconnectD1Target } from "./migration/d1-target";
import {
  countD1Derived,
  countD1Tables,
  countPostgresDerived,
  countPostgresTables,
  type SnapshotResult,
} from "./migration/counts";

async function main() {
  loadMigrationEnv();
  const opts = parseMigrationCli({ source: "d1", d1: "local" });

  let result: SnapshotResult;

  if (opts.source === "postgres") {
    const pg = await initPgSource();
    const counts = await countPostgresTables(pg);
    const derived = await countPostgresDerived();
    result = {
      source: "postgres",
      timestamp: new Date().toISOString(),
      counts,
      derived,
    };
  } else {
    const d1 = await initD1Target(opts.d1);
    const counts = await countD1Tables(d1);
    const derived = await countD1Derived(d1);
    result = {
      source: "d1",
      timestamp: new Date().toISOString(),
      counts,
      derived,
    };
  }

  if (opts.out) {
    mkdirSync(dirname(opts.out), { recursive: true });
    writeFileSync(opts.out, JSON.stringify(result, null, 2) + "\n");
    console.log(`Wrote snapshot to ${opts.out}`);
  }

  console.log("\nTable counts:");
  console.table(result.counts);
  if (result.derived) {
    console.log("\nDerived join-table counts:");
    console.table(result.derived);
  }
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
