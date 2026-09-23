import type { Context, Next } from "hono";
import { env } from "../../config/env.js";
import { sendApiError } from "../errors.js";

let kv: KVNamespace | null = null;

/** Called once per request from index.ts before this middleware runs. */
export function bindRateLimitKv(namespace: KVNamespace): void {
  kv = namespace;
}

function clientIp(c: Context): string {
  return c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * Fixed-window, per-IP rate limiter backed by `CHATBOT_KV`, replacing the old in-memory
 * `Map`-based limiter — a Worker isolate isn't shared across Cloudflare's edge, so an
 * in-process counter (which the old service's own comment already flagged as a
 * single-instance-only limitation) can't enforce a real cross-request limit here. KV reads
 * are eventually consistent, so this is approximate under concurrent bursts, same trade-off
 * spirit as the old limiter, but — unlike it — actually holds across every edge location.
 */
export async function rateLimit(c: Context, next: Next) {
  if (!kv) throw new Error("Rate-limit KV not initialized — call bindRateLimitKv(env.CHATBOT_KV) first");

  const ip = clientIp(c);
  const windowSeconds = env.CHAT_RATE_LIMIT_WINDOW_SECONDS;
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const key = `ratelimit:${ip}:${windowStart}`;

  const raw = await kv.get(key, "text");
  const count = raw ? Number(raw) : 0;

  if (count >= env.CHAT_RATE_LIMIT_MAX) {
    const retryAfterSeconds = windowStart + windowSeconds - Math.floor(Date.now() / 1000);
    c.header("Retry-After", String(Math.max(1, retryAfterSeconds)));
    return sendApiError(
      c,
      429,
      "RATE_LIMITED",
      "You're sending messages too quickly. Please wait a moment and try again."
    );
  }

  await kv.put(key, String(count + 1), { expirationTtl: windowSeconds });
  await next();
}
