import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { skipBuildTimeD1 } from "@/lib/prisma/skipBuildTimeD1";

function createD1PrismaClient(db: D1DatabaseSession): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaD1(db),
    log: ["error"],
  });
}

/**
 * Prisma for Next.js static generation (generateStaticParams, sitemap).
 * Uses Workers runtime D1 when available during build workers.
 */
export async function getBuildTimePrisma(): Promise<PrismaClient | null> {
  if (skipBuildTimeD1()) return null;

  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) return null;

  const session = env.DB.withSession("first-unconstrained");
  return createD1PrismaClient(session);
}

export async function findPublishedBlogSlugsForBuild(): Promise<string[]> {
  const client = await getBuildTimePrisma();
  if (!client) return [];
  const rows = await client.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function findPublishedServiceSlugsForBuild(): Promise<string[]> {
  const client = await getBuildTimePrisma();
  if (!client) return [];
  const rows = await client.service.findMany({
    where: { isPublished: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.slug);
}

export async function findPublishedProjectSlugsForBuild(): Promise<string[]> {
  const client = await getBuildTimePrisma();
  if (!client) return [];
  const rows = await client.project.findMany({
    where: { isPublished: true },
    select: { slug: true },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => r.slug);
}
