"use client";

import { aboutData } from "@/data/about";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";
import { Reveal } from "@/components/animations/Reveal";
import { aboutPageConfig } from "@/config/aboutPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "about-mission-vision-heading";

export function MissionVisionSection() {
  const { mission } = aboutPageConfig;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden bg-surface border-y border-border"
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
              subtitle={mission.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={mission.title}
              titleHighlight={mission.titleHighlight}
              description={mission.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            <div data-reveal>
              <Card
                className={cn(
                  "p-8 md:p-10 rounded-2xl h-full flex flex-col",
                  "border-l-4 border-l-primary bg-surface",
                  "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/5",
                  "transition-all duration-300 hover:-translate-y-0.5"
                )}
              >
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                  Our Mission
                </h3>
                <p className="text-lg text-foreground-muted leading-relaxed flex-1">
                  {aboutData.mission}
                </p>
              </Card>
            </div>
            <div data-reveal>
              <Card
                className={cn(
                  "p-8 md:p-10 rounded-2xl h-full flex flex-col",
                  "bg-surface-muted border border-border",
                  "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/5",
                  "transition-all duration-300 hover:-translate-y-0.5"
                )}
              >
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                  Our Vision
                </h3>
                <p className="text-lg text-foreground-muted leading-relaxed flex-1">
                  {aboutData.vision}
                </p>
              </Card>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
