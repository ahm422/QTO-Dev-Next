"use client";

import type { Service } from "@/types/service";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { servicesPageConfig } from "@/config/servicesPage";
import { ServiceCard } from "@/components/services/ServiceCard";

type ServicesPageConfigType = typeof servicesPageConfig;

const HEADING_ID = "services-grid-heading";

export function ServicesGridSectionClient({
  services,
  config,
}: {
  readonly services: Service[];
  readonly config?: ServicesPageConfigType;
}) {
  const cfg = config ?? servicesPageConfig;
  const { grid } = cfg;

  return (
    <section
      id="services-grid"
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
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
              subtitle={grid.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={grid.title}
              titleHighlight={grid.titleHighlight}
              description={grid.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {services.map((service) => (
              <div key={service.id} data-reveal>
                <ServiceCard
                  service={service}
                  variant="detailed"
                  learnMoreLabel={grid.learnMoreLabel}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
