import { notFound } from 'next/navigation';
import { getBlogBySlug, getRelatedBlogPosts, getAllBlogPosts } from '@/lib/blog';
import { ArticleHeader } from './_components/ArticleHeader';
import { ArticleBody } from './_components/ArticleBody';
import { ArticleSidebar } from './_components/ArticleSidebar';
import { ArticleEndCTA } from './_components/ArticleEndCTA';
import { RelatedArticles } from './_components/RelatedArticles';

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

  const relatedPosts = await getRelatedBlogPosts(
    post.category,
    slug,
    3
  );

  return (
    <article className="min-h-screen bg-background">
      {/* Article Header */}
      <ArticleHeader post={post} />

      {/* Two-Column Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
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
      {relatedPosts.length > 0 && (
        <RelatedArticles posts={relatedPosts} />
      )}
    </article>
  );
}
