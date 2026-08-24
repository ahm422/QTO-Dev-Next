import type { ChatChunk, ChatMessage, ChatVariant, QuickReply } from "@/types/chat";

/**
 * Contract every chat backend must satisfy — mock today, real HTTP/AI backend later,
 * with zero UI changes on either side of the swap.
 *
 * `sendMessage` may return either:
 *  - an `AsyncIterable<ChatChunk>` for a streamed response, or
 *  - a `Promise<ChatMessage>` for a single-shot response.
 * Callers (see `useChatWidget`) feature-detect which shape came back.
 */
export interface ChatProvider {
  sendMessage(
    sessionId: string,
    text: string,
    signal?: AbortSignal
  ): AsyncIterable<ChatChunk> | Promise<ChatMessage>;

  getGreeting(): Promise<ChatMessage>;

  getQuickReplies(context: ChatVariant): Promise<QuickReply[]>;
}

/** Type guard distinguishing a streamed response from a single-shot one. */
export function isAsyncIterable(
  value: AsyncIterable<ChatChunk> | Promise<ChatMessage>
): value is AsyncIterable<ChatChunk> {
  return typeof (value as AsyncIterable<ChatChunk>)[Symbol.asyncIterator] === "function";
}
