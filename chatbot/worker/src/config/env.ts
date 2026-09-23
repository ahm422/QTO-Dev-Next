import { z } from "zod";

const boolFromString = z
  .string()
  .optional()
  .transform((v) => v === "true" || v === "1");

const numberFromString = (fallback: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? Number(v) : fallback))
    .refine((v) => Number.isFinite(v), "must be a number");

const envSchema = z.object({
  // Embeddings (Workers AI binding — see embeddings/provider.ts)
  EMBEDDING_MODEL: z.string().default("@cf/baai/bge-small-en-v1.5"),
  EMBEDDING_DIMENSIONS: numberFromString(384),

  // LLM
  LLM_PROVIDER_BASE_URL: z.string().url().default("https://api.deepseek.com/v1"),
  LLM_API_KEY: z.string().min(1, "LLM_API_KEY is required"),
  LLM_MODEL: z.string().default("deepseek-chat"),
  LLM_TEMPERATURE: numberFromString(0.3),
  // Kept modest so replies stay short by default — the system prompt also enforces brevity,
  // this is a hard backstop against runaway-length generations.
  LLM_MAX_OUTPUT_TOKENS: numberFromString(500),

  // Server
  CHAT_CORS_ORIGIN: z.string().default("*"),
  // Input guardrails — deliberately tight for a customer-support widget; genuine questions
  // are short, and this bounds both abuse and how much untrusted text reaches the prompt.
  CHAT_MAX_MESSAGE_LENGTH: numberFromString(500),
  CHAT_MAX_MESSAGE_WORDS: numberFromString(80),
  // 40 messages = 20 conversational turns (user + assistant pairs).
  CHAT_MAX_HISTORY_MESSAGES: numberFromString(40),
  CHAT_SESSION_TTL_MINUTES: numberFromString(60),
  // Internal-only: include `sources`/`timing` in the /chat response. Off by default —
  // this is a customer-facing endpoint, retrieval internals shouldn't be in the reply.
  CHAT_EXPOSE_DEBUG_INFO: boolFromString.default("false"),

  // Rate limiting
  CHAT_RATE_LIMIT_MAX: numberFromString(20),
  CHAT_RATE_LIMIT_WINDOW_SECONDS: numberFromString(60),

  // Retrieval
  RETRIEVAL_TOP_K: numberFromString(5),
  RETRIEVAL_SCORE_THRESHOLD: numberFromString(0.3),

  // Chunking
  CHUNK_MAX_CHARS: numberFromString(1500),
  CHUNK_OVERLAP_CHARS: numberFromString(150),

  // Sync — actual scheduling is a Cron Trigger (see wrangler.jsonc `triggers.crons` + the
  // `scheduled` export in index.ts); SYNC_INTERVAL_MINUTES here is metrics/documentation only.
  SYNC_INTERVAL_MINUTES: numberFromString(15),
  SYNC_TRIGGER_TOKEN: z.string().optional().default(""),

  // Misc
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Mutable singleton, populated once per Worker isolate by `initEnv()` (called first thing
 * in both the `fetch` and `scheduled` handlers in index.ts). Every other module in this
 * package imports `env` directly and reads `env.FOO`, matching the original Node service's
 * pattern — this is safe because a Worker isolate is reused across requests and its bound
 * vars/secrets never change between requests for a given deployment, so parsing once and
 * mutating this object in place avoids threading `env` as a parameter through every file.
 */
export const env = {} as Env;

let initialized = false;

/** Idempotent — the second and later calls in a reused isolate are no-ops. */
export function initEnv(raw: Record<string, unknown>): void {
  if (initialized) return;
  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid chatbot configuration:\n${issues}`);
  }
  Object.assign(env, parsed.data);
  initialized = true;
}
