import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { blogsPageConfig } from "@/config/blogsPage";
import type { BlogPost } from "@/types/blog";

const HEADING_ID = "featured-posts-heading";

export function FeaturedPostsSectionClient({ posts }: { posts: BlogPost[] }) {
  const { featured } = blogsPageConfig;
  if (posts.length === 0) return null;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-[520px] h-[360px] rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[420px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={featured.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={featured.title}
              titleHighlight={featured.titleHighlight}
              description={featured.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {posts.map((post) => {
              const imageUrl = post.coverImage?.url ?? post.image;
              const imageAlt = post.coverImage?.alt ?? post.title;
              return (
                <div key={post.id} data-reveal>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className={cn(
                      "group block h-full rounded-2xl overflow-hidden",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
                    )}
                    aria-label={`Read article: ${post.title}`}
                  >
                    <Card
                      className={cn(
                        "relative h-full flex flex-col rounded-2xl overflow-hidden",
                        "border-t-4 border-t-primary",
                        "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10",
                        "transition-all duration-300 hover:-translate-y-1",
                        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-muted focus-within:outline-none"
                      )}
                    >
                      <div
                        className="pointer-events-none absolute top-0 right-0 z-10 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden
                      />
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div
                            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
                            aria-hidden
                          />
                        )}
                      </div>
                      <div className="relative p-6 md:p-7 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="default">{post.category}</Badge>
                          <span className="text-sm text-foreground-muted">
                            {post.readingTime} min read
                          </span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold tracking-tight text-foreground mb-2">
                          {post.title}
                        </h2>
                        <p className="text-foreground-muted mb-4 flex-1 leading-relaxed">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-foreground-muted">
                          <span>{post.author}</span>
                          <span>{post.publishedAt}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
