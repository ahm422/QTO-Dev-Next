"use client";

import { notFound } from "next/navigation";
import {
  ChatMessageBubble,
  ChatQuickReplies,
  ChatComposer,
  ChatTypingIndicator,
  ChatStructuredCard,
} from "@/components/chat";
import type { ChatMessage, StructuredDataBlock } from "@/types/chat";

// Manual render harness for the shared chat components (no Storybook in this repo).
// Dev-only — 404s in production builds. Route segment config (e.g. `export const dynamic`)
// isn't valid from a "use client" file, so the production gate below is a runtime check instead.

// Fixed timestamps, not `new Date()` — this is a Client Component, so a call computed at
// module scope would run once during SSR and again on hydration, producing a mismatch.
const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm the QTO Assistant. How can I help today?",
    createdAt: "2025-01-01T09:00:00.000Z",
  },
  {
    id: "2",
    role: "user",
    content: "What services do you offer?",
    createdAt: "2025-01-01T09:00:05.000Z",
  },
];

// Deliberately not the deploy-summary example — proves ChatStructuredCard renders
// any StructuredDataBlock shape, not just the one baked into the mock provider.
const CUSTOMER_SNAPSHOT: StructuredDataBlock = {
  id: "customer_snapshot",
  title: "Customer Snapshot",
  subtitle: "acct_5f21",
  fields: [
    { label: "plan", value: "Pro", status: "success" },
    { label: "renewal", value: "in 12 days", status: "warning" },
    { label: "open tickets", value: "0", status: "neutral" },
  ],
};

export default function ChatDemoPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-4 py-16">
      <h1 className="text-2xl font-semibold">Chat component demo</h1>
      <p className="text-sm text-foreground-muted">
        Manual render harness for `src/components/chat/*`. Dev-only. The floating
        widgets (public bottom-right, admin bottom-left) are also mounted live via
        the layout — try them alongside this page.
      </p>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground-muted">Message bubbles</h2>
        <div className="rounded-2xl border border-border bg-background p-4">
          {SAMPLE_MESSAGES.map((m) => (
            <ChatMessageBubble key={m.id} message={m} className="mb-3" />
          ))}
          <ChatTypingIndicator />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground-muted">Quick replies</h2>
        <ChatQuickReplies
          replies={[
            { id: "a", label: "Our services", value: "What services do you offer?" },
            { id: "b", label: "Book a call", value: "I'd like to book a call." },
            { id: "c", label: "Pricing", value: "What does it cost?" },
          ]}
          onSelect={() => {}}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground-muted">Structured card (generic)</h2>
        <ChatStructuredCard data={CUSTOMER_SNAPSHOT} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground-muted">Composer</h2>
        <div className="overflow-hidden rounded-2xl border border-border">
          <ChatComposer onSend={() => {}} />
        </div>
      </section>
    </div>
  );
}
