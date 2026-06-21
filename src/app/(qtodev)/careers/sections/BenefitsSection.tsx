"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { careersPageConfig } from "@/config/careersPage";
type CareersPageConfigType = typeof careersPageConfig;

const HEADING_ID = "benefits-heading";

export function BenefitsSection({ config }: { config?: CareersPageConfigType }) {
  const cfg = config ?? careersPageConfig;
  const { benefits } = cfg;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute -bottom-24 right-0 w-[420px] h-[320px] rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" data-reveal>
            <SectionHeader
              subtitle={benefits.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={benefits.title}
              titleHighlight={benefits.titleHighlight}
              description={benefits.description}
              headingId={HEADING_ID}
            />
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            data-reveal
          >
            {benefits.items.map((item) => (
              <article
                key={item.title}
                className={cn(
                  "h-full rounded-2xl border border-border/80 bg-background/80",
                  "shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/10",
                  "transition-all duration-200 hover:-translate-y-0.5",
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

