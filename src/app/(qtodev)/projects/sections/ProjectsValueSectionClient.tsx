"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StaggerReveal } from "@/components/animations/StaggerReveal";
import { cn } from "@/components/theme/cn";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { ValuePropCard, type WorkValueItem } from "./ValuePropCard";

const HEADING_ID = "projects-value-heading";

interface ProjectsValueSectionClientProps {
  items: WorkValueItem[];
  config?: ProjectsPageConfigType;
}

export function ProjectsValueSectionClient({
  items,
  config,
}: ProjectsValueSectionClientProps) {
  const cfg = config ?? projectsPageConfig;
  const { valueSection } = cfg;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-[420px] h-[300px] rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[380px] h-[280px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <StaggerReveal childSelector=":scope > *">
          <div className="mb-12 md:mb-16">
            <SectionHeader
              subtitle={valueSection.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={valueSection.title}
              titleHighlight={valueSection.titleHighlight}
              description={valueSection.description}
              headingId={HEADING_ID}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {items.map((item, index) => (
              <ValuePropCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </StaggerReveal>
      </Container>
    </section>
  );
}
