import { initEnv } from "./config/env.js";
import { createLogger } from "./logger.js";
import { d1 } from "./d1/client.js";
import { vectorStore } from "./vectorstore/vectorize.js";
import { bindConversationKv } from "./conversation/store.js";
import { bindSyncStateKv } from "./sync/stateStore.js";
import { bindRateLimitKv } from "./api/middleware/rateLimit.js";
import { isSyncInProgress, runFullSync } from "./sync/syncEngine.js";
import { createApp } from "./api/server.js";

const logger = createLogger("bootstrap");

/**
 * Wires every binding-backed module to this invocation's `env` — cheap reference
 * assignments, safe to call on every request/scheduled run (idempotent where it matters;
 * see `initEnv`'s own guard). Workers only expose bindings inside a handler, never at
 * module top level, so this replaces the old Node service's one-time `main()` bootstrap.
 */
function bootstrap(env: Env): void {
  initEnv(env as unknown as Record<string, unknown>);
  d1.bind(env.DB);
  vectorStore.bind(env.VECTORIZE, env.AI);
  bindConversationKv(env.CHATBOT_KV);
  bindSyncStateKv(env.CHATBOT_KV);
  bindRateLimitKv(env.CHATBOT_KV);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    bootstrap(env);
    const app = createApp();
    return app.fetch(request, env, ctx);
  },

  /**
   * Cron-triggered background sync (see wrangler.jsonc `triggers.crons`) — replaces the old
   * service's `setInterval`-based scheduler, which can't survive Workers' stateless,
   * per-request execution model. Same skip-if-busy behavior as the old scheduler.
   */
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    bootstrap(env);
    if (isSyncInProgress()) {
      logger.warn("Skipping scheduled sync — previous run is still in progress");
      return;
    }
    ctx.waitUntil(runFullSync().catch((err) => logger.error("Scheduled sync failed", err)));
  },
};
