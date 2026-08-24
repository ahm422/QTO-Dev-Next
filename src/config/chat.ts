/**
 * Master feature flag for the chat widgets. Defaults to enabled; set
 * NEXT_PUBLIC_CHAT_ENABLED=false to disable both widgets without a redeploy.
 */
export function isChatEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHAT_ENABLED !== "false";
}

/**
 * Per-surface flag for the public marketing-site widget (the bottom-right
 * chat bubble), independent of the admin ops widget. Defaults to disabled —
 * set NEXT_PUBLIC_CHAT_PUBLIC_ENABLED=true to bring the bubble back without a
 * code change. Still gated by the master isChatEnabled() switch.
 */
export function isPublicChatEnabled(): boolean {
  return isChatEnabled() && process.env.NEXT_PUBLIC_CHAT_PUBLIC_ENABLED === "true";
}
