import { NextRequest, NextResponse } from "next/server";

export type RateLimitConfig = {
  /** How many requests are allowed per window. */
  limit: number;
  /** Window size in seconds. */
  windowSeconds: number;
};

type RateLimitOk = { allowed: true };
type RateLimitBlocked = { allowed: false; retryAfterSeconds: number };
export type RateLimitResult = RateLimitOk | RateLimitBlocked;

type CheckRateLimitInput = {
  request: NextRequest;
  /** Stable identifier for the route (e.g. "contact", "requirements"). */
  routeKey: string;
  config: RateLimitConfig;
};

function parseFirstForwardedForIp(value: string): string | null {
  const first = value.split(",")[0]?.trim();
  return first ? first : null;
}

export function getClientIp(request: NextRequest): string {
  const xfwd = request.headers.get("x-forwarded-for");
  if (xfwd) {
    const ip = parseFirstForwardedForIp(xfwd);
    if (ip) return ip;
  }

  const xRealIp = request.headers.get("x-real-ip")?.trim();
  if (xRealIp) return xRealIp;

  const cfConnectingIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfConnectingIp) return cfConnectingIp;

  return "unknown";
}

function rateLimitKey(routeKey: string, ip: string) {
  return `ratelimit:${routeKey}:${ip}`;
}

export function rateLimitExceededResponse(
  retryAfterSeconds: number,
  message = "Too many requests. Please try again shortly."
) {
  return NextResponse.json(
    {
      success: false,
      error: "Too many requests",
      details: { message, retryAfterSeconds },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, Math.ceil(retryAfterSeconds))),
      },
    }
  );
}

type MemoryBucket = { resetAtMs: number; count: number };
const memoryBuckets = new Map<string, MemoryBucket>();

function memoryCleanup(nowMs: number) {
  // Best-effort cleanup; runs inline and cheap.
  for (const [key, bucket] of memoryBuckets.entries()) {
    if (bucket.resetAtMs <= nowMs) memoryBuckets.delete(key);
  }
}

function checkRateLimitInMemory(input: CheckRateLimitInput): RateLimitResult {
  const ip = getClientIp(input.request);
  const key = rateLimitKey(input.routeKey, ip);
  const nowMs = Date.now();

  memoryCleanup(nowMs);

  const windowMs = Math.max(1, input.config.windowSeconds) * 1000;
  const existing = memoryBuckets.get(key);
  if (!existing || existing.resetAtMs <= nowMs) {
    memoryBuckets.set(key, { resetAtMs: nowMs + windowMs, count: 1 });
    return { allowed: true };
  }

  if (existing.count >= input.config.limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAtMs - nowMs) / 1000)),
    };
  }

  existing.count += 1;
  memoryBuckets.set(key, existing);
  return { allowed: true };
}

function hasUpstashConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function checkRateLimitWithUpstash(
  input: CheckRateLimitInput
): Promise<RateLimitResult> {
  // Dynamic import keeps local/dev working without Upstash deps if desired.
  const [{ Redis }, { Ratelimit }] = await Promise.all([
    import("@upstash/redis"),
    import("@upstash/ratelimit"),
  ]);

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(input.config.limit, `${input.config.windowSeconds} s`),
    prefix: "ratelimit",
  });

  const ip = getClientIp(input.request);
  const key = `${input.routeKey}:${ip}`;

  const result = await ratelimit.limit(key);
  if (result.success) return { allowed: true };

  const resetMs = result.reset;
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((resetMs - Date.now()) / 1000)
  );
  return { allowed: false, retryAfterSeconds };
}

export async function checkRateLimit(
  input: CheckRateLimitInput
): Promise<RateLimitResult> {
  if (hasUpstashConfig()) {
    try {
      return await checkRateLimitWithUpstash(input);
    } catch {
      // If Upstash is misconfigured or temporarily unreachable, fallback to best-effort in-memory.
      return checkRateLimitInMemory(input);
    }
  }

  return checkRateLimitInMemory(input);
}

