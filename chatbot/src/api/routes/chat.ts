import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { env } from "../../config/env.js";
import { conversationStore } from "../../conversation/store.js";
import { handleChatMessage, streamChatMessage } from "../../rag/chatService.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { sendApiError } from "../errors.js";
import { createLogger } from "../../logger.js";

const logger = createLogger("chat-route");
export const chatRouter = Router();

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Deliberately loose here — no length limits in the schema itself. Length/word-count
// checks are done manually below so each failure gets its own friendly, specific
// message instead of Zod's technical "message must be at most N characters" text.
const chatRequestSchema = z.object({
  message: z.string(),
  sessionId: z.string().uuid().optional(),
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
function validateChatRequest(req: Request, res: Response): ValidatedChatRequest | null {
  const parsed = chatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    sendApiError(
      res,
      400,
      "VALIDATION_ERROR",
      "Your request is missing a message. Please type something and try again."
    );
    return null;
  }

  const message = parsed.data.message.trim();

  if (message.length === 0) {
    sendApiError(res, 400, "MESSAGE_EMPTY", "Please enter a message before sending.");
    return null;
  }

  if (message.length > env.CHAT_MAX_MESSAGE_LENGTH || wordCount(message) > env.CHAT_MAX_MESSAGE_WORDS) {
    sendApiError(
      res,
      400,
      "MESSAGE_TOO_LONG",
      `Your message is longer than I can process — please keep it under ${env.CHAT_MAX_MESSAGE_WORDS} words and try again.`
    );
    return null;
  }

  const sessionId =
    parsed.data.sessionId && conversationStore.hasSession(parsed.data.sessionId)
      ? parsed.data.sessionId
      : conversationStore.createSession();

  return { message, sessionId };
}

chatRouter.post("/chat", rateLimit, async (req, res) => {
  const validated = validateChatRequest(req, res);
  if (!validated) return;

  try {
    const result = await handleChatMessage(validated.sessionId, validated.message);
    // `sources`/`timing`/`toolsUsed` are retrieval/latency internals — useful for debugging
    // (still logged server-side by chatService), but not something a customer-facing widget
    // should render. Gated behind CHAT_EXPOSE_DEBUG_INFO, off by default.
    if (env.CHAT_EXPOSE_DEBUG_INFO) {
      res.json(result);
    } else {
      res.json({ sessionId: result.sessionId, reply: result.reply });
    }
  } catch (err) {
    logger.error("Chat request failed", err);
    sendApiError(
      res,
      502,
      "UPSTREAM_ERROR",
      "The assistant is temporarily unavailable. Please try again shortly."
    );
  }
});

function writeSse(res: Response, event: string, data: unknown): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Server-Sent Events variant of /chat — same request contract, but the reply streams as
 * `token` events as the LLM generates it, ending with one `done` event carrying the same
 * shape /chat returns (same CHAT_EXPOSE_DEBUG_INFO gating), or an `error` event if the turn
 * fails partway through (by then an HTTP error status can't be sent — headers are already
 * flushed as text/event-stream).
 */
chatRouter.post("/chat/stream", rateLimit, async (req, res) => {
  const validated = validateChatRequest(req, res);
  if (!validated) return;

  res.status(200).set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  // Note: listen on `res`, not `req` — `req`'s "close" fires once the request body has been
  // fully read (which already happened in express.json() before this handler even runs), so it
  // is not a signal the client disconnected. `res`'s "close" fires when the underlying
  // connection actually terminates, which is what we want to detect here.
  const abortController = new AbortController();
  res.on("close", () => abortController.abort());

  try {
    for await (const event of streamChatMessage(validated.sessionId, validated.message)) {
      if (abortController.signal.aborted) break;

      if (event.type === "token") {
        writeSse(res, "token", { content: event.content });
      } else if (event.type === "done") {
        writeSse(
          res,
          "done",
          env.CHAT_EXPOSE_DEBUG_INFO
            ? event.result
            : { sessionId: event.result.sessionId, reply: event.result.reply }
        );
      } else {
        writeSse(res, "error", { error: { type: "UPSTREAM_ERROR", message: event.message } });
      }
    }
  } catch (err) {
    logger.error("Chat stream failed", err);
    if (!res.writableEnded) {
      writeSse(res, "error", {
        error: {
          type: "UPSTREAM_ERROR",
          message: "The assistant is temporarily unavailable. Please try again shortly.",
        },
      });
    }
  } finally {
    if (!res.writableEnded) res.end();
  }
});
