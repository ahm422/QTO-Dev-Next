/**
 * Shared contract types for the chat widget system (public + admin).
 *
 * These types are consumed by:
 *  - `ChatProvider` implementations (mock / http) — see `src/lib/chat/`.
 *  - The headless `useChatWidget` hook — see `src/hooks/useChatWidget.ts`.
 *  - The presentational components — see `src/components/chat/`.
 */

export type ChatRole = "user" | "assistant" | "system";

export type ChatVariant = "public" | "admin";

/** A single quick-reply pill surfaced under the composer or as a greeting suggestion. */
export interface QuickReply {
  id: string;
  label: string;
  /** The text sent as if the user had typed it when this quick reply is chosen. */
  value: string;
}

/** A file/image attached to a message. Metadata only — upload transport is out of scope for now. */
export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  /** Size in bytes, when known. */
  size?: number;
}

/**
 * A generic key/value data card payload (e.g. a deploy summary, a ticket snapshot).
 * Rendered by `ChatStructuredCard` — never hardcode a one-off shape for a specific
 * use case; extend `fields` instead.
 */
export interface StructuredDataBlock {
  id: string;
  title: string;
  /** Optional subtitle/description shown under the title. */
  subtitle?: string;
  fields: StructuredDataField[];
}

export interface StructuredDataField {
  label: string;
  value: string;
  /** Drives the status color of the value cell (e.g. red for "failed"). Omit for neutral. */
  status?: "neutral" | "success" | "warning" | "error";
}

/** A single message in a chat session. */
export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Plain text content. Structured content (cards, quick replies) is carried separately. */
  content: string;
  createdAt: string;
  quickReplies?: QuickReply[];
  attachments?: ChatAttachment[];
  structuredData?: StructuredDataBlock[];
  /** Set while a streamed assistant message is still receiving chunks. */
  pending?: boolean;
}

/** A single streamed chunk of an in-progress assistant message. */
export interface ChatChunk {
  /** The message this chunk belongs to — stable across all chunks of one response. */
  messageId: string;
  /** Incremental text to append to the message content. */
  delta: string;
  /** True on the final chunk of the stream. */
  done: boolean;
  /** Only present on the final chunk, if the response carries structured data. */
  structuredData?: StructuredDataBlock[];
  quickReplies?: QuickReply[];
}

/** Client-side session metadata persisted across page loads. */
export interface ChatSession {
  id: string;
  variant: ChatVariant;
  createdAt: string;
  /** Arbitrary variant-specific context (e.g. admin ticket/org info) injected by the host app. */
  metadata?: Record<string, string>;
}

/** Standard error shape returned by chat API routes on failure. */
export interface ChatErrorResponse {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}
