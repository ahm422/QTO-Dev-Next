"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/shared/Text";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/components/theme/cn";

interface FeaturedBlogCardProps {
  post: BlogPost;
  readMoreLabel: string;
}

/**
 * Media-first vertical card — readable in 1–2 column grids and on mobile.
 * Avoids side-by-side image/text inside narrow columns.
 */
export function FeaturedBlogCard({ post, readMoreLabel }: FeaturedBlogCardProps) {
  const imageUrl = post.coverImage?.url ?? post.image;
  const imageAlt = post.coverImage?.alt ?? post.title;
  const excerpt = post.excerpt ?? post.description;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-border/80 bg-card",
        "transition-[border-color,transform,box-shadow] duration-300",
        "hover:border-primary/35 hover:-translate-y-0.5",
        "hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.45)]"
      )}
    >
      <Link
        href={`/blogs/${post.slug}`}
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent"
            aria-hidden
          />
          <Badge className="absolute bottom-3 left-3 z-10 bg-primary text-primary-foreground shadow-sm">
            {post.category}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-foreground-muted">
            <time dateTime={post.publishedAt} className="inline-flex items-center gap-1.5">
              <AppIcon name="calendar" size="sm" className="opacity-70" />
              {formatDateShort(post.publishedAt)}
            </time>
            <span className="text-border" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AppIcon name="clock" size="sm" className="opacity-70" />
              {post.readingTime} min
            </span>
          </div>

          <Heading
            level={3}
            className="text-xl sm:text-2xl leading-snug line-clamp-2 tracking-tight transition-colors group-hover:text-primary"
          >
            {post.title}
          </Heading>

          {excerpt ? (
            <Text size="sm" color="muted" className="line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {excerpt}
            </Text>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-border/60">
            <Text size="sm" color="muted" className="truncate text-xs sm:text-sm">
              {post.author}
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
