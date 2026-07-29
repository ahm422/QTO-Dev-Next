"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { LatestPostCard } from "@/components/insights/LatestPostCard";
import { cn } from "@/components/theme/cn";
import { blogsPageConfig, mergeBlogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;
import type { BlogPost } from "@/types/blog";

const HEADING_ID = "news-posts-heading";

export function NewsSectionClient({
  posts,
  config,
}: {
  posts: BlogPost[];
  config?: BlogsPageConfigType;
}) {
  const cfg = mergeBlogsPageConfig(config);
  const { news } = cfg;

  return (
    <section
      className={cn(
        "relative py-16 sm:py-20 md:py-28 overflow-hidden",
        "bg-background border-b border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-[480px] h-[320px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/3"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-10 sm:mb-12 md:mb-14">
            <SectionHeader
              subtitle={news.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={news.title}
              titleHighlight={news.titleHighlight}
              description={news.description}
              headingId={HEADING_ID}
            />
          </div>

          {posts.length === 0 ? (
            <p data-reveal className="text-sm text-muted-foreground">
              No company news yet.
            </p>
          ) : (
            /* Full-width editorial rows — scannable on mobile, no cramped 2-col splits */
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
              {posts.map((post, index) => (
                <div key={post.id} data-reveal>
                  <LatestPostCard
                    post={post}
                    authorLabel={cfg.authorLabel}
                    readMoreLabel={cfg.readMoreLabel}
                    layout="editorial"
                    featured={index === 0}
                  />
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
