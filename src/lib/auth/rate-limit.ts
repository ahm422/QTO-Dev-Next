import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitExceededResponse, RateLimitResult } from "@/lib/rateLimit";

export { getClientIp, rateLimitExceededResponse };

export const AUTH_RATE_LIMIT_PRESETS = {
  loginIp:         { limit: 5,   window: "60 s" },
  authGlobal:      { limit: 100, window: "15 m" },
  bruteForceTrack: { limit: 20,  window: "1 h"  },
} as const;

const BRUTE_FORCE_BLOCK_TTL_SECONDS = 3600;

// ---------------------------------------------------------------------------
// Upstash singleton
// ---------------------------------------------------------------------------

function hasUpstashConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

let _redis: import("@upstash/redis").Redis | null = null;
async function getRedis(): Promise<import("@upstash/redis").Redis> {
  if (_redis) return _redis;
  const { Redis } = await import("@upstash/redis");
  _redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return _redis;
}

let _loginIpLimiter: import("@upstash/ratelimit").Ratelimit | null = null;
let _authGlobalLimiter: import("@upstash/ratelimit").Ratelimit | null = null;

async function getLoginIpLimiter(): Promise<import("@upstash/ratelimit").Ratelimit> {
  if (_loginIpLimiter) return _loginIpLimiter;
  const [redis, { Ratelimit }] = await Promise.all([getRedis(), import("@upstash/ratelimit")]);
  _loginIpLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AUTH_RATE_LIMIT_PRESETS.loginIp.limit, AUTH_RATE_LIMIT_PRESETS.loginIp.window),
    prefix: "auth:login-ip",
  });
  return _loginIpLimiter;
}

async function getAuthGlobalLimiter(): Promise<import("@upstash/ratelimit").Ratelimit> {
  if (_authGlobalLimiter) return _authGlobalLimiter;
  const [redis, { Ratelimit }] = await Promise.all([getRedis(), import("@upstash/ratelimit")]);
  _authGlobalLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AUTH_RATE_LIMIT_PRESETS.authGlobal.limit, AUTH_RATE_LIMIT_PRESETS.authGlobal.window),
    prefix: "auth:global",
  });
  return _authGlobalLimiter;
}

// ---------------------------------------------------------------------------
// In-memory fallback (dev only — not suitable for multi-instance production)
// ---------------------------------------------------------------------------

type MemoryBucket = { resetAtMs: number; count: number };
const memBuckets = new Map<string, MemoryBucket>();

function memCheck(key: string, limit: number, windowMs: number): RateLimitResult {
  const nowMs = Date.now();
  for (const [k, b] of memBuckets.entries()) {
    if (b.resetAtMs <= nowMs) memBuckets.delete(k);
  }
  const existing = memBuckets.get(key);
  if (!existing || existing.resetAtMs <= nowMs) {
    memBuckets.set(key, { resetAtMs: nowMs + windowMs, count: 1 });
    return { allowed: true };
  }
  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAtMs - nowMs) / 1000)) };
  }
  existing.count += 1;
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// Layer 1 — Login IP rate limit (5 req / 60s sliding window)
// ---------------------------------------------------------------------------

export async function checkLoginIpRateLimit(request: NextRequest): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  if (hasUpstashConfig()) {
    try {
      const limiter = await getLoginIpLimiter();
      const result = await limiter.limit(ip);
      if (result.success) return { allowed: true };
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
    } catch {
      // fall through to in-memory
    }
  }
  return memCheck(`login-ip:${ip}`, AUTH_RATE_LIMIT_PRESETS.loginIp.limit, 60_000);
}

// ---------------------------------------------------------------------------
// Layer 3 — Global auth rate limit (100 req / 15 min sliding window)
// ---------------------------------------------------------------------------

