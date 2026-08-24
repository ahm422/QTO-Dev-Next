import { NextRequest } from "next/server";
import { apiError } from "@/lib/apiResponses";
import { requireAdminSession } from "@/lib/api/requireAdminSession";
import { mockAdminChatProvider } from "@/lib/chat/mockChatProvider";
import { isAsyncIterable } from "@/lib/chat/chatClient";
import type { ChatChunk } from "@/types/chat";

/**
 * Admin ops chat endpoint. Auth-gated to logged-in admin sessions.
 * Currently backed by the in-memory mock provider — swap for the real
 * backend/ticket-system client once it lands; the wire shape stays the same.
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

  const result = mockAdminChatProvider.sendMessage(body.sessionId, body.text);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const write = (chunk: ChatChunk) => controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));

      try {
        if (isAsyncIterable(result)) {
          for await (const chunk of result) write(chunk);
        } else {
          const message = await result;
          write({ messageId: message.id, delta: message.content, done: true, structuredData: message.structuredData, quickReplies: message.quickReplies });
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
