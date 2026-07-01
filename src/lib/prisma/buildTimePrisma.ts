import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getRuntimeD1Database } from "@/lib/d1/localD1Context";

function createD1PrismaClient(db: D1Database): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaD1(db),
    log: ["error"],
  });
}

let buildClientPromise: Promise<PrismaClient | null> | undefined;

/**
 * Prisma for Next.js static generation (generateStaticParams, sitemap).
 * Uses Workers runtime D1 when available during build workers.
 */
export async function getBuildTimePrisma(): Promise<PrismaClient | null> {
  if (!buildClientPromise) {
    buildClientPromise = (async () => {
      const db = getRuntimeD1Database();
      if (!db) return null;
      return createD1PrismaClient(db);
    })();
  }

  return buildClientPromise;
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