export async function checkAuthGlobalRateLimit(request: NextRequest): Promise<RateLimitResult> {
  const ip = getClientIp(request);
  if (hasUpstashConfig()) {
    try {
      const limiter = await getAuthGlobalLimiter();
      const result = await limiter.limit(ip);
      if (result.success) return { allowed: true };
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)) };
    } catch {
      // fall through to in-memory
    }
  }
  return memCheck(`auth-global:${ip}`, AUTH_RATE_LIMIT_PRESETS.authGlobal.limit, 15 * 60_000);
}

// ---------------------------------------------------------------------------
// Layer 4 — Slow brute force detection (>20 failures across accounts / 1h)
// ---------------------------------------------------------------------------

type MemBruteEntry = { count: number; resetAtMs: number };
const memBruteCounters = new Map<string, MemBruteEntry>();
const memBruteBlocks = new Map<string, number>(); // ip → unblockAtMs

export async function isIpBlockedForBruteForce(ip: string): Promise<{ blocked: boolean; retryAfterSeconds?: number }> {
  if (hasUpstashConfig()) {
    try {
      const redis = await getRedis();
      const [blocked, ttl] = await Promise.all([
        redis.get<number>(`bruteforce:blocked:${ip}`),
        redis.ttl(`bruteforce:blocked:${ip}`),
      ]);
      if (blocked) {
        return { blocked: true, retryAfterSeconds: Math.max(1, ttl > 0 ? ttl : BRUTE_FORCE_BLOCK_TTL_SECONDS) };
      }
      return { blocked: false };
    } catch {
      // fall through to in-memory
    }
  }
  const unblockAt = memBruteBlocks.get(ip);
  if (unblockAt && unblockAt > Date.now()) {
    return { blocked: true, retryAfterSeconds: Math.max(1, Math.ceil((unblockAt - Date.now()) / 1000)) };
  }
  memBruteBlocks.delete(ip);
  return { blocked: false };
}

type AuditCtx = { email: string; userAgent: string | null };

export async function recordFailedLoginAttempt(ip: string, ctx: AuditCtx): Promise<void> {
  const { writeAuditLog } = await import("@/lib/auth/audit");
  await writeAuditLog({ action: "login_failed", email: ctx.email, ip, userAgent: ctx.userAgent });

  if (hasUpstashConfig()) {
    try {
      const redis = await getRedis();
      const counterKey = `bruteforce:failures:${ip}`;
      const [count] = await Promise.all([
        redis.incr(counterKey),
        redis.expire(counterKey, BRUTE_FORCE_BLOCK_TTL_SECONDS),
      ]);
      if (count > AUTH_RATE_LIMIT_PRESETS.bruteForceTrack.limit) {
        await redis.set(`bruteforce:blocked:${ip}`, 1, { ex: BRUTE_FORCE_BLOCK_TTL_SECONDS });
        const blockedUntil = new Date(Date.now() + BRUTE_FORCE_BLOCK_TTL_SECONDS * 1000);
        await writeAuditLog({
          action: "ip_blocked_brute_force",
          ip,
          userAgent: ctx.userAgent,
          metadata: { failureCount: count, blockedUntil },
        });
      }
    } catch {
      // non-fatal — don't block the login failure response
    }
    return;
  }

  // In-memory fallback
  const nowMs = Date.now();
  const entry = memBruteCounters.get(ip);
  if (!entry || entry.resetAtMs <= nowMs) {
    memBruteCounters.set(ip, { count: 1, resetAtMs: nowMs + BRUTE_FORCE_BLOCK_TTL_SECONDS * 1000 });
    return;
  }
  entry.count += 1;
  if (entry.count > AUTH_RATE_LIMIT_PRESETS.bruteForceTrack.limit) {
    memBruteBlocks.set(ip, nowMs + BRUTE_FORCE_BLOCK_TTL_SECONDS * 1000);
  }
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

export function accountLockedResponse(secondsRemaining: number): NextResponse {
  const secs = Math.max(1, Math.ceil(secondsRemaining));
  return NextResponse.json(
    { success: false, error: "Account locked", details: { retryAfterSeconds: secs } },
    { status: 423, headers: { "Retry-After": String(secs) } }
  );
}
