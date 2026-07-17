import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { LatestPostCard } from "@/components/insights/LatestPostCard";
import { cn } from "@/components/theme/cn";
import { blogsPageConfig } from "@/config/blogsPage";
type BlogsPageConfigType = typeof blogsPageConfig;
import type { BlogPost } from "@/types/blog";

const HEADING_ID = "blog-grid-heading";

interface BlogGridSectionProps {
  posts: BlogPost[];
  config?: BlogsPageConfigType;
  embedded?: boolean;
}

export function BlogGridSection({
  posts,
  config,
  embedded = false,
}: BlogGridSectionProps) {
  const cfg = config ?? blogsPageConfig;
  const { grid } = cfg;

  const content = (
    <Reveal staggerSelector="[data-reveal]">
      <div data-reveal className={cn(embedded ? "mb-10 md:mb-12" : "mb-14 md:mb-16")}>
        <SectionHeader
          subtitle={grid.subtitle}
          subtitleClassName="text-primary font-semibold tracking-widest"
          subtitlePill
          title={grid.title}
          titleHighlight={grid.titleHighlight}
          description={grid.description}
          headingId={HEADING_ID}
        />
      </div>

      {posts.length === 0 ? (
        <p data-reveal className="text-center text-foreground-muted py-12">
          No articles match your filters. Try adjusting your search or category.
        </p>
      ) : (
        <div
          className={cn(
            "grid gap-8 lg:gap-10",
            embedded ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {posts.map((post) => (
            <div key={post.id} data-reveal>
              <LatestPostCard
                post={post}
                authorLabel={cfg.authorLabel}
                readMoreLabel={cfg.readMoreLabel}
                layout="vertical"
              />
            </div>
          ))}
        </div>
      )}
    </Reveal>
  );

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "bg-surface-muted border-y border-border",
        embedded ? "py-10 md:py-12" : "py-20 md:py-28"
      )}
      aria-labelledby={HEADING_ID}
    >
      {!embedded ? (
        <>
          <div
            className="pointer-events-none absolute top-0 right-0 w-[520px] h-[360px] rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-[420px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
            aria-hidden
          />
        </>
      ) : null}

      {embedded ? (
        <div className="relative">{content}</div>
      ) : (
        <Container className="relative">{content}</Container>
      )}
    </section>
  );
}
