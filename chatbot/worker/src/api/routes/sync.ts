import { Hono } from "hono";
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

/** Manual trigger for an out-of-band sync, e.g. right after an admin edits content. */
syncRouter.post("/sync/run", async (c) => {
  if (!checkSyncToken(c)) return sendApiError(c, 401, "UNAUTHORIZED", "Unauthorized");

  if (isSyncInProgress()) {
    return sendApiError(c, 409, "SYNC_IN_PROGRESS", "A sync is already in progress");
  }

  try {
    const summary = await runFullSync();
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
