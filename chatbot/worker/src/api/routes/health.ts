import { Hono } from "hono";
import { d1 } from "../../d1/client.js";
import { vectorStore } from "../../vectorstore/vectorize.js";
import { getLastSyncSummary, isSyncInProgress } from "../../sync/syncEngine.js";

export const healthRouter = new Hono();

healthRouter.get("/health", async (c) => {
  const [d1Ok, vectorizeOk] = await Promise.all([d1.ping(), vectorStore.ping()]);
  const status = d1Ok && vectorizeOk ? "ok" : "degraded";

  return c.json(
    {
      status,
      d1: d1Ok,
      vectorize: vectorizeOk,
      syncInProgress: isSyncInProgress(),
      lastSync: getLastSyncSummary(),
    },
    status === "ok" ? 200 : 503
  );
});
