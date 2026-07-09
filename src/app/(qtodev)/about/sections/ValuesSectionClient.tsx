"use client";

import type { AboutPageContent } from "@/lib/cms/mappers";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";
import { cn } from "@/components/theme/cn";

type AboutPageConfigType = typeof aboutPageConfig;

const HEADING_ID = "about-values-heading";

export function ValuesSectionClient({
  content,
  config,
}: {
  readonly content: AboutPageContent;
  readonly config?: AboutPageConfigType;
}) {
  const cfg = config ?? aboutPageConfig;
  const { values: valuesConfig } = cfg;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface-muted border-y border-border"
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
              subtitle={valuesConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={valuesConfig.title}
              titleHighlight={valuesConfig.titleHighlight}
              description={valuesConfig.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
            {content.values.map((value, index) => (
              <article
                key={value.title}
                data-reveal
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
                    <AppIcon name="sparkles" size="sm" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-foreground-muted leading-relaxed">
                      {value.description}
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
