// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useChatWidget } from "./useChatWidget";
import type { ChatProvider } from "@/lib/chat/chatClient";
import type { ChatChunk, ChatMessage, QuickReply } from "@/types/chat";

const QUICK_REPLIES: QuickReply[] = [{ id: "qr1", label: "Pricing", value: "What does it cost?" }];

function greeting(): ChatMessage {
  return {
    id: "greet_1",
    role: "assistant",
    content: "Hi! How can I help?",
    createdAt: new Date().toISOString(),
    quickReplies: QUICK_REPLIES,
  };
}

async function* streamOf(chunks: ChatChunk[]): AsyncIterable<ChatChunk> {
  for (const chunk of chunks) yield chunk;
}

function makeStreamingProvider(): ChatProvider {
  return {
    async getGreeting() {
      return greeting();
    },
    async getQuickReplies() {
      return QUICK_REPLIES;
    },
    sendMessage() {
      return streamOf([
        { messageId: "reply_1", delta: "Sure, ", done: false },
        { messageId: "reply_1", delta: "here you go.", done: true, quickReplies: QUICK_REPLIES },
      ]);
    },
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("useChatWidget", () => {
  it("loads the greeting on mount and becomes ready", async () => {
    const provider = makeStreamingProvider();
    const { result } = renderHook(() => useChatWidget({ provider, variant: "public" }));

    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe("Hi! How can I help?");
    expect(result.current.quickReplies).toEqual(QUICK_REPLIES);
  });

  it("appends streamed chunks into a single growing assistant message", async () => {
    const provider = makeStreamingProvider();
    const { result } = renderHook(() => useChatWidget({ provider, variant: "public" }));
    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => result.current.sendMessage("Hello"));

    await waitFor(() => expect(result.current.isTyping).toBe(false));

    expect(result.current.messages.map((m) => m.role)).toEqual(["assistant", "user", "assistant"]);
    const assistantReply = result.current.messages[2];
    expect(assistantReply.content).toBe("Sure, here you go.");
    expect(assistantReply.pending).toBe(false);
  });

  it("surfaces quick replies returned on the final chunk", async () => {
    const provider = makeStreamingProvider();
    const { result } = renderHook(() => useChatWidget({ provider, variant: "public" }));
    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => result.current.sendQuickReply(QUICK_REPLIES[0]));
    await waitFor(() => expect(result.current.isTyping).toBe(false));

    expect(result.current.quickReplies).toEqual(QUICK_REPLIES);
    expect(result.current.messages.some((m) => m.role === "user" && m.content === "What does it cost?")).toBe(
      true
    );
  });

  it("increments the unread count when a bot message arrives while collapsed", async () => {
    const provider = makeStreamingProvider();
    const { result } = renderHook(() => useChatWidget({ provider, variant: "admin" }));
    await waitFor(() => expect(result.current.ready).toBe(true));

    expect(result.current.open).toBe(false);
    act(() => result.current.sendMessage("Show logs"));
    await waitFor(() => expect(result.current.isTyping).toBe(false));

    expect(result.current.unreadCount).toBe(1);

    act(() => result.current.setOpen(true));
    expect(result.current.unreadCount).toBe(0);
  });

  it("captures a send failure and allows retrying it", async () => {
    const provider: ChatProvider = {
      async getGreeting() {
        return greeting();
      },
      async getQuickReplies() {
        return [];
      },
      sendMessage() {
        return Promise.reject(new Error("network down"));
      },
    };

    const { result } = renderHook(() => useChatWidget({ provider, variant: "public" }));
    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => result.current.sendMessage("Hello"));
    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.error).toContain("network down");

    act(() => result.current.retryLastMessage());
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
