import { blogPosts } from "@/data/blog";
import { prisma } from "./helpers";

export async function seedBlogPosts() {
  for (const post of blogPosts) {
    const imageUrl = post.coverImage?.url ?? post.image ?? null;
    const imageAlt = post.coverImage?.alt ?? post.title;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? post.description,
        content: post.content,
        category: post.category,
        tags: post.tags,
        author: post.author,
        imageUrl,
        imageAlt,
        readTime: post.readingTime,
        isFeatured: post.featured,
        isHeadline: post.featured,
        isPublished: true,
        publishedAt: new Date(post.publishedAt),
      },
      update: {
        title: post.title,
        excerpt: post.excerpt ?? post.description,
        content: post.content,
        category: post.category,
        tags: post.tags,
        author: post.author,
        imageUrl,
        imageAlt,
        readTime: post.readingTime,
        isFeatured: post.featured,
        isHeadline: post.featured,
        isPublished: true,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }
}
