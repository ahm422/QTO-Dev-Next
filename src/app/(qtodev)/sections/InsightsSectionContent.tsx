"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { LatestPostCard, HeadlinePostItem } from "@/components/insights";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { insightsConfig } from "@/config/insights";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "insights-heading";

interface InsightsSectionContentProps {
  latestPosts: BlogPost[];
  headlinePosts: BlogPost[];
  todayFormatted: string;
}

export function InsightsSectionContent({
  latestPosts,
  headlinePosts,
  todayFormatted,
}: InsightsSectionContentProps) {
  return (
    <Container className="relative">
      <Reveal staggerSelector="[data-reveal]">
        <div className="max-w-3xl mx-auto text-center" data-reveal>
          <SectionHeader
            subtitle={insightsConfig.subtitle}
            subtitleClassName="text-primary font-semibold"
            subtitlePill
            title={insightsConfig.title}
            description={insightsConfig.description}
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
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
              {/* Left column — Latest Posts */}
              <div>
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {insightsConfig.latestPostsLabel}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    {insightsConfig.todayLabel}: {todayFormatted}
                  </span>
                </div>
                <div className="space-y-6">
                  {latestPosts.map((post) => (
                    <div key={post.id} data-reveal>
                      <LatestPostCard
                        post={post}
                        authorLabel={insightsConfig.authorLabel}
                        readMoreLabel={insightsConfig.readMoreLabel}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — Headline Posts */}
              <div>
                <h3 className="font-heading mb-8 text-xl font-semibold text-foreground">
                  {insightsConfig.headlinePostsLabel}
                </h3>
                <ul className="space-y-4" role="list">
                  {headlinePosts.map((post) => (
                    <li key={post.id} data-reveal>
                      <HeadlinePostItem post={post} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/blogs"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-semibold",
                  "bg-primary/10 text-primary border border-primary/20",
                  "hover:bg-primary/15 hover:border-primary/30 hover:shadow-md",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "transition-all duration-200"
                )}
              >
                {insightsConfig.viewAllPostsLabel}
                <AppIcon name="arrow-right" size="sm" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
