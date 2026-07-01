/**
 * Wipe all D1 tables (staging/local only). Use before re-running migration.
 *
 * Usage:
 *   npx tsx scripts/migration/wipe-staging.ts --d1=local
 *   npx tsx scripts/migration/wipe-staging.ts --d1=staging
 *   npx tsx scripts/migration/wipe-staging.ts --d1=remote --force  # production — Phase 7 only
 */
import { loadMigrationEnv } from "./env";
import { parseMigrationCli } from "./cli";
import { initD1Target, disconnectD1Target } from "./d1-target";
import { WIPE_ORDER } from "./tables";

async function main() {
  loadMigrationEnv();
  const opts = parseMigrationCli();

  if (opts.d1 === "remote" && !opts.force) {
    console.error(
      "Refusing to wipe production D1 without --force. This is intentional — use staging/local for dry-runs."
    );
    process.exit(1);
  }

  const d1 = await initD1Target(opts.d1);
  console.log(`Wiping D1 tables (target: ${opts.d1})…`);

  await d1.$executeRawUnsafe("PRAGMA foreign_keys = OFF");

  for (const table of WIPE_ORDER) {
    await d1.$executeRawUnsafe(`DELETE FROM "${table}"`);
    console.log(`  cleared ${table}`);
  }

  await d1.$executeRawUnsafe("PRAGMA foreign_keys = ON");
  console.log("Wipe complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectD1Target());
