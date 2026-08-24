import { env } from "../config/env.js";
import { createLogger } from "../logger.js";
import { isSyncInProgress, runFullSync } from "./syncEngine.js";

const logger = createLogger("scheduler");

let intervalHandle: NodeJS.Timeout | null = null;

/**
 * Runs `runFullSync()` every SYNC_INTERVAL_MINUTES, forever, without any manual
 * intervention. This is what makes newly-created/edited/deleted/unpublished CMS
 * rows in D1 show up in (or drop out of) the chatbot's answers automatically.
 *
 * Deliberately a simple in-process interval, not Cloudflare Cron Triggers or a
 * queue: this service runs as a normal long-lived Node process (see README.md),
 * not inside a Cloudflare Worker, so a plain interval is the natural fit and
 * needs no extra infrastructure. `POST /sync/run` and `npm run sync:once` are
 * available for on-demand runs alongside this loop.
 */
export function startScheduler(): void {
  if (intervalHandle) return;
  const intervalMs = env.SYNC_INTERVAL_MINUTES * 60_000;

  intervalHandle = setInterval(async () => {
    if (isSyncInProgress()) {
      logger.warn("Skipping scheduled sync — previous run is still in progress");
      return;
    }
    try {
      await runFullSync();
    } catch (err) {
      logger.error("Scheduled sync failed", err);
    }
  }, intervalMs);

  // Don't let the interval keep the process alive on its own if something else shuts it down.
  intervalHandle.unref();
  logger.info(`Background sync scheduled every ${env.SYNC_INTERVAL_MINUTES} minute(s).`);
}

export function stopScheduler(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}
