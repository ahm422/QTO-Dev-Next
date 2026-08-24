import { env } from "./config/env.js";
import { createLogger } from "./logger.js";
import { d1 } from "./d1/client.js";
import { vectorStore } from "./vectorstore/qdrant.js";
import { embeddings } from "./embeddings/provider.js";
import { syncStateStore } from "./sync/stateStore.js";
import { runFullSync } from "./sync/syncEngine.js";
import { startScheduler, stopScheduler } from "./sync/scheduler.js";
import { createServer } from "./api/server.js";

const logger = createLogger("bootstrap");

async function main() {
  logger.info("Starting QTO Dev chatbot service...");

  const d1Ok = await d1.ping();
  if (!d1Ok) {
    if (env.D1_MODE === "remote") {
      logger.error(
        "Could not reach D1 via the Cloudflare API. Check CLOUDFLARE_ACCOUNT_ID, " +
          "CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_API_TOKEN in .env."
      );
    } else {
      logger.error(
        "Could not open the local D1 sqlite file. Run `npm run d1:setup` in the main app " +
          "repo root first, or set LOCAL_D1_SQLITE_PATH in .env to point at it directly."
      );
    }
    process.exit(1);
  }
  logger.info(`D1 connectivity OK (read-only, mode=${env.D1_MODE}).`);

  await syncStateStore.load();
  await vectorStore.ensureCollection();
  await embeddings.warmUp();

  if (env.SYNC_ON_STARTUP) {
    logger.info("Running initial sync before accepting traffic...");
    await runFullSync();
  }

  startScheduler();

  const app = createServer();
  const server = app.listen(env.CHAT_PORT, () => {
    logger.info(`Chat API listening on http://localhost:${env.CHAT_PORT}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down...`);
    stopScheduler();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error("Fatal startup error", err);
  process.exit(1);
});
