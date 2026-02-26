import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { LatestPostCard, HeadlinePostItem } from "@/components/insights";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { insightsConfig } from "@/config/insights";
import { getLatestBlogPosts, getHeadlineBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "insights-heading";

export async function InsightsSection() {
  const [latestPosts, headlinePosts] = await Promise.all([
    getLatestBlogPosts(2),
    getHeadlineBlogPosts(5),
  ]);

  const todayFormatted = formatDate(new Date());

  return (
    <section
      id="insights"
      className="py-16 md:py-20 bg-surface"
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <SectionHeader
          subtitle={insightsConfig.subtitle}
          subtitleClassName="text-primary"
          subtitlePill
          title={insightsConfig.title}
          description={insightsConfig.description}
          headingId={HEADING_ID}
          centered
        />

        <div className="mt-12 rounded-xl border border-border bg-background p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Left column — Latest Posts */}
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {insightsConfig.latestPostsLabel}
                </h3>
                <span className="text-sm text-foreground-muted">
                  {insightsConfig.todayLabel}: {todayFormatted}
                </span>
              </div>
              <div className="space-y-6">
                {latestPosts.map((post) => (
                  <LatestPostCard
                    key={post.id}
                    post={post}
                    authorLabel={insightsConfig.authorLabel}
                    readMoreLabel={insightsConfig.readMoreLabel}
                  />
                ))}
              </div>
            </div>

            {/* Right column — Headline Posts */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                {insightsConfig.headlinePostsLabel}
              </h3>
              <ul className="space-y-3" role="list">
                {headlinePosts.map((post) => (
                  <HeadlinePostItem key={post.id} post={post} />
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/blogs"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-base font-semibold",
                "bg-surface-muted text-foreground hover:bg-border",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "transition-colors"
              )}
            >
              {insightsConfig.viewAllPostsLabel}
              <AppIcon name="arrow-right" size="sm" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
