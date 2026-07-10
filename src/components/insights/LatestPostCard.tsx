import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Card } from "@/components/ui/card";
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
  layout?: "horizontal" | "vertical";
}

export function LatestPostCard({
  post,
  authorLabel,
  readMoreLabel,
  layout = "horizontal",
}: LatestPostCardProps) {
  const imageUrl = post.coverImage?.url ?? post.image;
  const imageAlt = post.coverImage?.alt ?? post.title;
  const excerpt = post.excerpt ?? post.description;
  const isVertical = layout === "vertical";

  return (
    <Card
      className={cn(
        "overflow-hidden p-0 rounded-2xl border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group h-full",
        isVertical && "hover:-translate-y-1"
      )}
    >
      <Link
        href={`/blogs/${post.slug}`}
        className={cn(
          "flex h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl",
          isVertical ? "flex-col" : "flex-col sm:flex-row"
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
            isVertical
              ? "w-full aspect-[16/10] rounded-t-2xl"
              : "w-full sm:w-44 h-44 sm:h-auto min-h-[11rem] rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={
                isVertical
                  ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  : "(max-width: 640px) 100vw, 11rem"
              }
            />
          ) : null}
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col text-left",
            isVertical ? "p-6 md:p-7" : "p-5 sm:p-6"
          )}
        >
          <Badge variant="default" className="mb-3 w-fit text-xs font-medium">
            {post.category}
          </Badge>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground-muted mb-2">
            <span className="inline-flex items-center gap-1.5">
              <AppIcon name="calendar" size="sm" className="text-foreground-muted" />
              <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AppIcon name="clock" size="sm" className="text-foreground-muted" />
              {post.readingTime} min read
            </span>
          </div>
          <Heading
            level={4}
            className={cn(
              "mb-2 line-clamp-2 group-hover:text-primary transition-colors",
              isVertical && "font-heading font-bold tracking-tight"
            )}
          >
            {post.title}
          </Heading>
          {isVertical && excerpt ? (
            <Text size="sm" color="muted" className="mb-3 line-clamp-2 flex-1">
              {excerpt}
            </Text>
          ) : null}
          <Text size="sm" color="muted" className={cn("mb-4", isVertical && "text-xs")}>
            {post.author ?? authorLabel}
          </Text>
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
            {readMoreLabel}
            <AppIcon
              name="arrow-right"
              size="sm"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </Card>
  );
}
