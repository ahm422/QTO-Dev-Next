import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env.js";

let instance: ChatOpenAI | null = null;

/**
 * Lazily constructs the LangChain chat model client on first use, after `env` has been
 * populated by `initEnv()` in index.ts — Workers only expose bound vars/secrets inside a
 * request/scheduled handler, never at module top level, so this can't be the eager
 * module-scope singleton (`export const chatModel = new ChatOpenAI(...)`) the original
 * Node service used. `ChatOpenAI` talks to any OpenAI-compatible `/chat/completions`
 * endpoint — provider is fully configurable via env (LLM_PROVIDER_BASE_URL / LLM_API_KEY /
 * LLM_MODEL), so pointing this at DeepSeek, OpenAI, Groq, etc. is a config change, not a
 * code change.
 */
export function getChatModel(): ChatOpenAI {
  if (!instance) {
    instance = new ChatOpenAI({
      model: env.LLM_MODEL,
      apiKey: env.LLM_API_KEY,
      temperature: env.LLM_TEMPERATURE,
      maxTokens: env.LLM_MAX_OUTPUT_TOKENS,
      configuration: {
        baseURL: env.LLM_PROVIDER_BASE_URL,
      },
    });
  }
  return instance;
}
