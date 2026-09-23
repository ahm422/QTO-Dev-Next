/**
 * Master feature flag for the chat widgets. Defaults to enabled; set
 * NEXT_PUBLIC_CHAT_ENABLED=false to disable both widgets without a redeploy.
 */
export function isChatEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHAT_ENABLED !== "false";
}

/**
 * Per-surface flag for the public marketing-site widget (the bottom-right
 * chat bubble), independent of the admin ops widget. Defaults to enabled;
 * set NEXT_PUBLIC_CHAT_PUBLIC_ENABLED=false to hide the bubble without a
 * code change. Still gated by the master isChatEnabled() switch.
 */
export function isPublicChatEnabled(): boolean {
  return isChatEnabled() && process.env.NEXT_PUBLIC_CHAT_PUBLIC_ENABLED !== "false";
}

/**
 * Per-surface flag for the admin dashboard ops widget ("QTO Ops Assistant"),
 * independent of the public marketing-site widget. Defaults to enabled; set
 * NEXT_PUBLIC_CHAT_ADMIN_ENABLED=false to hide it without a code change.
 * Still gated by the master isChatEnabled() switch.
 */
export function isAdminChatEnabled(): boolean {
  return isChatEnabled() && process.env.NEXT_PUBLIC_CHAT_ADMIN_ENABLED !== "false";
}

/**
 * Base URL of the standalone `chatbot/` RAG service (server-side only — never exposed to the
 * client, the widgets only ever talk to `/api/chat` / `/api/admin/chat`). Defaults to the
 * service's local dev port; override in production once the service has a real deployment.
 */
export function getChatbotServiceUrl(): string {
  return process.env.CHATBOT_SERVICE_URL ?? "http://localhost:8787";
}

/** Timeout (ms) for a single request to the chatbot backend service. */
export function getChatbotServiceTimeoutMs(): number {
  const raw = Number(process.env.CHATBOT_SERVICE_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 30_000;
}
