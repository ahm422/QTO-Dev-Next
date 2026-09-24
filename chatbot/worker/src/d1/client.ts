import { createLogger } from "../logger.js";
import { assertSelectOnly, type D1Client } from "./types.js";

const logger = createLogger("d1");

/**
 * Reads the shared `qtodev-d1` database via the native D1 binding (see wrangler.jsonc),
 * replacing the old service's two Node-only clients (`better-sqlite3` for local dev,
 * an HTTP API client for remote/production). `assertSelectOnly` still guards every query,
 * same defense-in-depth as before, even though the binding itself is full read/write —
 * this Worker must never write to the main site's database.
 */
class WorkerD1Client implements D1Client {
  private db: D1Database | null = null;

  /** Called once per request from index.ts before any query() call. */
  bind(database: D1Database): void {
    this.db = database;
  }

  async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    assertSelectOnly(sql);
    if (!this.db) throw new Error("D1 not initialized — call d1.bind(env.DB) first");
    const result = await this.db
      .prepare(sql)
      .bind(...params)
      .all<T>();
    return result.results;
  }

  async ping(): Promise<boolean> {
    try {
      await this.query("SELECT 1 AS ok");
      return true;
    } catch (err) {
      logger.warn("D1 ping failed", err);
      return false;
    }
  }
}

export const d1 = new WorkerD1Client();
