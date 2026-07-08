import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDateShort } from '@/lib/format';

interface RelatedArticlesProps {
  posts: BlogPost[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
        Relevant Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const imageUrl = post.coverImage?.url ?? post.image;
          const imageAlt = post.coverImage?.alt ?? post.title;

          return (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group flex flex-col bg-surface rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-surface-muted overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
                    aria-hidden
                  />
                )}
              </div>

              <div className="flex flex-col flex-1 p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-foreground-muted text-sm mb-4 line-clamp-2 flex-1">
                  {post.excerpt ?? post.description}
                </p>

                <div className="flex items-center justify-between text-xs text-foreground-muted mt-auto">
                  <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
