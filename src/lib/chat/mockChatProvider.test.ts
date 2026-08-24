import { describe, expect, it } from "vitest";
import { isAsyncIterable } from "./chatClient";
import { mockAdminChatProvider, mockPublicChatProvider } from "./mockChatProvider";

async function collect(sessionId: string, provider: typeof mockPublicChatProvider, text: string) {
  const result = provider.sendMessage(sessionId, text);
  if (!isAsyncIterable(result)) throw new Error("expected a streamed response");
  const chunks = [];
  for await (const chunk of result) chunks.push(chunk);
  return chunks;
}

describe("mockPublicChatProvider", () => {
  it("returns a greeting with quick replies", async () => {
    const greeting = await mockPublicChatProvider.getGreeting();
    expect(greeting.role).toBe("assistant");
    expect(greeting.quickReplies?.length).toBeGreaterThan(0);
  });

  it("returns public quick replies for the public context", async () => {
    const replies = await mockPublicChatProvider.getQuickReplies("public");
    expect(replies.map((r) => r.label)).toEqual(["Our services", "Book a call", "Pricing"]);
  });

  it("streams a reply as a sequence of chunks ending with done:true", async () => {
    const chunks = await collect("session-1", mockPublicChatProvider, "What services do you offer?");
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.every((c) => c.messageId === chunks[0].messageId)).toBe(true);
    expect(chunks[chunks.length - 1].done).toBe(true);

    const fullText = chunks.map((c) => c.delta).join("");
    expect(fullText).toMatch(/web platform engineering/i);
  });
});

describe("mockAdminChatProvider", () => {
  it("returns admin quick replies for the admin context", async () => {
    const replies = await mockAdminChatProvider.getQuickReplies("admin");
    expect(replies.map((r) => r.label)).toEqual(["Show logs", "Open runbook", "Escalate"]);
  });

  it("attaches a structured deploy summary card when asked for logs", async () => {
    const chunks = await collect("session-2", mockAdminChatProvider, "Show me the latest logs.");
    const last = chunks[chunks.length - 1];
    expect(last.structuredData?.[0]?.id).toBe("deploy_summary");
    expect(last.structuredData?.[0]?.fields.find((f) => f.label === "status")?.status).toBe("error");
  });
});
