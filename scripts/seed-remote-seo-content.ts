/**
 * Production-safe SEO content reseed for #399.
 * Upserts blog posts + page sections into remote D1 and verifies lengths.
 *
 * Usage:
 *   npx tsx scripts/seed-remote-seo-content.ts -- --d1=remote --confirm-production
 */
import { blogPosts } from "@/data/blog";
import {
  createOrderedChildren,
  replaceOrderedChildren,
} from "@/lib/prisma/arrayFields";
import { parseCliD1Target } from "./migration/cli";
import { disconnect, initSeedPrisma, prisma } from "../prisma/seed/helpers";
import { seedPageSections } from "../prisma/seed/pageSections";

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function seedBlogPostsVerified() {
  console.log("  Seeding blog posts…");
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

    const row = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    const expected = post.content.length;
    const actual = row?.content?.length ?? 0;
    if (actual !== expected) {
      throw new Error(
        `Verify failed for ${post.slug}: expected content length ${expected}, got ${actual}`
      );
    }
    console.log(`    ✓ ${post.slug} content=${actual} excerpt=${row?.excerpt?.length ?? 0}`);
  }
}

async function main() {
  const target = parseCliD1Target("local");

  if (target === "remote" && !hasFlag("confirm-production")) {
    console.error(
      "Refusing to write production D1 without --confirm-production."
    );
    process.exit(1);
  }

  await initSeedPrisma(target);
  console.log(`Seeding SEO content into ${target} D1…`);

  // Probe: write a canary read so we know which DB we're on
  const probe = await prisma.blogPost.findFirst({
    where: { slug: "getting-started-nextjs" },
    select: { content: true },
  });
  console.log(
    `  probe getting-started-nextjs content length before=${probe?.content?.length ?? 0}`
  );

  await seedBlogPostsVerified();
  await seedPageSections();

  const after = await prisma.blogPost.findUnique({
    where: { slug: "getting-started-nextjs" },
    select: { content: true, excerpt: true },
  });
  console.log(
    `  probe after content=${after?.content?.length ?? 0} excerpt=${after?.excerpt?.length ?? 0}`
  );
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnect());
