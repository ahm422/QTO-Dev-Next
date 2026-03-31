import { notFound } from 'next/navigation';
import { Suspense } from "react";
import { getBlogBySlug, getAllBlogPosts } from '@/lib/blog';
import { ArticleHeader } from './_components/ArticleHeader';
import { ArticleBody } from './_components/ArticleBody';
import { ArticleSidebar } from './_components/ArticleSidebar';
import { ArticleEndCTA } from './_components/ArticleEndCTA';
import { RelatedArticlesAsync } from "./_components/RelatedArticlesAsync";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The blog post you are looking for does not exist.',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || post.description,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage?.url ? [{ url: post.coverImage.url }] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
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
      <Suspense
        fallback={
          <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
            <div className="h-9 w-64 mx-auto rounded-xl bg-surface-muted/70 animate-pulse" />
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-surface rounded-lg border border-border overflow-hidden"
                >
                  <div className="h-48 bg-surface-muted/70 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-24 rounded bg-surface-muted/70 animate-pulse" />
                    <div className="h-6 w-5/6 rounded bg-surface-muted/70 animate-pulse" />
                    <div className="h-4 w-4/6 rounded bg-surface-muted/70 animate-pulse" />
                    <div className="h-4 w-3/6 rounded bg-surface-muted/70 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        }
      >
        <RelatedArticlesAsync category={post.category} slug={slug} limit={3} />
      </Suspense>
    </article>
  );
}
