"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

const HEADING_ID = "projects-grid-heading";

interface ProjectsGridSectionProps {
  projects: Project[];
  onClearFilters?: () => void;
  config?: ProjectsPageConfigType;
}

export function ProjectsGridSection({
  projects,
  onClearFilters,
  config,
}: ProjectsGridSectionProps) {
  const cfg = config ?? projectsPageConfig;
  const { grid, filter } = cfg;
  const isEmpty = projects.length === 0;

  return (
    <section
      id="projects-grid"
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

          {isEmpty ? (
            <div data-reveal className="py-16 text-center">
              <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                {filter.emptyStateTitle}
              </h3>
              <p className="mt-3 text-foreground-muted">{filter.emptyStateDescription}</p>
              {onClearFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 rounded-full px-6"
                  onClick={onClearFilters}
                >
                  {filter.clearFiltersLabel}
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {projects.map((project) => (
                <div key={project.id} data-reveal>
                  <ProjectCard project={project} viewProjectLabel={grid.viewProjectLabel} />
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
