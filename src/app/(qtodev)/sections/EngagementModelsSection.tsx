import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { EngagementCard } from "@/components/engagement";
import { engagementModelsConfig } from "@/config/engagementModels";
import { engagementModelItems } from "@/data/engagementModels";

const HEADING_ID = "engagement-models-heading";

export function EngagementModelsSection() {
  return (
    <section
      className="py-16 md:py-20 bg-surface"
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <SectionHeader
          subtitle={engagementModelsConfig.subtitle}
          subtitleClassName="text-primary"
          title={engagementModelsConfig.title}
          titleHighlight={engagementModelsConfig.titleHighlight}
          description={engagementModelsConfig.description}
          headingId={HEADING_ID}
        />

        <div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8"
          role="list"
        >
          {engagementModelItems.map((model) => (
            <article key={model.optionNumber} role="listitem">
              <EngagementCard
                optionNumber={model.optionNumber}
                title={model.title}
                description={model.description}
                features={model.features}
                isPopular={model.isPopular}
                getStartedHref={model.getStartedHref}
                getStartedLabel={engagementModelsConfig.getStartedLabel}
                mostPopularLabel={engagementModelsConfig.mostPopularLabel}
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
