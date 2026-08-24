import { vectorStore } from "../vectorstore/qdrant.js";
import { syncStateStore } from "../sync/stateStore.js";
import { runFullSync } from "../sync/syncEngine.js";
import { createLogger } from "../logger.js";

const logger = createLogger("reindex-all");

/**
 * Forces a full rebuild: drops and recreates the Qdrant collection, wipes local
 * sync state, then re-ingests everything from D1 from scratch. Use this as the
 * manual repair path if the index and D1 ever drift (e.g. after Qdrant data loss,
 * or a change to the embedding model / chunking strategy that invalidates old vectors).
 */
async function main() {
  logger.warn("Recreating Qdrant collection and wiping local sync state...");
  await syncStateStore.load();
  syncStateStore.reset();
  await syncStateStore.save();
  await vectorStore.recreateCollection();

  const summary = await runFullSync();
  logger.info("Full reindex complete.", summary);
  process.exit(0);
}

main().catch((err) => {
  logger.error("reindex:all failed", err);
  process.exit(1);
});
