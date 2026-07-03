/**
 * Push local staging D1 data to remote qtodev-d1-staging.
 * Use after staging D1 is populated when getPlatformProxy cannot reach remote D1.
 *
 * Usage:
 *   npx tsx scripts/migration/sync-staging-to-remote.ts
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MIGRATION_ORDER, WIPE_ORDER } from "./tables";

const DB_NAME = "qtodev-d1-staging";

function wrangler(args: string[]) {
  execFileSync("npx", ["wrangler", "d1", ...args], {
    stdio: "inherit",
    cwd: process.cwd(),
  });
}

function wipeRemote() {
  console.log("Wiping remote staging D1…");
  wrangler([
    "execute",
    DB_NAME,
    "--remote",
    "--env",
    "staging",
    "--command",
    "PRAGMA foreign_keys = OFF;",
  ]);

  for (const table of WIPE_ORDER) {
    wrangler([
      "execute",
      DB_NAME,
      "--remote",
      "--env",
      "staging",
      "--command",
      `DELETE FROM "${table}";`,
    ]);
    console.log(`  cleared remote ${table}`);
  }

  wrangler([
    "execute",
    DB_NAME,
    "--remote",
    "--env",
    "staging",
    "--command",
    "PRAGMA foreign_keys = ON;",
  ]);
}

async function main() {
  const dir = mkdtempSync(join(tmpdir(), "d1-staging-sync-"));
  const exportPath = join(dir, "staging-data.sql");

  try {
    console.log("Exporting local staging D1…");
    const tableArgs = MIGRATION_ORDER.flatMap((table) => ["--table", table]);
    wrangler([
      "export",
      DB_NAME,
      "--local",
      "--env",
      "staging",
      "--output",
      exportPath,
      "--no-schema",
      "-y",
      ...tableArgs,
    ]);

    wipeRemote();

    console.log("Importing data to remote staging D1…");
    wrangler([
      "execute",
      DB_NAME,
      "--remote",
      "--env",
      "staging",
      "--file",
      exportPath,
    ]);

    console.log("Remote staging D1 sync complete.");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
