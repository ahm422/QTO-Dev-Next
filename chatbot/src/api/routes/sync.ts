import { Router } from "express";
import { env } from "../../config/env.js";
import { getLastSyncSummary, isSyncInProgress, runFullSync } from "../../sync/syncEngine.js";
import { createLogger } from "../../logger.js";

const logger = createLogger("sync-route");
export const syncRouter = Router();

/** Manual trigger for an out-of-band sync, e.g. right after an admin edits content. */
syncRouter.post("/sync/run", async (req, res) => {
  if (env.SYNC_TRIGGER_TOKEN) {
    const provided = req.header("x-sync-token");
    if (provided !== env.SYNC_TRIGGER_TOKEN) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  if (isSyncInProgress()) {
    res.status(409).json({ error: "A sync is already in progress" });
    return;
  }

  try {
    const summary = await runFullSync();
    res.json(summary);
  } catch (err) {
    logger.error("Manual sync failed", err);
    res.status(500).json({ error: "Sync failed" });
  }
});

syncRouter.get("/sync/status", (_req, res) => {
  res.json({ inProgress: isSyncInProgress(), lastSync: getLastSyncSummary() });
});
