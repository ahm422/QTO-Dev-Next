"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
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
                  "shadow-sm shadow-black/5 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-300 hover:-translate-y-1",
                  "p-6 sm:p-7"
                )}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <AppIcon
                    name={(item.icon as AppIconName) || "sparkles"}
                    size="sm"
                    className="h-5 w-5"
                  />
                </div>
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
