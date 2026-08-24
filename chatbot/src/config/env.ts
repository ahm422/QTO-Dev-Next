import "dotenv/config";
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
  // D1 access mode: "local" reads the main app's local D1 sqlite file directly
  // (no Cloudflare account needed — the default); "remote" uses the Cloudflare
  // D1 HTTP API (needs CLOUDFLARE_* below).
  D1_MODE: z.enum(["local", "remote"]).default("local"),
  // Local mode: optional explicit path override; auto-discovered under the main
  // app's .wrangler/ dev state if unset (see src/d1/localClient.ts).
  LOCAL_D1_SQLITE_PATH: z.string().optional().default(""),

  // Remote mode only (Cloudflare D1 HTTP API) — validated as required below when D1_MODE=remote.
  CLOUDFLARE_ACCOUNT_ID: z.string().optional().default(""),
  CLOUDFLARE_API_TOKEN: z.string().optional().default(""),
  CLOUDFLARE_D1_DATABASE_ID: z.string().optional().default(""),

  // Qdrant
  QDRANT_URL: z.string().url().default("http://localhost:6333"),
  QDRANT_API_KEY: z.string().optional().default(""),
  QDRANT_COLLECTION: z.string().default("qtodev_knowledge_base"),

  // Embeddings
  EMBEDDING_MODEL: z.string().default("Xenova/all-MiniLM-L6-v2"),
  EMBEDDING_DIMENSIONS: numberFromString(384),

  // LLM
  LLM_PROVIDER_BASE_URL: z.string().url().default("https://api.deepseek.com/v1"),
  LLM_API_KEY: z.string().min(1, "LLM_API_KEY is required"),
  LLM_MODEL: z.string().default("deepseek-chat"),
  LLM_TEMPERATURE: numberFromString(0.3),
  LLM_MAX_OUTPUT_TOKENS: numberFromString(1000),

  // Server
  CHAT_PORT: numberFromString(8787),
  CHAT_CORS_ORIGIN: z.string().default("*"),
  CHAT_MAX_MESSAGE_LENGTH: numberFromString(2000),
  // Primary input guardrail for this customer-facing bot — word count, not just character length.
  CHAT_MAX_MESSAGE_WORDS: numberFromString(100),
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

  // Sync
  SYNC_INTERVAL_MINUTES: numberFromString(15),
  SYNC_ON_STARTUP: boolFromString.default("true"),
  SYNC_TRIGGER_TOKEN: z.string().optional().default(""),

  // Misc
  NODE_ENV: z.string().default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
}).superRefine((data, ctx) => {
  if (data.D1_MODE !== "remote") return;
  for (const key of ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "CLOUDFLARE_D1_DATABASE_ID"] as const) {
    if (!data[key]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [key],
        message: `${key} is required when D1_MODE=remote`,
      });
    }
  }
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    // eslint-disable-next-line no-console
    console.error(`Invalid chatbot configuration:\n${issues}`);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
export type Env = typeof env;
