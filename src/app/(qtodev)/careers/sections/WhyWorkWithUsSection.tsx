"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { careersPageConfig } from "@/config/careersPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "why-work-with-us-heading";

export function WhyWorkWithUsSection() {
  const { whyWork } = careersPageConfig;

  return (
    <section
      className="relative py-20 md:py-28 bg-background"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/8 via-primary/4 to-transparent"
        aria-hidden
      />
      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16" data-reveal>
            <SectionHeader
              subtitle={whyWork.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={whyWork.title}
              titleHighlight={whyWork.titleHighlight}
              description={whyWork.description}
              headingId={HEADING_ID}
            />
          </div>

          <div
            className="grid grid-cols-1 gap-6 sm:gap-7 md:gap-8 md:grid-cols-2 lg:grid-cols-2"
            data-reveal
          >
            {whyWork.items.map((item, index) => (
              <article
                key={item.title}
                className={cn(
                  "flex h-full flex-col rounded-2xl border border-border/80 bg-surface-muted/60",
                  "shadow-sm shadow-black/5 hover:shadow-md hover:shadow-black/10",
                  "transition-all duration-200 hover:-translate-y-0.5",
                  "p-6 sm:p-7"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    aria-hidden
                  >
                    <AppIcon
                      name={item.icon || "sparkles"}
                      size="sm"
                      className="h-5 w-5"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-foreground-muted leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
                <span
                  className="mt-5 text-xs font-medium uppercase tracking-wide text-foreground-muted/80"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </article>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

