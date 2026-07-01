import { getRuntimeD1Database } from "@/lib/d1/localD1Context";

/** No-op: D1 is injected by the Workers runtime (wrangler dev / production). */
export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  void getRuntimeD1Database;
}
