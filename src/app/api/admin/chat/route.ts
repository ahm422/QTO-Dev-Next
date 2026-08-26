import { NextRequest } from "next/server";
import { apiError } from "@/lib/apiResponses";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { mockAdminChatProvider } from "@/lib/chat/mockChatProvider";
import { getClientIp, sendBackendChatMessage } from "@/lib/chat/backendChatProvider";
import type { ChatChunk } from "@/types/chat";

/**
 * Admin ops chat endpoint. Auth-gated to logged-in admin sessions. Greeting/quick-replies are
 * static UI copy, served from the mock provider; message sending is proxied to the real
 * `chatbot/` RAG service (see `src/lib/chat/backendChatProvider.ts`) — there is no separate
 * ticket-system-aware backend yet, so both widgets currently share the same RAG service.
 */
export async function GET(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "greeting") {
    const greeting = await mockAdminChatProvider.getGreeting();
    return Response.json(greeting);
  }

  if (action === "quick-replies") {
    const replies = await mockAdminChatProvider.getQuickReplies("admin");
    return Response.json(replies);
  }

  return apiError(400, "Unknown action");
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdminSession();
  if (error) return error;

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
    "admin",
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
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
