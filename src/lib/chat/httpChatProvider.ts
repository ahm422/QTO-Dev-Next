import type { ChatChunk, ChatMessage, ChatVariant, QuickReply } from "@/types/chat";
import type { ChatProvider } from "./chatClient";

/** True when the runtime can read a streamed `fetch` response body incrementally. */
export function supportsStreaming(): boolean {
  return typeof ReadableStream !== "undefined" && typeof TextDecoder !== "undefined";
}

async function readNdjson(response: Response): Promise<ChatChunk[]> {
  const text = await response.text();
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as ChatChunk);
}

async function* streamNdjson(response: Response): AsyncIterable<ChatChunk> {
  const body = response.body;
  if (!body) {
    for (const chunk of await readNdjson(response)) yield chunk;
    return;
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (line) yield JSON.parse(line) as ChatChunk;
      }
    }
    const trailing = buffer.trim();
    if (trailing) yield JSON.parse(trailing) as ChatChunk;
  } finally {
    reader.releaseLock();
  }
}

/**
 * HTTP implementation of `ChatProvider`. Talks to `/api/chat` or `/api/admin/chat`
 * (server-side stub backed by the mock provider today; swap the route handler's
 * internals to call the real backend later — no changes needed here or in the UI).
 */
export function createHttpChatProvider(basePath: "/api/chat" | "/api/admin/chat"): ChatProvider {
  return {
    async getGreeting() {
      const res = await fetch(`${basePath}?action=greeting`, { method: "GET" });
      if (!res.ok) throw new Error(`Failed to load greeting (${res.status})`);
      return (await res.json()) as ChatMessage;
    },

    async getQuickReplies(context: ChatVariant) {
      const res = await fetch(`${basePath}?action=quick-replies&context=${context}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(`Failed to load quick replies (${res.status})`);
      return (await res.json()) as QuickReply[];
    },

    sendMessage(sessionId, text, signal) {
      const request = fetch(basePath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, text }),
        signal,
      }).then((res) => {
        if (!res.ok) throw new Error(`Chat request failed (${res.status})`);
        return res;
      });

      if (!supportsStreaming()) {
        return request.then(async (res) => {
          const chunks = await readNdjson(res);
          return chunksToMessage(chunks);
        });
      }

      return (async function* () {
        const res = await request;
        yield* streamNdjson(res);
      })();
    },
  };
}

function chunksToMessage(chunks: ChatChunk[]): ChatMessage {
  const content = chunks.map((c) => c.delta).join("");
  const last = chunks[chunks.length - 1];
  return {
    id: last?.messageId ?? `msg_${Date.now()}`,
    role: "assistant",
    content,
    createdAt: new Date().toISOString(),
    structuredData: last?.structuredData,
    quickReplies: last?.quickReplies,
  };
}

export const httpPublicChatProvider = createHttpChatProvider("/api/chat");
export const httpAdminChatProvider = createHttpChatProvider("/api/admin/chat");
