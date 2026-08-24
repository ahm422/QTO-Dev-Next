import { vectorStore } from "../vectorstore/qdrant.js";
import { syncStateStore } from "../sync/stateStore.js";
import { runFullSync } from "../sync/syncEngine.js";
import { createLogger } from "../logger.js";

const logger = createLogger("sync-once");

async function main() {
  await syncStateStore.load();
  await vectorStore.ensureCollection();
  const summary = await runFullSync();
  logger.info("Done.", summary);
  process.exit(0);
}

main().catch((err) => {
  logger.error("sync:once failed", err);
  process.exit(1);
});
