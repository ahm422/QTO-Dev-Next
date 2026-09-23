import { AIMessageChunk, ToolMessage, type BaseMessage } from "@langchain/core/messages";
import { getChatModel } from "../llm/provider.js";
import { conversationStore } from "../conversation/store.js";
import { formatContext, ragPrompt } from "./promptBuilder.js";
import { retrieve, type RetrievedChunk } from "./retriever.js";
import { ragTools } from "./tools.js";
import { createLogger } from "../logger.js";

const logger = createLogger("chat-service");

// Lazy, memoized on first use — mirrors getChatModel() itself: `env` (and therefore the
// underlying chat model) isn't available until a request/scheduled handler has run
// initEnv(), so this can't be computed eagerly at module top level either.
let chatModelWithToolsInstance: ReturnType<ReturnType<typeof getChatModel>["bindTools"]> | null = null;
function getChatModelWithTools() {
  if (!chatModelWithToolsInstance) chatModelWithToolsInstance = getChatModel().bindTools(ragTools);
  return chatModelWithToolsInstance;
}
const toolsByName = new Map(ragTools.map((t) => [t.name, t]));

// One tool-decision round trip is typically enough (the model calls list_records once,
// then answers); this caps runaway loops. If the model still wants tools after this many
// rounds, the final round below is forced to answer directly (tools unbound) instead.
const MAX_TOOL_ROUNDS = 3;

export interface ChatSource {
  table: string;
  recordId: string | null;
  title: string;
  slug: string | null;
  url: string | null;
  /** Qdrant similarity score (0-1, cosine) for this chunk against the query — how confidently this source was matched. */
  score: number;
}

export interface ChatTiming {
  retrievalMs: number;
  llmMs: number;
  totalMs: number;
  toolCalls: number;
}

export interface ChatResult {
  sessionId: string;
  reply: string;
  sources: ChatSource[];
  /** Names of tools the model invoked this turn (e.g. ["list_records"]) — empty if none. */
  toolsUsed: string[];
  timing: ChatTiming;
}

export type ChatStreamEvent =
  | { type: "token"; content: string }
  | { type: "done"; result: ChatResult }
  | { type: "error"; message: string };

/**
 * Runs one chat turn as an async generator: retrieves context, then loops the tool-calling
 * model (list_records) until it produces a final answer, streaming that answer's tokens as
 * they arrive. `handleChatMessage` below drains this for the non-streaming JSON route;
 * `/chat/stream` iterates it directly over SSE — both share this single code path.
 *
 * Streaming + tool-calling interact like this: each round is always streamed via
 * `.stream()`. OpenAI-compatible tool-calling APIs emit a round as either all-tool-calls
 * (no meaningful content) or all-content (no tool calls) — never both — so as soon as a
 * round's first chunk carries a `tool_call_chunks` delta, we stop forwarding that round's
 * content to the caller and treat it as a tool round; otherwise its content chunks are the
 * real answer and are forwarded live.
 */
export async function* streamChatMessage(
  sessionId: string,
  userMessage: string
): AsyncGenerator<ChatStreamEvent> {
  const totalStart = Date.now();
  const history = conversationStore.getHistory(sessionId);
  const pastMessages = await history.getMessages();

  let chunks: RetrievedChunk[] = [];
  const retrievalStart = Date.now();
  try {
    chunks = await retrieve(userMessage);
  } catch (err) {
    logger.error("Retrieval failed, answering with no context", err);
  }
  const retrievalMs = Date.now() - retrievalStart;

  const initialMessages = await ragPrompt.formatMessages({
    history: pastMessages,
    context: formatContext(chunks),
    question: userMessage,
  });
  const messages: BaseMessage[] = [...initialMessages];

  const toolsUsed = new Set<string>();
  let toolCallCount = 0;
  let finalText = "";
  const llmStart = Date.now();

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const forceFinalAnswer = round === MAX_TOOL_ROUNDS;
      const model = forceFinalAnswer ? getChatModel() : getChatModelWithTools();

      let accumulated: AIMessageChunk | undefined;
      let sawToolCallChunk = false;
      let roundText = "";

      const stream = await model.stream(messages);
      for await (const part of stream) {
        accumulated = accumulated ? accumulated.concat(part) : part;
        if (!forceFinalAnswer && part.tool_call_chunks && part.tool_call_chunks.length > 0) {
          sawToolCallChunk = true;
        }
        if (!sawToolCallChunk && typeof part.content === "string" && part.content.length > 0) {
          roundText += part.content;
          yield { type: "token", content: part.content };
        }
      }

      const aiMessage = accumulated ?? new AIMessageChunk({ content: "" });
      const toolCalls = forceFinalAnswer ? [] : aiMessage.tool_calls ?? [];

      if (toolCalls.length === 0) {
        finalText = roundText || (typeof aiMessage.content === "string" ? aiMessage.content : "");
        break;
      }

      messages.push(aiMessage);
      for (const call of toolCalls) {
        toolCallCount++;
        toolsUsed.add(call.name);
        const toolFn = toolsByName.get(call.name);
        let result: string;
        try {
          result = toolFn ? await toolFn.invoke(call.args) : `Unknown tool: ${call.name}`;
        } catch (err) {
          logger.error(`Tool "${call.name}" failed`, err);
          result = `Tool "${call.name}" failed to execute.`;
        }
        messages.push(new ToolMessage({ content: result, tool_call_id: call.id ?? call.name }));
      }
    }
  } catch (err) {
    logger.error("Chat LLM call failed", err);
    yield {
      type: "error",
      message: "The assistant is temporarily unavailable. Please try again shortly.",
    };
    return;
  }

  const llmMs = Date.now() - llmStart;
  const reply = finalText;

  await conversationStore.appendTurn(sessionId, userMessage, reply);

  const totalMs = Date.now() - totalStart;
  const timing = { retrievalMs, llmMs, totalMs, toolCalls: toolCallCount };

  logger.info(
    `chat turn — retrieval ${retrievalMs}ms, llm ${llmMs}ms, total ${totalMs}ms, tools ${toolCallCount}`,
    { sessionId, sourcesUsed: chunks.length, toolsUsed: Array.from(toolsUsed) }
  );

  yield {
    type: "done",
    result: {
      sessionId,
      reply,
      sources: dedupeSources(chunks),
      toolsUsed: Array.from(toolsUsed),
      timing,
    },
  };
}

/** Non-streaming convenience wrapper for the JSON /chat route — drains streamChatMessage. */
export async function handleChatMessage(sessionId: string, userMessage: string): Promise<ChatResult> {
  for await (const event of streamChatMessage(sessionId, userMessage)) {
    if (event.type === "done") return event.result;
    if (event.type === "error") throw new Error(event.message);
  }
  throw new Error("Chat turn ended without producing a result");
}

// Qdrant returns results pre-sorted by score descending, so the first occurrence
// of a given source is always its highest-scoring chunk — safe to keep just that one.
function dedupeSources(chunks: RetrievedChunk[]): ChatSource[] {
  const seen = new Map<string, ChatSource>();
  for (const c of chunks) {
    const key = `${c.table}:${c.recordId ?? c.slug ?? c.title}`;
    if (!seen.has(key)) {
      seen.set(key, {
        table: c.table,
        recordId: c.recordId,
        title: c.title,
        slug: c.slug,
        url: c.url,
        score: c.score,
      });
    }
  }
  return Array.from(seen.values());
}
