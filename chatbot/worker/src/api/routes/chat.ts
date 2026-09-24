import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";
import { env } from "../../config/env.js";
import { conversationStore } from "../../conversation/store.js";
import { handleChatMessage, streamChatMessage } from "../../rag/chatService.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { sendApiError } from "../errors.js";
import { createLogger } from "../../logger.js";

const logger = createLogger("chat-route");
export const chatRouter = new Hono();

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Deliberately loose here — no length limits in the schema itself. Length/word-count
// checks are done manually below so each failure gets its own friendly, specific
// message instead of Zod's technical "message must be at most N characters" text.
// sessionId is the caller's own id (the main site sends its localStorage widget session id),
// used directly as the KV key — so history survives across isolates without any id mapping.
// Restricted to a safe charset/length since it becomes part of a KV key.
const chatRequestSchema = z.object({
  message: z.string(),
  sessionId: z.string().regex(/^[A-Za-z0-9_-]{8,128}$/).optional(),
});

interface ValidatedChatRequest {
  message: string;
  sessionId: string;
}

/**
 * Shared validation + session resolution for both /chat and /chat/stream. Returns null
 * (having already written the error response) on any validation failure, so both routes
 * can just bail out on a null return.
 */
async function validateChatRequest(
  c: import("hono").Context
): Promise<ValidatedChatRequest | { error: Response }> {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return { error: sendApiError(c, 400, "MALFORMED_REQUEST", "Request body must be valid JSON.") };
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return {
      error: sendApiError(
        c,
        400,
        "VALIDATION_ERROR",
        "Your request is missing a message. Please type something and try again."
      ),
    };
  }

  const message = parsed.data.message.trim();

  if (message.length === 0) {
    return { error: sendApiError(c, 400, "MESSAGE_EMPTY", "Please enter a message before sending.") };
  }

  if (message.length > env.CHAT_MAX_MESSAGE_LENGTH || wordCount(message) > env.CHAT_MAX_MESSAGE_WORDS) {
    return {
      error: sendApiError(
        c,
        400,
        "MESSAGE_TOO_LONG",
        `Your message is longer than I can process — please keep it under ${env.CHAT_MAX_MESSAGE_WORDS} words and try again.`
      ),
    };
  }

  // A caller-supplied id is used as-is, whether or not it has history yet — an unknown id
  // simply starts a fresh session under that key. Only a missing id gets a server-generated one.
  const sessionId = parsed.data.sessionId ?? conversationStore.createSession();

  return { message, sessionId };
}

function isError(result: ValidatedChatRequest | { error: Response }): result is { error: Response } {
  return "error" in result;
}

chatRouter.post("/chat", rateLimit, async (c) => {
  const validated = await validateChatRequest(c);
  if (isError(validated)) return validated.error;

  try {
    const result = await handleChatMessage(validated.sessionId, validated.message);
    // `sources`/`timing`/`toolsUsed` are retrieval/latency internals — useful for debugging
    // (still logged server-side by chatService), but not something a customer-facing widget
    // should render. Gated behind CHAT_EXPOSE_DEBUG_INFO, off by default.
    if (env.CHAT_EXPOSE_DEBUG_INFO) {
      return c.json(result);
    }
    return c.json({ sessionId: result.sessionId, reply: result.reply });
  } catch (err) {
    logger.error("Chat request failed", err);
    return sendApiError(
      c,
      502,
      "UPSTREAM_ERROR",
      "The assistant is temporarily unavailable. Please try again shortly."
    );
  }
});

/**
 * Server-Sent Events variant of /chat — same request contract, but the reply streams as
 * `token` events as the LLM generates it, ending with one `done` event carrying the same
 * shape /chat returns (same CHAT_EXPOSE_DEBUG_INFO gating), or an `error` event if the turn
 * fails partway through. This is the only endpoint the main site's chat widgets call
 * (via src/lib/chat/backendChatProvider.ts) — its event names and `done` payload shape are
 * a fixed contract with that caller, not just an implementation detail of this route.
 */
chatRouter.post("/chat/stream", rateLimit, async (c) => {
  const validated = await validateChatRequest(c);
  if (isError(validated)) return validated.error;
  const { sessionId, message } = validated;

  // No `onError` callback passed to streamSSE: Hono's own SSE runner writes an extra,
  // plain-text (non-JSON) "error" frame after whatever an onError callback writes, which
  // would break the JSON-only error-event contract backendChatProvider.ts expects. Instead
  // every failure is caught inside this callback so nothing escapes to that wrapper.
  return streamSSE(c, async (stream) => {
    try {
      for await (const event of streamChatMessage(sessionId, message)) {
        if (stream.closed) break;

        if (event.type === "token") {
          await stream.writeSSE({ event: "token", data: JSON.stringify({ content: event.content }) });
        } else if (event.type === "done") {
          const payload = env.CHAT_EXPOSE_DEBUG_INFO
            ? event.result
            : { sessionId: event.result.sessionId, reply: event.result.reply };
          await stream.writeSSE({ event: "done", data: JSON.stringify(payload) });
        } else {
          await stream.writeSSE({
            event: "error",
            data: JSON.stringify({ error: { type: "UPSTREAM_ERROR", message: event.message } }),
          });
        }
      }
    } catch (err) {
      logger.error("Chat stream failed", err);
      if (!stream.closed) {
        await stream.writeSSE({
          event: "error",
          data: JSON.stringify({
            error: {
              type: "UPSTREAM_ERROR",
              message: "The assistant is temporarily unavailable. Please try again shortly.",
            },
          }),
        });
      }
    }
  });
});
