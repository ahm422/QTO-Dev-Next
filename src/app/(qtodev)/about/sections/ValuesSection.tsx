"use client";

import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "about-values-heading";

export function ValuesSection() {
  const { values: valuesConfig } = aboutPageConfig;

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
              subtitle={valuesConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={valuesConfig.title}
              titleHighlight={valuesConfig.titleHighlight}
              description={valuesConfig.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {aboutData.values.map((value, i) => (
              <div key={value.title} data-reveal>
                <Card
                  className={cn(
                    "group relative p-6 md:p-7 h-full flex flex-col rounded-2xl overflow-hidden",
                    "border-t-4 border-t-primary bg-surface",
                    "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10",
                    "transition-all duration-300 hover:-translate-y-1",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-muted focus-within:outline-none"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5 font-heading font-bold text-lg",
                      "transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15"
                    )}
                  >
                    {value.title.charAt(0)}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-foreground-muted text-sm md:text-base leading-relaxed flex-1">
                    {value.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
