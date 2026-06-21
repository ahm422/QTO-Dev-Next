import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import type { Project } from "@/types/project";

const HEADING_ID = "projects-grid-heading";

interface ProjectsGridSectionProps {
  projects: Project[];
}

export function ProjectsGridSection({ projects, config }: ProjectsGridSectionProps & { config?: ProjectsPageConfigType }) {
  const cfg = config ?? projectsPageConfig;
  const { grid } = cfg;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
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
        <div className="mb-14 md:mb-16">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project) => (
            <div key={project.id}>
              <Link
                href={`/projects/${project.slug}`}
                className={cn(
                  "group block h-full rounded-2xl overflow-hidden",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
                )}
                aria-label={`View project: ${project.title}`}
              >
                <Card
                  className={cn(
                    "relative h-full flex flex-col rounded-2xl overflow-hidden",
                    "border-t-4 border-t-primary",
                    "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/15",
                    "transition-transform transition-shadow duration-500 ease-out",
                    "hover:-translate-y-2 hover:rotate-[0.35deg]",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-muted focus-within:outline-none"
                  )}
                >
                  <div
                    className="pointer-events-none absolute top-0 right-0 z-10 w-32 h-32 bg-gradient-to-bl from-primary/10 via-primary/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    aria-hidden
                  />
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[0.4deg]"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="relative p-6 md:p-7 flex flex-col flex-1">
                    <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground mb-3">
                      {project.title}
                    </h2>
                    <p className="text-foreground-muted mb-4 flex-1 leading-relaxed">
                      {project.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline">
                      {grid.viewProjectLabel}
                      <AppIcon
                        name="arrow-right"
                        size="sm"
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
