import type { ChatChunk, ChatVariant } from "@/types/chat";
import { getChatbotServiceTimeoutMs, getChatbotServiceUrl } from "@/config/chat";

/**
 * Streams replies from the standalone `chatbot/` RAG service (see `chatbot/src/api/routes/chat.ts`,
 * `POST /chat/stream`) and translates its SSE wire format into the `ChatChunk` shape the route
 * handlers (`src/app/api/chat/route.ts`, `src/app/api/admin/chat/route.ts`) write out as NDJSON —
 * see src/types/chat.ts for the contract those handlers must satisfy either way.
 *
 * `getGreeting`/`getQuickReplies` are deliberately NOT proxied here — the backend has no such
 * concept, and the existing `mockChatProvider` canned copy for those two is static UI text, not
 * AI output, so route handlers keep using it directly.
 */

const UNAVAILABLE_MESSAGE = "The assistant is temporarily unavailable. Please try again shortly.";

/**
 * The backend keys conversation history (KV, see `chatbot/worker/src/conversation/store.ts`)
 * directly by the session id we send, so we pass the widget's own localStorage session id
 * (see `useChatPersistence.ts`) — prefixed by variant so public and admin chats never share
 * history. No server-side id mapping: that would live in per-isolate memory and be lost
 * between requests on Workers, which is what used to make the bot forget earlier turns.
 */
function backendSessionId(variant: ChatVariant, sessionId: string): string {
  return `${variant}_${sessionId}`;
}

interface SseEvent {
  event: string;
  data: string;
}

/** Splits a chunk of `text/event-stream` bytes into complete events, carrying over any partial trailing event. */
function parseSseEvents(chunkText: string, buffer: string): { events: SseEvent[]; remainder: string } {
  const combined = buffer + chunkText;
  const parts = combined.split("\n\n");
  const remainder = parts.pop() ?? "";
  const events: SseEvent[] = [];

  for (const part of parts) {
    let eventName = "message";
    const dataLines: string[] = [];
    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) eventName = line.slice("event:".length).trim();
      else if (line.startsWith("data:")) dataLines.push(line.slice("data:".length).trim());
    }
    if (dataLines.length > 0) events.push({ event: eventName, data: dataLines.join("\n") });
  }

  return { events, remainder };
}

function newMessageId(): string {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Best-effort real client IP from an incoming request's headers, for rate-limit forwarding. */
export function getClientIp(headers: Headers): string | undefined {
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim();
  return undefined;
}

/**
 * Sends one message to the real chatbot backend and streams the reply as `ChatChunk`s.
 * Never throws — a fallback single chunk (`done: true`) is yielded on any failure (unreachable
 * backend, timeout, malformed stream) so the widget degrades gracefully instead of breaking.
 *
 * @param clientIp forwarded as `X-Forwarded-For` so the backend's per-IP rate limiter
 *   (`chatbot/src/api/middleware/rateLimit.ts`) sees real visitors rather than collapsing every
 *   request onto this Next.js server's own IP.
 */
export async function* sendBackendChatMessage(
  variant: ChatVariant,
  sessionId: string,
  text: string,
  signal?: AbortSignal,
  clientIp?: string
): AsyncIterable<ChatChunk> {
  const messageId = newMessageId();

  const timeoutSignal = AbortSignal.timeout(getChatbotServiceTimeoutMs());
  const combinedSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(`${getChatbotServiceUrl()}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify({
        message: text,
        sessionId: backendSessionId(variant, sessionId),
      }),
      signal: combinedSignal,
    });
  } catch {
    yield { messageId, delta: UNAVAILABLE_MESSAGE, done: true };
    return;
  }

  if (!response.ok || !response.body) {
    yield { messageId, delta: UNAVAILABLE_MESSAGE, done: true };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;

      const { events, remainder } = parseSseEvents(decoder.decode(value, { stream: true }), buffer);
      buffer = remainder;

      for (const evt of events) {
        if (evt.event === "token") {
          const parsed = JSON.parse(evt.data) as { content: string };
          yield { messageId, delta: parsed.content, done: false };
        } else if (evt.event === "done") {
          completed = true;
          yield { messageId, delta: "", done: true };
          return;
        } else if (evt.event === "error") {
          completed = true;
          yield { messageId, delta: UNAVAILABLE_MESSAGE, done: true };
          return;
        }
      }
    }

    // Stream closed without a `done`/`error` event (e.g. connection dropped mid-response) —
    // the client is still waiting on a final chunk, so give it one.
    if (!completed) {
      yield { messageId, delta: UNAVAILABLE_MESSAGE, done: true };
    }
  } catch {
    if (!completed) {
      yield { messageId, delta: UNAVAILABLE_MESSAGE, done: true };
    }
  } finally {
    reader.releaseLock();
  }
}
