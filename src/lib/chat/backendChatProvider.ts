import type { ChatChunk, ChatVariant } from "@/types/chat";
import { getChatbotServiceTimeoutMs, getChatbotServiceUrl } from "@/config/chat";

/**
 * Streams replies from the standalone `chatbot/` RAG service (see `chatbot/src/api/routes/chat.ts`,
 * `POST /chat/stream`) and translates its SSE wire format into the `ChatChunk` shape the route
 * handlers (`src/app/api/chat/route.ts`, `src/app/api/admin/chat/route.ts`) write out as NDJSON —
 * see docs/chat-widget-contract.md for the contract those handlers must satisfy either way.
 *
 * `getGreeting`/`getQuickReplies` are deliberately NOT proxied here — the backend has no such
 * concept, and the existing `mockChatProvider` canned copy for those two is static UI text, not
 * AI output, so route handlers keep using it directly.
 */

const UNAVAILABLE_MESSAGE = "The assistant is temporarily unavailable. Please try again shortly.";

/**
 * Maps our locally-generated session ids (e.g. "sess_...", see `useChatPersistence.ts`) to the
 * backend's UUID session ids (`z.string().uuid()` in `chatbot/src/api/routes/chat.ts`) — the two
 * formats aren't compatible, so a session's first turn omits `sessionId` and we remember whatever
 * UUID the backend hands back. In-memory, per-instance — resets on restart/redeploy, same
 * limitation the backend's own `conversationStore` already has.
 */
const sessionIdMaps: Record<ChatVariant, Map<string, string>> = {
  public: new Map(),
  admin: new Map(),
};

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
  const sessionMap = sessionIdMaps[variant];
  const backendSessionId = sessionMap.get(sessionId);

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
        ...(backendSessionId ? { sessionId: backendSessionId } : {}),
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
          const parsed = JSON.parse(evt.data) as { sessionId: string; reply: string };
          sessionMap.set(sessionId, parsed.sessionId);
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
