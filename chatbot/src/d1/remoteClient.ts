import { env } from "../config/env.js";
import { createLogger } from "../logger.js";
import { assertSelectOnly, type D1Client } from "./types.js";

const logger = createLogger("d1-remote");

/**
 * Read-only client for Cloudflare D1's HTTP Query API — used when `D1_MODE=remote`
 * (production/staging, or any time this service doesn't run next to the main app's
 * local dev D1). Not used by default; see `localClient.ts` for the default local mode.
 *
 *   POST https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query
 *
 * Read-only is enforced twice, independently:
 *   1. Operationally: the Cloudflare API token configured in .env should be scoped
 *      to the "D1: Read" permission only (see .env.example).
 *   2. In code: `query()` refuses to execute anything that isn't a SELECT via
 *      `assertSelectOnly`, regardless of what the token is actually permitted to do.
 */
const D1_API_BASE = "https://api.cloudflare.com/client/v4";

interface D1QueryResponseResult {
  results: Record<string, unknown>[];
  success: boolean;
  meta?: Record<string, unknown>;
}

interface D1ApiResponse {
  result: D1QueryResponseResult[];
  success: boolean;
  errors: { code: number; message: string }[];
  messages: unknown[];
}

export class RemoteD1Client implements D1Client {
  private readonly endpoint: string;

  constructor(
    private readonly accountId = env.CLOUDFLARE_ACCOUNT_ID,
    private readonly databaseId = env.CLOUDFLARE_D1_DATABASE_ID,
    private readonly apiToken = env.CLOUDFLARE_API_TOKEN
  ) {
    if (!accountId || !databaseId || !apiToken) {
      throw new Error(
        "D1_MODE=remote requires CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_API_TOKEN"
      );
    }
    this.endpoint = `${D1_API_BASE}/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
  }

  async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    assertSelectOnly(sql);

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`D1 HTTP API request failed (${res.status}): ${body}`);
    }

    const json = (await res.json()) as D1ApiResponse;
    if (!json.success) {
      const message = json.errors?.map((e) => e.message).join("; ") ?? "unknown D1 error";
      throw new Error(`D1 query failed: ${message}`);
    }

    const first = json.result[0];
    if (!first || !first.success) {
      throw new Error("D1 query returned no successful result set");
    }
    return first.results as T[];
  }

  async ping(): Promise<boolean> {
    try {
      await this.query("SELECT 1 AS ok");
      return true;
    } catch (err) {
      logger.warn("Remote D1 ping failed", err);
      return false;
    }
  }
}
