"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { careersPageConfig } from "@/config/careersPage";
type CareersPageConfigType = typeof careersPageConfig;
import { cn } from "@/components/theme/cn";

const HEADING_ID = "culture-heading";

export function CultureSection({ config }: { config?: CareersPageConfigType }) {
  const cfg = config ?? careersPageConfig;
  const { culture } = cfg;

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
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" data-reveal>
            <SectionHeader
              subtitle={culture.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={culture.title}
              titleHighlight={culture.titleHighlight}
              description={culture.description}
              headingId={HEADING_ID}
            />
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            data-reveal
          >
            {culture.highlights.map((item) => (
              <article
                key={item.title}
                className={cn(
                  "h-full rounded-2xl border border-border/80 bg-surface-muted/80",
                  "shadow-sm shadow-black/5 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-300 hover:-translate-y-1",
                  "p-6 sm:p-7"
                )}
              >
                <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-foreground-muted leading-relaxed">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
