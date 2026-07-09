"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/shared/Text";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { formatDateShort } from "@/lib/format";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { cn } from "@/components/theme/cn";

interface FeaturedBlogCardProps {
  post: BlogPost;
  readMoreLabel: string;
}

export function FeaturedBlogCard({ post, readMoreLabel }: FeaturedBlogCardProps) {
  const motionEnabled = useMotionEnabled();
  const imageRef = useRef<HTMLDivElement>(null);
  const imageUrl = post.coverImage?.url ?? post.image;
  const imageAlt = post.coverImage?.alt ?? post.title;
  const excerpt = post.excerpt ?? post.description;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!motionEnabled || !imageRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      imageRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.06)`;
    },
    [motionEnabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
  }, []);

  return (
    <Card className="overflow-hidden p-0 rounded-2xl border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
      <Link
        href={`/blogs/${post.slug}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col md:flex-row focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
      >
        <div className="relative w-full md:w-1/2 shrink-0 min-h-[16rem] md:min-h-[20rem] bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
          {imageUrl ? (
            <div
              ref={imageRef}
              className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-8 lg:p-10 text-left">
          <Badge variant="default" className="mb-4 w-fit text-xs font-medium">
            {post.category}
          </Badge>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground-muted mb-3">
            <span className="inline-flex items-center gap-1.5">
              <AppIcon name="calendar" size="sm" className="text-foreground-muted" />
              <time dateTime={post.publishedAt}>{formatDateShort(post.publishedAt)}</time>
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 transition-all duration-300",
                "group-hover:text-primary group-hover:underline group-hover:underline-offset-4 group-hover:decoration-primary/40"
              )}
            >
              <AppIcon
                name="clock"
                size="sm"
                className="text-foreground-muted transition-colors duration-300 group-hover:text-primary"
              />
              <span className="transition-colors duration-300">{post.readingTime} min read</span>
            </span>
          </div>
          <Heading
            level={3}
            className="mb-3 text-2xl md:text-3xl line-clamp-3 group-hover:text-primary transition-colors"
          >
            {post.title}
          </Heading>
          {excerpt ? (
            <Text size="base" color="muted" className="mb-4 line-clamp-3 leading-relaxed">
              {excerpt}
            </Text>
          ) : null}
          <Text size="sm" color="muted" className="mb-6">
            {post.author}
          </Text>
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-auto">
            {readMoreLabel}
            <AppIcon name="arrow-right" size="sm" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
