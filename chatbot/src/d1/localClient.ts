import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { env } from "../config/env.js";
import { createLogger } from "../logger.js";
import { assertSelectOnly, type D1Client } from "./types.js";

const logger = createLogger("d1-local");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// chatbot/src/d1 (or chatbot/dist/d1 when built) -> repo root, same nesting either way.
const REPO_ROOT = path.resolve(__dirname, "../../../");
const DEFAULT_MINIFLARE_D1_DIR = path.join(
  REPO_ROOT,
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject"
);

/**
 * Locates the SQLite file `wrangler d1 ... --local` actually writes to, inside the
 * main app's `.wrangler/` dev state. Miniflare names this file by a content hash,
 * not a fixed name, so it can't be hardcoded — this scans the known directory and
 * picks the one real database file (`metadata.sqlite` is Miniflare's own
 * bookkeeping DB, not D1 content, and is excluded).
 */
function resolveSqlitePath(): string {
  if (env.LOCAL_D1_SQLITE_PATH) {
    if (!existsSync(env.LOCAL_D1_SQLITE_PATH)) {
      throw new Error(`LOCAL_D1_SQLITE_PATH does not exist: ${env.LOCAL_D1_SQLITE_PATH}`);
    }
    return env.LOCAL_D1_SQLITE_PATH;
  }

  if (!existsSync(DEFAULT_MINIFLARE_D1_DIR)) {
    throw new Error(
      `No local D1 state found at ${DEFAULT_MINIFLARE_D1_DIR}. Run \`npm run d1:setup\` in the ` +
        `main app first (creates + seeds the local D1 database), or set LOCAL_D1_SQLITE_PATH explicitly.`
    );
  }

  const candidates = readdirSync(DEFAULT_MINIFLARE_D1_DIR)
    .filter((f) => f.endsWith(".sqlite") && f !== "metadata.sqlite")
    .map((f) => path.join(DEFAULT_MINIFLARE_D1_DIR, f));

  if (candidates.length === 0) {
    throw new Error(
      `No .sqlite database file found in ${DEFAULT_MINIFLARE_D1_DIR}. Run \`npm run d1:setup\` in ` +
        `the main app first, or set LOCAL_D1_SQLITE_PATH explicitly.`
    );
  }

  if (candidates.length > 1) {
    candidates.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
    logger.warn(
      `Multiple local D1 sqlite files found; using the most recently modified: ${candidates[0]}. ` +
        `Set LOCAL_D1_SQLITE_PATH to pin one explicitly.`
    );
  }

  return candidates[0]!;
}

/**
 * Reads the main app's local D1 database directly as a SQLite file, via
 * `better-sqlite3`, opened with `readonly: true` — a stronger read-only
 * guarantee than the remote HTTP mode: the OS/driver itself refuses writes,
 * not just an application-level check. `assertSelectOnly` is still applied
 * on top, for the same defense-in-depth as the remote client.
 *
 * This is the default D1 access mode (`D1_MODE=local`) — it needs no
 * Cloudflare account, token, or network access, and reads the exact same
 * data the main app's own `wrangler d1 ... --local` / `npm run dev` uses.
 * Requires the main app's local D1 to have been created/seeded first
 * (`npm run d1:setup` in the repo root).
 */
export class LocalD1Client implements D1Client {
  private db: import("better-sqlite3").Database | null = null;

  private getDb(): import("better-sqlite3").Database {
    if (!this.db) {
      const dbPath = resolveSqlitePath();
      logger.info(`Opening local D1 sqlite file (read-only): ${dbPath}`);
      this.db = new Database(dbPath, { readonly: true, fileMustExist: true });
    }
    return this.db;
  }

  async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    assertSelectOnly(sql);
    const stmt = this.getDb().prepare(sql);
    return stmt.all(...params) as T[];
  }

  async ping(): Promise<boolean> {
    try {
      await this.query("SELECT 1 AS ok");
      return true;
    } catch (err) {
      logger.warn("Local D1 ping failed", err);
      return false;
    }
  }
}
