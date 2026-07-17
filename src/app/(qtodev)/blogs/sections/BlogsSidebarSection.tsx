import Image from "next/image";
import Link from "next/link";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { cn } from "@/components/theme/cn";
import { blogsPageConfig } from "@/config/blogsPage";
import type { BlogsPageConfigType } from "@/config/blogsPage";
import { formatDateShort } from "@/lib/format";
import {
  getFeaturedBlogPosts,
  getLatestBlogPosts,
  getAllBlogPosts,
} from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

interface BlogsSidebarSectionProps {
  config?: BlogsPageConfigType;
  initialCategory?: string;
}

async function getPopularPosts(limit: number): Promise<BlogPost[]> {
  const featured = await getFeaturedBlogPosts(limit);
  if (featured.length >= limit) return featured.slice(0, limit);

  const latest = await getLatestBlogPosts(limit * 2);
  const seen = new Set(featured.map((p) => p.slug));
  const filled = [...featured];

  for (const post of latest) {
    if (filled.length >= limit) break;
    if (seen.has(post.slug)) continue;
    seen.add(post.slug);
    filled.push(post);
  }

  return filled;
}

function getCategoryCounts(posts: BlogPost[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function BlogsSidebarSection({
  config,
  initialCategory,
}: BlogsSidebarSectionProps) {
  const cfg = config ?? blogsPageConfig;
  const { sidebar, filter } = cfg;
  const postsLimit = sidebar.postsLimit;

  const [allPosts, popularPosts] = await Promise.all([
    getAllBlogPosts(),
    getPopularPosts(postsLimit),
  ]);

  const categories = getCategoryCounts(allPosts);
  const activeCategory = initialCategory?.trim() || null;
  const allCount = allPosts.length;

  return (
    <aside className="space-y-6" aria-label="Blog sidebar">
      <div className="lg:sticky lg:top-24 space-y-6">
        {categories.length > 0 ? (
          <div className="bg-surface p-4 rounded-lg border border-border">
            <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
              {sidebar.categoriesTitle}
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/blogs"
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    !activeCategory
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground-muted hover:bg-primary/[0.06] hover:text-foreground"
                  )}
                  aria-current={!activeCategory ? "page" : undefined}
                >
                  <span>{filter.allLabel}</span>
                  <span className="tabular-nums text-xs">{allCount}</span>
                </Link>
              </li>
              {categories.map(({ name, count }) => {
                const isActive = activeCategory === name;
                return (
                  <li key={name}>
                    <Link
                      href={`/blogs?category=${encodeURIComponent(name)}`}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground-muted hover:bg-primary/[0.06] hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="truncate">{name}</span>
                      <span className="tabular-nums text-xs shrink-0">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {popularPosts.length > 0 ? (
          <div className="bg-surface p-4 rounded-lg border border-border">
            <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide">
              {sidebar.postsTitle}
            </h3>
            <ul className="space-y-3">
              {popularPosts.map((post) => {
                const imageUrl = post.coverImage?.url ?? post.image;
                const imageAlt = post.coverImage?.alt ?? post.title;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="group flex items-start gap-3 rounded-md transition-colors hover:bg-primary/[0.04] -mx-1 px-1 py-1"
                    >
                      {imageUrl ? (
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border bg-surface-muted">
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </span>
                      ) : (
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-primary/10 text-primary text-xs font-semibold"
                          aria-hidden
                        >
                          {post.title.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </span>
                        <time
                          dateTime={post.publishedAt}
                          className="mt-0.5 block text-xs text-foreground-muted"
                        >
                          {formatDateShort(post.publishedAt)}
                        </time>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <NewsletterSignup title={sidebar.newsletterTitle} />
      </div>
    </aside>
  );
}
