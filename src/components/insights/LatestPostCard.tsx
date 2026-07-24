import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/shared/Text";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/components/theme/cn";

interface LatestPostCardProps {
  post: BlogPost;
  authorLabel: string;
  readMoreLabel: string;
  layout?: "horizontal" | "vertical" | "editorial";
  /** Larger lead treatment for editorial layout (first news item). */
  featured?: boolean;
}

export function LatestPostCard({
  post,
  authorLabel,
  readMoreLabel,
  layout = "horizontal",
  featured = false,
}: LatestPostCardProps) {
  const imageUrl = post.coverImage?.url ?? post.image;
  const imageAlt = post.coverImage?.alt ?? post.title;
  const excerpt = post.excerpt ?? post.description;
  const isVertical = layout === "vertical";
  const isEditorial = layout === "editorial";

  if (isEditorial) {
    return (
      <article
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border/80 bg-card",
          "transition-[border-color,box-shadow] duration-300",
          "hover:border-primary/35 hover:shadow-[0_16px_36px_-22px_rgba(0,0,0,0.4)]"
        )}
      >
        <Link
          href={`/blogs/${post.slug}`}
          className={cn(
            "flex flex-col sm:flex-row focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl",
            featured && "lg:min-h-[17rem]"
          )}
        >
          <div
            className={cn(
              "relative shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
              featured
                ? "aspect-[16/10] sm:aspect-auto sm:w-[42%] sm:min-h-[14rem] lg:min-h-[17rem]"
                : "aspect-[16/10] sm:aspect-auto sm:w-44 md:w-52 sm:min-h-[9.5rem]"
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                sizes={
                  featured
                    ? "(max-width: 640px) 100vw, 42vw"
                    : "(max-width: 640px) 100vw, 13rem"
                }
              />
            ) : null}
            <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground shadow-sm sm:top-4 sm:left-4">
              {post.category}
            </Badge>
          </div>

          <div
            className={cn(
              "flex flex-1 flex-col justify-center text-left",
              featured ? "gap-3 p-5 sm:p-7 lg:p-8" : "gap-2 p-4 sm:p-5"
            )}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-foreground-muted">
              <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <span>{post.readingTime} min read</span>
            </div>

            <Heading
              level={featured ? 3 : 4}
              className={cn(
                "leading-snug tracking-tight line-clamp-2 transition-colors group-hover:text-primary",
                featured ? "text-xl sm:text-2xl lg:text-[1.65rem]" : "text-base sm:text-lg"
              )}
            >
              {post.title}
            </Heading>

            {excerpt ? (
              <Text
                size="sm"
                color="muted"
                className={cn(
                  "leading-relaxed",
                  featured ? "line-clamp-3" : "line-clamp-2"
                )}
              >
                {excerpt}
              </Text>
            ) : null}

            <div className="mt-1 flex items-center justify-between gap-3 pt-1">
              <Text size="sm" color="muted" className="truncate text-xs">
                {post.author ?? authorLabel}
              </Text>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                {readMoreLabel}
                <AppIcon
                  name="arrow-right"
                  size="sm"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/80 bg-card",
        "transition-[border-color,transform,box-shadow] duration-300",
        "hover:border-primary/35 hover:-translate-y-0.5",
        "hover:shadow-[0_16px_36px_-22px_rgba(0,0,0,0.4)]"
      )}
    >
      <Link
        href={`/blogs/${post.slug}`}
        className={cn(
          "flex h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl",
          isVertical ? "flex-col" : "flex-col sm:flex-row"
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
            isVertical
              ? "w-full aspect-[16/10]"
              : "w-full sm:w-40 md:w-44 aspect-[16/10] sm:aspect-auto sm:min-h-[9rem] sm:self-stretch"
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes={
                isVertical
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  : "(max-width: 640px) 100vw, 11rem"
              }
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
            aria-hidden
          />
          <Badge className="absolute bottom-3 left-3 z-10 bg-primary text-primary-foreground shadow-sm">
            {post.category}
          </Badge>
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col text-left",
            isVertical ? "gap-2.5 p-4 sm:p-5" : "gap-2 p-4 sm:p-5"
          )}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
            <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
            <span className="text-border" aria-hidden>
              ·
            </span>
            <span>{post.readingTime} min</span>
          </div>

          <Heading
            level={4}
            className="leading-snug tracking-tight line-clamp-2 transition-colors group-hover:text-primary"
          >
            {post.title}
          </Heading>

          {isVertical && excerpt ? (
            <Text size="sm" color="muted" className="line-clamp-2 leading-relaxed flex-1">
              {excerpt}
            </Text>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-border/50">
            <Text size="sm" color="muted" className="truncate text-xs">
              {post.author ?? authorLabel}
            </Text>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary">
              {readMoreLabel}
              <AppIcon
                name="arrow-right"
                size="sm"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
