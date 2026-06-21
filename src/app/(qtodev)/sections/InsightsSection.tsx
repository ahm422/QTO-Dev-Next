import { InsightsSectionContent } from "./InsightsSectionContent";
import { getLatestBlogPosts, getHeadlineBlogPosts } from "@/lib/blog";
import { findPageSection } from "@/lib/cms/pageContent";
import { formatDate } from "@/lib/format";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "insights-heading";

export async function InsightsSection() {
  const [latestPosts, headlinePosts, sectionConfig] = await Promise.all([
    getLatestBlogPosts(2),
    getHeadlineBlogPosts(5),
    findPageSection("homepage.insights"),
  ]);

  const todayFormatted = formatDate(new Date());

  return (
    <section
      id="insights"
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-gradient-to-b from-surface via-surface-muted/30 to-surface",
        "border-y border-border/80"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/3 -left-40 w-80 h-80 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <InsightsSectionContent
        latestPosts={latestPosts}
        headlinePosts={headlinePosts}
        todayFormatted={todayFormatted}
        config={sectionConfig as any}
      />
    </section>
  );
}
