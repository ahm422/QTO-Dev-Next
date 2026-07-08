import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { ShareButtons } from './ShareButtons';
import { Breadcrumb } from './Breadcrumb';

interface ArticleHeaderProps {
  post: BlogPost;
}

export function ArticleHeader({ post }: ArticleHeaderProps) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <header className="bg-gradient-to-b from-surface to-background pt-24 md:pt-32 pb-12 md:pb-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blogs', href: '/blogs' },
            { label: post.category, href: `/blogs?category=${encodeURIComponent(post.category)}` },
            { label: post.title },
          ]}
        />

        {/* Main Header Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-8">
          {/* Left: Title & Meta */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
                <span className="font-medium text-foreground">{post.author}</span>
                <span className="text-foreground-muted">•</span>
                <time dateTime={post.publishedAt}>
                  {publishedDate}
                </time>
                <span className="text-foreground-muted">•</span>
                <span>{post.readingTime} min read</span>
                <span className="text-foreground-muted">•</span>
                <Link
                  href={`/blogs?category=${post.category}`}
                  className="px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-medium hover:bg-primary/25 transition-colors"
                >
                  {post.category}
                </Link>
              </div>

              {/* Updated Date */}
              {updatedDate && updatedDate !== publishedDate && (
                <p className="text-xs text-foreground-muted">
                  Last updated: <time dateTime={post.updatedAt}>{updatedDate}</time>
                </p>
              )}

              {/* Share Buttons */}
              <ShareButtons
                title={post.title}
                slug={post.slug}
                className="mt-2"
              />
            </div>
          </div>

          {/* Right: Hero Image */}
          {post.coverImage?.url && (
            <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
