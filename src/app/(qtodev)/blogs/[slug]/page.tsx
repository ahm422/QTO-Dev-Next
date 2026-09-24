import { notFound } from 'next/navigation';
import { Suspense } from "react";
import { getBlogBySlug } from '@/lib/blog';
import { findPublishedBlogSlugsForBuild } from '@/lib/prisma/buildTimePrisma';
import { skipBuildTimeD1 } from '@/lib/prisma/skipBuildTimeD1';
import { generateSEOMetadata } from '@/lib/seo';
import { ArticleHeader } from './_components/ArticleHeader';
import { ArticleBody } from './_components/ArticleBody';
import { ArticleSidebar } from './_components/ArticleSidebar';
import { ArticleEndCTA } from './_components/ArticleEndCTA';
import { RelatedArticlesAsync } from "./_components/RelatedArticlesAsync";
import { RelatedArticlesSkeleton } from "@/components/common/skeletons/RelatedArticlesSkeleton";
import { ContentFaqSection } from "@/components/faq";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return generateSEOMetadata({
      title: 'Article Not Found',
      description: 'The blog post you are looking for does not exist.',
      url: `/blogs/${slug}`,
      robots: { index: false, follow: false },
    });
  }

  return generateSEOMetadata({
    title: `${post.title} | QTO Dev`,
    description:
      (post.excerpt || post.description || "").trim() ||
      "Insights on web development, product design, and digital delivery from QTO Dev.",
    image: post.coverImage?.url,
    url: `/blogs/${slug}`,
    author: post.author,
    publishedAt: post.publishedAt,
  });
}

export async function generateStaticParams() {
  if (skipBuildTimeD1()) return [];
  const slugs = await findPublishedBlogSlugsForBuild();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Article Header */}
      <ArticleHeader post={post} />

      {/* Two-Column Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2">
            <ArticleBody post={post} />
            <ContentFaqSection items={post.faqs} idPrefix="blog-faq" />
          </div>

          {/* Sidebar (1/3) */}
          <div className="lg:col-span-1">
            <ArticleSidebar post={post} />
          </div>
        </div>
      </div>

      {/* End-of-Article CTA */}
      <ArticleEndCTA />

      {/* Related Articles */}
      <Suspense fallback={<RelatedArticlesSkeleton />}>
        <RelatedArticlesAsync category={post.category} slug={slug} limit={3} />
      </Suspense>
    </article>
  );
}
