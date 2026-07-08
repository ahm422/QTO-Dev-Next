"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FeaturedBlogCard } from "@/components/insights";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { insightsConfig } from "@/config/insights";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/components/theme/cn";

type InsightsConfigType = typeof insightsConfig;

const HEADING_ID = "insights-heading";

interface InsightsSectionContentProps {
  featuredPost: BlogPost | null;
  config?: InsightsConfigType;
}

export function InsightsSectionContent({
  featuredPost,
  config,
}: InsightsSectionContentProps) {
  const cfg = config ?? insightsConfig;
  const browseAllLabel = cfg.readMoreCtaLabel ?? cfg.viewAllPostsLabel;

  return (
    <Container className="relative">
      <Reveal staggerSelector="[data-reveal]">
        <div className="max-w-3xl mx-auto text-center" data-reveal>
          <SectionHeader
            subtitle={cfg.subtitle}
            subtitleClassName="text-primary font-semibold"
            subtitlePill
            title={cfg.title}
            description={cfg.description}
            headingId={HEADING_ID}
            centered
          />
        </div>

        <div
          className={cn(
            "mt-14 rounded-2xl border border-border/80 overflow-hidden",
            "bg-gradient-to-b from-background to-surface-muted/30",
            "shadow-lg shadow-black/5 ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
          )}
          data-reveal
        >
          <div className="p-6 md:p-10">
            {featuredPost ? (
              <FeaturedBlogCard
                post={featuredPost}
                readMoreLabel={cfg.readMoreLabel}
              />
            ) : (
              <p className="text-center text-foreground-muted py-12">
                {cfg.emptyStateMessage}
              </p>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/blogs"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 hover:shadow-md",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "transition-all duration-200"
                )}
              >
                {browseAllLabel}
                <AppIcon name="arrow-right" size="sm" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
