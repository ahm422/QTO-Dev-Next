import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env.js";

/**
 * LangChain chat model client. `ChatOpenAI` talks to any OpenAI-compatible
 * `/chat/completions` endpoint — provider is fully configurable via .env
 * (LLM_PROVIDER_BASE_URL / LLM_API_KEY / LLM_MODEL), so pointing this at
 * DeepSeek, OpenAI, Groq, or a local OpenAI-compatible proxy is a config
 * change, not a code change.
 */
export const chatModel = new ChatOpenAI({
  model: env.LLM_MODEL,
  apiKey: env.LLM_API_KEY,
  temperature: env.LLM_TEMPERATURE,
  maxTokens: env.LLM_MAX_OUTPUT_TOKENS,
  configuration: {
    baseURL: env.LLM_PROVIDER_BASE_URL,
  },
});
