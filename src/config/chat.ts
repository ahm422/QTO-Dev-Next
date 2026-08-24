/**
 * Feature flag for the chat widgets. Defaults to enabled; set
 * NEXT_PUBLIC_CHAT_ENABLED=false to disable both widgets without a redeploy.
 */
export function isChatEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CHAT_ENABLED !== "false";
}
