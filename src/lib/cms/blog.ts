import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { blogPostDetailInclude, blogPostWithTagsInclude } from "@/lib/prisma/blogPostData";
import { mapBlogPost } from "./mappers";
import type { BlogPost } from "@/types/blog";

export const findAllPublishedBlogPosts = cache(
  unstable_cache(
    async (): Promise<BlogPost[]> => {
      const items = await (await getCachedReadPrisma()).blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        include: blogPostWithTagsInclude,
      });
      return items.map(mapBlogPost);
    },
    ["published-blog-posts"],
    { revalidate: 3600, tags: ["blog"] }
  )
);

export const findBlogPostBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const item = await (await getCachedReadPrisma()).blogPost.findFirst({
        where: { slug, isPublished: true },
        include: blogPostDetailInclude,
      });
      return item ? mapBlogPost(item) : null;
    },
    ["blog-post-by-slug"],
    { revalidate: 3600, tags: ["blog"] }
  )
);

export const findPublishedBlogSlugs = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).blogPost.findMany({
        where: { isPublished: true },
        select: { slug: true },
        orderBy: { publishedAt: "desc" },
      });
      return items.map((i) => i.slug);
    },
    ["published-blog-slugs"],
    { revalidate: 3600, tags: ["blog"] }
  )
);
