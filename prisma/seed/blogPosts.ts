import { blogPosts } from "@/data/blog";
import {
  createOrderedChildren,
  replaceOrderedChildren,
} from "@/lib/prisma/arrayFields";
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
        tags: createOrderedChildren(post.tags),
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
        tags: replaceOrderedChildren(post.tags),
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
