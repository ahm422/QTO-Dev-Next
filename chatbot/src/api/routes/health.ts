import { Router } from "express";
import { d1 } from "../../d1/client.js";
import { vectorStore } from "../../vectorstore/qdrant.js";
import { getLastSyncSummary, isSyncInProgress } from "../../sync/syncEngine.js";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  const [d1Ok, qdrantOk] = await Promise.all([d1.ping(), vectorStore.ping()]);
  const status = d1Ok && qdrantOk ? "ok" : "degraded";

  res.status(status === "ok" ? 200 : 503).json({
    status,
    d1: d1Ok,
    qdrant: qdrantOk,
    syncInProgress: isSyncInProgress(),
    lastSync: getLastSyncSummary(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});
