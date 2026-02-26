import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Card } from "@/components/ui/shared/Card";
import { Badge } from "@/components/ui/shared/Badge";
import { Text } from "@/components/ui/shared/Text";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/components/theme/cn";

interface LatestPostCardProps {
  post: BlogPost;
  authorLabel: string;
  readMoreLabel: string;
}

export function LatestPostCard({
  post,
  authorLabel,
  readMoreLabel,
}: LatestPostCardProps) {
  const imageUrl = post.coverImage?.url ?? post.image;
  const imageAlt = post.coverImage?.alt ?? post.title;

  return (
    <Card className="overflow-hidden p-0">
      <Link
        href={`/blogs/${post.slug}`}
        className="flex flex-col sm:flex-row focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
      >
        <div className="relative w-full sm:w-40 shrink-0 h-40 sm:h-auto min-h-[10rem] bg-gradient-to-br from-teal-400 to-teal-600 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 10rem"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5 text-left">
          <Badge variant="primary" className="mb-2 w-fit">
            {post.category}
          </Badge>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground-muted mb-2">
            <span className="inline-flex items-center gap-1.5">
              <AppIcon name="calendar" size="sm" className="text-foreground-muted" />
              {formatDateShort(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <AppIcon name="clock" size="sm" className="text-foreground-muted" />
              {post.readingTime} min read
            </span>
          </div>
          <Heading level={4} className="mb-2 line-clamp-2">
            {post.title}
          </Heading>
          <Text size="sm" color="muted" className="mb-3">
            {authorLabel}
          </Text>
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
            {readMoreLabel}
            <AppIcon name="arrow-right" size="sm" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
