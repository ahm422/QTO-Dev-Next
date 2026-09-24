import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getChatbotServiceUrl } from "@/config/chat";

/**
 * D1 tables the chatbot worker indexes (must match `table` in chatbot/worker/src/ingestion/
 * registry.ts — the worker rejects unknown names). `technologies` is left out on purpose: it's
 * not embedded, the chatbot reads it live from D1 via its list_records tool.
 */
export type ChatbotSourceTable =
  | "about_content"
  | "blog_posts"
  | "chatbot_faqs"
  | "engagement_models"
  | "faqs"
  | "industries"
  | "jobs"
  | "process_steps"
  | "products"
  | "projects"
  | "services"
  | "team_members"
  | "testimonials";

/**
 * Tells the chatbot worker to re-sync one table right after an admin create/update/delete, so
 * the change shows up in chat answers within seconds instead of waiting for the worker's
 * 15-minute cron. Fire-and-forget: never throws and never delays the admin response — the
 * request is handed to the Workers runtime via `waitUntil`, and any failure is only logged
 * (the cron still picks the change up on its next pass).
 *
 * Requires CHATBOT_SYNC_TOKEN to equal the worker's SYNC_TRIGGER_TOKEN secret.
 */
export function triggerChatbotSync(table: ChatbotSourceTable): void {
  const token = process.env.CHATBOT_SYNC_TOKEN;
  const request = fetch(`${getChatbotServiceUrl()}/sync/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-sync-token": token } : {}),
    },
    body: JSON.stringify({ tables: [table], background: true }),
    signal: AbortSignal.timeout(10_000),
  })
    .then((res) => {
      // 409 = a sync is already running on that isolate; the cron will catch this change.
      if (!res.ok && res.status !== 409) {
        console.error(`[chatbot-sync] ${table}: worker responded ${res.status}`);
      }
    })
    .catch((err) => {
      console.error(`[chatbot-sync] ${table}: request failed`, err);
    });

  try {
    getCloudflareContext().ctx.waitUntil(request);
  } catch {
    // Not running on Workers (e.g. `next dev`) — the promise still runs, just unsupervised.
  }
}
