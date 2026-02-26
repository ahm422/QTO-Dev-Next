"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "about-trust-heading";

export function TrustSection() {
  const { trust } = aboutPageConfig;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface-muted border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
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
              subtitle={trust.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={trust.title}
              titleHighlight={trust.titleHighlight}
              description={trust.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {trust.reasons.map((reason, i) => (
              <div
                key={i}
                data-reveal
                className={cn(
                  "flex items-start gap-4 p-6 md:p-7 rounded-2xl",
                  "bg-surface border border-border",
                  "shadow-sm hover:shadow-md hover:shadow-primary/5",
                  "transition-all duration-300 hover:-translate-y-0.5",
                  "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-muted focus-within:outline-none"
                )}
              >
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"
                  aria-hidden
                >
                  <AppIcon name="check" size="sm" />
                </span>
                <span className="text-foreground-muted text-base leading-relaxed pt-1.5">
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
