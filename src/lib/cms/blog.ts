import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { mapBlogPost } from "./mappers";
import type { BlogPost } from "@/types/blog";

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const items = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
  return items.map(mapBlogPost);
}

export const findAllPublishedBlogPosts = cache(fetchPublishedPosts);

export const findBlogPostBySlug = cache(async (slug: string) => {
  const item = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
  });
  return item ? mapBlogPost(item) : null;
});

export const findPublishedBlogSlugs = cache(async () => {
  const items = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
    orderBy: { publishedAt: "desc" },
  });
  return items.map((i) => i.slug);
});
