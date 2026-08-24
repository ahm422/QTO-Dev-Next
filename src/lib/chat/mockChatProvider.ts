import type { ChatChunk, ChatMessage, ChatVariant, QuickReply, StructuredDataBlock } from "@/types/chat";
import type { ChatProvider } from "./chatClient";

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

function assistantMessage(content: string, extra?: Partial<ChatMessage>): ChatMessage {
  return {
    id: id("msg"),
    role: "assistant",
    content,
    createdAt: now(),
    ...extra,
  };
}

const PUBLIC_QUICK_REPLIES: QuickReply[] = [
  { id: "qr_services", label: "Our services", value: "What services do you offer?" },
  { id: "qr_book_call", label: "Book a call", value: "I'd like to book a call." },
  { id: "qr_pricing", label: "Pricing", value: "What does it cost?" },
];

const ADMIN_QUICK_REPLIES: QuickReply[] = [
  { id: "qr_logs", label: "Show logs", value: "Show me the latest logs." },
  { id: "qr_runbook", label: "Open runbook", value: "Open the incident runbook." },
  { id: "qr_escalate", label: "Escalate", value: "Escalate this ticket." },
];

const DEPLOY_SUMMARY: StructuredDataBlock = {
  id: "deploy_summary",
  title: "Deploy Summary",
  subtitle: "deploy_id: dpl_8f2a1c",
  fields: [
    { label: "deploy_id", value: "dpl_8f2a1c", status: "neutral" },
    { label: "status", value: "failed", status: "error" },
    { label: "duration", value: "2m 14s", status: "neutral" },
  ],
};

/** Canned public-site answers, matched loosely against the incoming text. */
function publicReply(text: string): ChatMessage {
  const lower = text.toLowerCase();

  if (lower.includes("service")) {
    return assistantMessage(
      "We offer web platform engineering, CMS/content architecture, and ongoing product delivery — happy to go deeper on any of those.",
      { quickReplies: PUBLIC_QUICK_REPLIES }
    );
  }

  if (lower.includes("book") || lower.includes("call")) {
    return assistantMessage(
      "Sure — you can book a 20-minute intro call here: qto.company/book-a-call. Anything specific you'd like to cover?",
      { quickReplies: PUBLIC_QUICK_REPLIES }
    );
  }

  if (lower.includes("pric")) {
    return assistantMessage(
      "Pricing depends on scope — most engagements start with a fixed-fee discovery sprint. Want me to have someone follow up with details?",
      { quickReplies: PUBLIC_QUICK_REPLIES }
    );
  }

  return assistantMessage(
    "Thanks for reaching out! I'm the QTO Assistant — I can help with services, pricing, or booking a call.",
    { quickReplies: PUBLIC_QUICK_REPLIES }
  );
}

/** Canned admin ops answers, matched loosely against the incoming text. */
function adminReply(text: string): ChatMessage {
  const lower = text.toLowerCase();

  if (lower.includes("log")) {
    return assistantMessage(
      "Pulled the latest logs for ticket #TCK-4471 — the last deploy failed during the migration step.",
      { quickReplies: ADMIN_QUICK_REPLIES, structuredData: [DEPLOY_SUMMARY] }
    );
  }

  if (lower.includes("runbook")) {
    return assistantMessage(
      "Opening the incident runbook for deploy failures — step 1: verify migration state, step 2: roll back if unresolved after 10 minutes.",
      { quickReplies: ADMIN_QUICK_REPLIES }
    );
  }

  if (lower.includes("escalate")) {
    return assistantMessage("Escalated ticket #TCK-4471 to the on-call engineer.", {
      quickReplies: ADMIN_QUICK_REPLIES,
    });
  }

  return assistantMessage(
    "QTO Ops Assistant here — I can show logs, open the runbook, or escalate the current ticket.",
    { quickReplies: ADMIN_QUICK_REPLIES }
  );
}

/** Splits a reply into small chunks to simulate a streamed response. */
async function* streamReply(message: ChatMessage): AsyncIterable<ChatChunk> {
  const words = message.content.split(" ");
  const chunkSize = 3;

  for (let i = 0; i < words.length; i += chunkSize) {
    // Simulate network/generation latency between chunks.
    await new Promise((resolve) => setTimeout(resolve, 40));
    const slice = words.slice(i, i + chunkSize).join(" ");
    const isLast = i + chunkSize >= words.length;
    yield {
      messageId: message.id,
      delta: i === 0 ? slice : ` ${slice}`,
      done: isLast,
      ...(isLast
        ? { structuredData: message.structuredData, quickReplies: message.quickReplies }
        : {}),
    };
  }
}

/**
 * In-memory mock implementation of `ChatProvider`. Used directly by the widgets today,
 * and by the stub `/api/chat` and `/api/admin/chat` route handlers.
 */
export function createMockChatProvider(variant: ChatVariant): ChatProvider {
  return {
    async getGreeting() {
      return variant === "public"
        ? assistantMessage("Hi! I'm the QTO Assistant. How can I help today?", {
            quickReplies: PUBLIC_QUICK_REPLIES,
          })
        : assistantMessage("QTO Ops Assistant ready. What do you need?", {
            quickReplies: ADMIN_QUICK_REPLIES,
          });
    },

    async getQuickReplies(context) {
      return context === "public" ? PUBLIC_QUICK_REPLIES : ADMIN_QUICK_REPLIES;
    },

    sendMessage(_sessionId, text) {
      const reply = variant === "public" ? publicReply(text) : adminReply(text);
      return streamReply(reply);
    },
  };
}

export const mockPublicChatProvider = createMockChatProvider("public");
export const mockAdminChatProvider = createMockChatProvider("admin");
