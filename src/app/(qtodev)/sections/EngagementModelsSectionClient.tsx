"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { EngagementCard } from "@/components/engagement";
import { engagementModelsConfig } from "@/config/engagementModels";
type EngagementModelsConfigType = typeof engagementModelsConfig;
import type { EngagementModel } from "@/types/engagementModel";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "engagement-models-heading";

export function EngagementModelsSectionClient({
  items,
  config,
}: {
  items: EngagementModel[];
  config?: EngagementModelsConfigType;
}) {
  const cfg = config ?? engagementModelsConfig;
  if (items.length === 0) return null;
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden bg-surface border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 w-[560px] h-[420px] rounded-full bg-primary/[0.05] blur-3xl -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 right-0 w-[500px] h-[380px] rounded-full bg-primary/[0.04] blur-3xl translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-16 md:mb-20">
            <SectionHeader
              subtitle={cfg.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title={cfg.title}
              titleHighlight={cfg.titleHighlight}
              description={cfg.description}
              headingId={HEADING_ID}
            />
          </div>
        </Reveal>
      </Container>

      {/* Full-width cards grid */}
      <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto w-full max-w-[1800px]">
          <Reveal staggerSelector="[data-reveal]">
            <div
              data-reveal
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-4 items-stretch lg:items-center sm:[grid-template-columns:repeat(2,minmax(0,1fr))] lg:[grid-template-columns:repeat(3,minmax(0,1fr))]"
              role="list"
            >
              {items.map((model) => (
                <article
                  key={model.optionNumber}
                  role="listitem"
                  className="flex min-h-0 w-full min-w-0 overflow-visible"
                  data-reveal
                >
                  <EngagementCard
                    optionNumber={model.optionNumber}
                    title={model.title}
                    description={model.description}
                    features={model.features}
                    isPopular={model.isPopular}
                    getStartedHref={model.getStartedHref}
                    getStartedLabel={cfg.getStartedLabel}
                    mostPopularLabel={cfg.mostPopularLabel}
                  />
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
