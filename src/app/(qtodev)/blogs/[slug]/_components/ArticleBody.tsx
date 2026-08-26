import { BlogPost } from '@/types/blog';
import Link from "next/link";
import { MDXRenderer } from './MDXRenderer';
import { KeyTakeaways } from './KeyTakeaways';

interface ArticleBodyProps {
  post: BlogPost;
}

export function ArticleBody({ post }: ArticleBodyProps) {
  const intro = post.excerpt ?? post.description;
  const keyTakeaways = extractKeyTakeaways(post.content, 4);

  return (
    <div className="prose-style">
      {intro ? (
        <p className="text-lg leading-relaxed text-foreground-muted mb-8 font-medium">
          {intro}
        </p>
      ) : null}

      {keyTakeaways.length > 0 && (
        <KeyTakeaways takeaways={keyTakeaways} />
      )}

      <MDXRenderer content={post.content} />

      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-surface-muted hover:bg-border text-foreground-muted rounded-full text-sm font-medium transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function extractKeyTakeaways(content: string, limit: number): string[] {
  const listItems = content.match(/<li>([^<]+)<\/li>/g) || [];
  return listItems
    .slice(0, limit)
    .map((item) => item.replace(/<[^>]*>/g, ''))
    .filter(Boolean);
}
