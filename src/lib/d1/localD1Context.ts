import { getCloudflareContext } from "@opennextjs/cloudflare";

/** @deprecated Prefer getCloudflareContext() from @opennextjs/cloudflare or getD1Session() from @/lib/d1/session */
export function getRuntimeD1Database(): D1Database | undefined {
  try {
    const { env } = getCloudflareContext();
    return env.DB;
  } catch {
    return undefined;
  }
}
