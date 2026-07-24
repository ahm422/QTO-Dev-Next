"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { EngagementCard } from "@/components/engagement";
import { engagementModelsConfig } from "@/config/engagementModels";
type EngagementModelsConfigType = typeof engagementModelsConfig;
import type { EngagementModel } from "@/types/engagementModel";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { homepageSectionPadding } from "@/components/theme/sectionClasses";

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
      className={cn(
        "relative overflow-hidden bg-surface border-y border-border",
        homepageSectionPadding
      )}
      aria-labelledby={HEADING_ID}
    >
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
          <div data-reveal className="mb-10 md:mb-12 lg:mb-14">
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

          <div
            data-reveal
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              "gap-4 sm:gap-5 lg:gap-5",
              "items-stretch pt-2"
            )}
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
      </Container>
    </section>
  );
}
