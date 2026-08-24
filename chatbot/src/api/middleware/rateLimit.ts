import type { NextFunction, Request, Response } from "express";
import { env } from "../../config/env.js";
import { sendApiError } from "../errors.js";

interface Bucket {
  count: number;
  resetAtMs: number;
}

/**
 * Simple in-memory, fixed-window, per-IP rate limiter. Standalone by design — this
 * service does not import anything from the main QTO-Dev-Next app (which uses
 * Upstash Redis for this in production). If you ever run more than one instance of
 * this chatbot behind a load balancer, replace this with a shared store (e.g. Redis)
 * so limits are enforced across instances instead of per-process.
 */
const buckets = new Map<string, Bucket>();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAtMs <= now) buckets.delete(key);
  }
}, 60_000).unref();

function clientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) return xff.split(",")[0]!.trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const ip = clientIp(req);
  const now = Date.now();
  const windowMs = env.CHAT_RATE_LIMIT_WINDOW_SECONDS * 1000;

  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetAtMs <= now) {
    buckets.set(ip, { count: 1, resetAtMs: now + windowMs });
    next();
    return;
  }

  if (bucket.count >= env.CHAT_RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAtMs - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.status(429).json({
      error: "Too many requests",
      message: "You're sending messages too quickly. Please wait a moment and try again.",
      retryAfterSeconds,
    });
    return;
  }

  bucket.count++;
  next();
}
