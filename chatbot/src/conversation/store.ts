import { randomUUID } from "node:crypto";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { env } from "../config/env.js";

interface Session {
  history: InMemoryChatMessageHistory;
  lastActiveAt: number;
}

/**
 * In-memory, per-process conversation store keyed by session id, backed by
 * LangChain's `InMemoryChatMessageHistory` per session rather than a hand-rolled
 * array. Deliberately NOT using LangChain's `RunnableWithMessageHistory` wrapper —
 * LangChain's own types mark it `@deprecated` in favor of LangGraph's persistence
 * layer, and pulling in LangGraph for a single-process, single-server in-memory
 * chat history would be a lot of new surface area for what this needs. This store
 * still adds the two things `InMemoryChatMessageHistory` doesn't provide on its
 * own: TTL-based session eviction and a max-message cap.
 */
class ConversationStore {
  private sessions = new Map<string, Session>();

  constructor() {
    setInterval(() => this.evictExpired(), 5 * 60_000).unref();
  }

  createSession(): string {
    const id = randomUUID();
    this.sessions.set(id, { history: new InMemoryChatMessageHistory(), lastActiveAt: Date.now() });
    return id;
  }

  hasSession(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  getHistory(sessionId: string): InMemoryChatMessageHistory {
    const session = this.sessions.get(sessionId);
    if (session) return session.history;
    const history = new InMemoryChatMessageHistory();
    this.sessions.set(sessionId, { history, lastActiveAt: Date.now() });
    return history;
  }

  async appendTurn(sessionId: string, userMessage: string, assistantReply: string): Promise<void> {
    const session = this.sessions.get(sessionId) ?? {
      history: new InMemoryChatMessageHistory(),
      lastActiveAt: Date.now(),
    };

    await session.history.addMessages([new HumanMessage(userMessage), new AIMessage(assistantReply)]);

    const maxMessages = env.CHAT_MAX_HISTORY_MESSAGES;
    const all = await session.history.getMessages();
    if (all.length > maxMessages) {
      const trimmed = all.slice(all.length - maxMessages);
      await session.history.clear();
      await session.history.addMessages(trimmed);
    }

    session.lastActiveAt = Date.now();
    this.sessions.set(sessionId, session);
  }

  private evictExpired(): void {
    const ttlMs = env.CHAT_SESSION_TTL_MINUTES * 60_000;
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.lastActiveAt > ttlMs) this.sessions.delete(id);
    }
  }
}

export const conversationStore = new ConversationStore();
