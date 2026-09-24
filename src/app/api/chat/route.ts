import { NextRequest } from "next/server";
import { apiError } from "@/lib/apiResponses";
import { mockPublicChatProvider } from "@/lib/chat/mockChatProvider";
import { getClientIp, sendBackendChatMessage } from "@/lib/chat/backendChatProvider";
import type { ChatChunk } from "@/types/chat";

/**
 * Public chat endpoint. Greeting/quick-replies are static UI copy, served from the mock
 * provider; message sending is proxied to the real `chatbot/` RAG service (see
 * `src/lib/chat/backendChatProvider.ts`). Wire shape is documented in docs/chat-widget-contract.md.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "greeting") {
    const greeting = await mockPublicChatProvider.getGreeting();
    return Response.json(greeting);
  }

  if (action === "quick-replies") {
    const replies = await mockPublicChatProvider.getQuickReplies("public");
    return Response.json(replies);
  }

  return apiError(400, "Unknown action");
}

export async function POST(request: NextRequest) {
  let body: { sessionId?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return apiError(400, "Invalid JSON body");
  }

  if (!body.sessionId || !body.text) {
    return apiError(400, "sessionId and text are required");
  }

  const result = sendBackendChatMessage(
    "public",
    body.sessionId,
    body.text,
    request.signal,
    getClientIp(request.headers)
  );

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const write = (chunk: ChatChunk) => controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));

      try {
        for await (const chunk of result) write(chunk);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      // Keep proxies/Cloudflare from compressing or buffering the stream — tokens must flush as sent.
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
