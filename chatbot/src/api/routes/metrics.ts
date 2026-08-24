import { Router } from "express";
import { SOURCE_REGISTRY } from "../../ingestion/registry.js";
import { getLastSyncSummary, isSyncInProgress } from "../../sync/syncEngine.js";
import { env } from "../../config/env.js";

export const metricsRouter = Router();

/**
 * Answers "how much of D1 can this chatbot see, and what did the last sync do."
 * Not per-request data (that's in each /chat response's `sources`/`timing`) —
 * this is the standing shape of the index: which tables, how many, current sync state.
 */
metricsRouter.get("/metrics", (_req, res) => {
  const lastSync = getLastSyncSummary();

  res.json({
    sources: {
      count: SOURCE_REGISTRY.length,
      tables: SOURCE_REGISTRY.map((s) => s.table),
      // Subset of `tables` actually embedded into Qdrant / eligible as /chat sources.
      // A table can be allowlisted (readable) without being searchable — see technologies.
      searchableTables: SOURCE_REGISTRY.filter((s) => s.embeddable !== false).map((s) => s.table),
    },
    retrieval: {
      topK: env.RETRIEVAL_TOP_K,
      scoreThreshold: env.RETRIEVAL_SCORE_THRESHOLD,
    },
    sync: {
      inProgress: isSyncInProgress(),
      intervalMinutes: env.SYNC_INTERVAL_MINUTES,
      last: lastSync,
    },
    uptimeSeconds: Math.round(process.uptime()),
  });
});
