/**
 * Compare D1 row counts against a Phase 0 Postgres snapshot.
 *
 * Usage:
 *   npx tsx scripts/compare-migration-counts.ts \
 *     --snapshot docs/migration-snapshots/phase0-row-counts.json --d1=staging
 */
import { readFileSync } from "node:fs";
import { loadMigrationEnv } from "./migration/env";
import { parseMigrationCli } from "./migration/cli";
import { initD1Target, disconnectD1Target } from "./migration/d1-target";
import { PARENT_TABLES, DERIVED_JOIN_CHECKS } from "./migration/tables";
import { countD1Derived, countD1Tables, type SnapshotResult } from "./migration/counts";

async function main() {
  loadMigrationEnv();
  const opts = parseMigrationCli({ d1: "local" });

  if (!opts.snapshot) {
    console.error("ERROR: --snapshot is required (path to phase0-row-counts.json)");
    process.exit(1);
  }

  const snapshot: SnapshotResult = JSON.parse(readFileSync(opts.snapshot, "utf8"));
  const d1 = await initD1Target(opts.d1);
  const actual = await countD1Tables(d1);
  const actualDerived = await countD1Derived(d1);

  let failed = false;

  console.log("\nParent table comparison:");
  const parentRows: { table: string; expected: number; actual: number; delta: number; status: string }[] = [];
  for (const table of PARENT_TABLES) {
    const expected = snapshot.counts[table] ?? 0;
    const act = actual[table] ?? 0;
    const delta = act - expected;
    const status = delta === 0 ? "OK" : "FAIL";
    if (delta !== 0) failed = true;
    parentRows.push({ table, expected, actual: act, delta, status });
  }
  console.table(parentRows);

  console.log("\nDerived join-table comparison:");
  const derivedRows: { check: string; expected: number; actual: number; delta: number; status: string }[] = [];
  for (const check of DERIVED_JOIN_CHECKS) {
    const expected = snapshot.derived?.[check.name] ?? snapshot.counts[check.d1Table] ?? 0;
    const act = actualDerived[check.name] ?? actual[check.d1Table] ?? 0;
    const delta = act - expected;
    const status = delta === 0 ? "OK" : "FAIL";
    if (delta !== 0) failed = true;
    derivedRows.push({ check: check.name, expected, actual: act, delta, status });
  }
  console.table(derivedRows);

  if (failed) {
    console.error("\nComparison FAILED — one or more deltas are non-zero.");
    process.exit(1);
  }
  console.log("\nComparison passed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectD1Target());
