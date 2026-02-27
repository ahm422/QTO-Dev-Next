"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { careersPageConfig } from "@/config/careersPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "culture-heading";

export function CultureSection() {
  const { culture } = careersPageConfig;

  return (
    <section
      className="relative py-20 md:py-28 bg-background"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary/8 via-primary/4 to-transparent"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-start" data-reveal>
            <div>
              <SectionHeader
                subtitle={culture.subtitle}
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={culture.title}
                titleHighlight={culture.titleHighlight}
                description={culture.description}
                headingId={HEADING_ID}
                centered={false}
              />
            </div>

            <div
              className={cn(
                "relative rounded-3xl border border-border/80 bg-surface-muted/80",
                "shadow-lg shadow-black/10 p-6 sm:p-8 overflow-hidden"
              )}
              data-reveal
            >
              <div
                className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl"
                aria-hidden
              />

              <div className="relative space-y-5">
                {culture.highlights?.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-2xl bg-background/90 border border-border/70 p-4 sm:p-5"
                  >
                    <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-foreground-muted leading-relaxed">
                      {highlight.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

