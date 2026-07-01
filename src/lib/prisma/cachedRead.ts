import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Prisma for public CMS reads inside unstable_cache().
 * Uses first-unconstrained (replica) session and does not read headers/cookies.
 * Request-scoped prisma (src/lib/prisma.ts) uses D1 Sessions bookmarks for admin CRUD.
 */
export const getCachedReadPrisma = cache(async (): Promise<PrismaClient> => {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error(
      "D1 binding (env.DB) is not available. Use npm run preview / wrangler dev with local D1."
    );
  }
  return new PrismaClient({
    adapter: new PrismaD1(env.DB.withSession("first-unconstrained")),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
});
