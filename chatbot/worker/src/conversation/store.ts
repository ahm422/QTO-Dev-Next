import { BaseListChatMessageHistory } from "@langchain/core/chat_history";
import {
  AIMessage,
  HumanMessage,
  mapChatMessagesToStoredMessages,
  mapStoredMessagesToChatMessages,
  type BaseMessage,
  type StoredMessage,
} from "@langchain/core/messages";
import { env } from "../config/env.js";

let kv: KVNamespace | null = null;

/** Called once per request from index.ts before any conversation-store method is used. */
export function bindConversationKv(namespace: KVNamespace): void {
  kv = namespace;
}

function requireKv(): KVNamespace {
  if (!kv) throw new Error("Conversation KV not initialized — call bindConversationKv(env.CHATBOT_KV) first");
  return kv;
}

function sessionKey(sessionId: string): string {
  return `session:${sessionId}`;
}

async function readStored(sessionId: string): Promise<StoredMessage[]> {
  const raw = await requireKv().get(sessionKey(sessionId), "text");
  if (!raw) return [];
  return JSON.parse(raw) as StoredMessage[];
}

async function writeStored(sessionId: string, stored: StoredMessage[]): Promise<void> {
  await requireKv().put(sessionKey(sessionId), JSON.stringify(stored), {
    expirationTtl: env.CHAT_SESSION_TTL_MINUTES * 60,
  });
}

/**
 * Per-session chat history backed by `CHATBOT_KV`, replacing the old in-memory
 * `InMemoryChatMessageHistory` — a Worker isolate isn't guaranteed to still be around for
 * the next request, so history has to live outside process memory. TTL is refreshed on
 * every write (`CHAT_SESSION_TTL_MINUTES`), reproducing the old store's eviction behavior
 * natively via KV's per-key expiration instead of a periodic sweep.
 */
export class KvChatMessageHistory extends BaseListChatMessageHistory {
  lc_namespace = ["chatbot", "conversation"];

  constructor(private readonly sessionId: string) {
    super();
  }

  async getMessages(): Promise<BaseMessage[]> {
    return mapStoredMessagesToChatMessages(await readStored(this.sessionId));
  }

  async addMessage(message: BaseMessage): Promise<void> {
    await this.addMessages([message]);
  }

  /** Overridden (the base class default loops `addMessage`) for one KV round trip per call. */
  async addMessages(messages: BaseMessage[]): Promise<void> {
    const existing = await readStored(this.sessionId);
    const stored = mapChatMessagesToStoredMessages(mapStoredMessagesToChatMessages(existing).concat(messages));
    await writeStored(this.sessionId, stored);
  }

  async clear(): Promise<void> {
    await requireKv().delete(sessionKey(this.sessionId));
  }
}

/**
 * Thin session-lifecycle wrapper over the KV history. There is no existence check: callers
 * supply their own session id (see api/routes/chat.ts) and an id with no stored history is
 * simply a new session.
 */
class ConversationStore {
  createSession(): string {
    return crypto.randomUUID();
  }

  getHistory(sessionId: string): KvChatMessageHistory {
    return new KvChatMessageHistory(sessionId);
  }

  async appendTurn(sessionId: string, userMessage: string, assistantReply: string): Promise<void> {
    const history = this.getHistory(sessionId);
    await history.addMessages([new HumanMessage(userMessage), new AIMessage(assistantReply)]);

    // Trim to CHAT_MAX_HISTORY_MESSAGES, same cap the old store enforced.
    const all = await readStored(sessionId);
    const maxMessages = env.CHAT_MAX_HISTORY_MESSAGES;
    if (all.length > maxMessages) {
      await writeStored(sessionId, all.slice(all.length - maxMessages));
    }
  }
}

export const conversationStore = new ConversationStore();
