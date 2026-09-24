import { Hono } from "hono";
import { z } from "zod";
import { env } from "../../config/env.js";
import { SOURCE_REGISTRY } from "../../ingestion/registry.js";
import { vectorStore } from "../../vectorstore/vectorize.js";
import { syncStateStore } from "../../sync/stateStore.js";
import { getLastSyncSummary, isSyncInProgress, runFullSync } from "../../sync/syncEngine.js";
import { createLogger } from "../../logger.js";
import { sendApiError } from "../errors.js";

const logger = createLogger("sync-route");
export const syncRouter = new Hono();

function checkSyncToken(c: import("hono").Context): boolean {
  if (!env.SYNC_TRIGGER_TOKEN) return true;
  return c.req.header("x-sync-token") === env.SYNC_TRIGGER_TOKEN;
}

const syncRunSchema = z
  .object({
    /** Sync only these source tables; omitted = every registered source. */
    tables: z.array(z.string()).min(1).optional(),
    /** Respond 202 immediately and finish the sync in the background (waitUntil). */
    background: z.boolean().optional(),
  })
  .default({});

/**
 * Out-of-band sync trigger. With no body it runs a full sync and returns the summary (manual
 * use). The main site's admin API calls it after every content save with
 * `{ tables: [<changed table>], background: true }` so new/edited/deleted records reach the
 * chatbot within seconds instead of waiting for the cron — see src/lib/chat/triggerChatbotSync.ts
 * in the main app. Background runs are limited to one table each so they finish well inside
 * waitUntil's post-response budget; anything missed is still caught by the next cron pass.
 */
syncRouter.post("/sync/run", async (c) => {
  if (!checkSyncToken(c)) return sendApiError(c, 401, "UNAUTHORIZED", "Unauthorized");

  let rawBody: unknown = undefined;
  if ((c.req.header("content-type") ?? "").includes("application/json")) {
    try {
      rawBody = await c.req.json();
    } catch {
      return sendApiError(c, 400, "MALFORMED_REQUEST", "Request body must be valid JSON.");
    }
  }
  const parsed = syncRunSchema.safeParse(rawBody);
  if (!parsed.success) return sendApiError(c, 400, "VALIDATION_ERROR", "Invalid sync request.");

  const { tables, background } = parsed.data;
  const known = new Set(SOURCE_REGISTRY.map((s) => s.table));
  const unknown = tables?.filter((t) => !known.has(t)) ?? [];
  if (unknown.length) {
    return sendApiError(c, 400, "VALIDATION_ERROR", `Unknown source table(s): ${unknown.join(", ")}`);
  }

  if (isSyncInProgress()) {
    return sendApiError(c, 409, "SYNC_IN_PROGRESS", "A sync is already in progress");
  }

  if (background) {
    c.executionCtx.waitUntil(
      runFullSync({ tables }).catch((err) => logger.error("Background sync failed", err))
    );
    return c.json({ accepted: true, tables: tables ?? "all" }, 202);
  }

  try {
    const summary = await runFullSync({ tables });
    return c.json(summary);
  } catch (err) {
    logger.error("Manual sync failed", err);
    return sendApiError(c, 500, "INTERNAL_ERROR", "Sync failed");
  }
});

syncRouter.get("/sync/status", (c) => {
  return c.json({ inProgress: isSyncInProgress(), lastSync: getLastSyncSummary() });
});

/**
 * Full rebuild: deletes every currently-tracked vector for every registered source, wipes
 * KV sync state, then runs a full sync from scratch so nothing is skipped as "unchanged".
 * Replaces the old service's standalone `npm run reindex:all` CLI script — the Worker has
 * no equivalent way to run an ad-hoc local script against its own bindings, so this became
 * an admin-guarded route instead (same `x-sync-token` gate as /sync/run).
 */
syncRouter.post("/sync/reindex", async (c) => {
  if (!checkSyncToken(c)) return sendApiError(c, 401, "UNAUTHORIZED", "Unauthorized");

  if (isSyncInProgress()) {
    return sendApiError(c, 409, "SYNC_IN_PROGRESS", "A sync is already in progress");
  }

  try {
    const tables = SOURCE_REGISTRY.map((s) => s.table);
    const allPointIds: string[] = [];
    for (const table of tables) {
      const state = await syncStateStore.listForTable(table);
      for (const { pointIds } of state.values()) allPointIds.push(...pointIds);
    }
    await vectorStore.deletePoints(allPointIds);
    await syncStateStore.reset(tables);

    logger.info(`Reindex: cleared ${allPointIds.length} vectors across ${tables.length} tables, running full sync...`);
    const summary = await runFullSync();
    return c.json(summary);
  } catch (err) {
    logger.error("Reindex failed", err);
    return sendApiError(c, 500, "INTERNAL_ERROR", "Reindex failed");
  }
});
