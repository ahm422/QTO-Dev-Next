import Link from "next/link";
import Image from "next/image";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  viewProjectLabel: string;
}

export function ProjectCard({ project, viewProjectLabel }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group block h-full rounded-2xl overflow-hidden",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
      )}
      aria-label={`View project: ${project.title}`}
    >
      <div
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface text-left",
          "shadow-lg shadow-black/[0.06] dark:shadow-black/25",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.1]"
        )}
      >
        <span
          className={cn(
            "absolute top-0 left-0 right-0 z-20 h-1 rounded-t-2xl bg-gradient-to-r from-primary via-cta-gold to-primary opacity-0 transition-opacity duration-300",
            "group-hover:opacity-100"
          )}
          aria-hidden
        />

        <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
          {project.image ? (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
              aria-hidden
            />
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 opacity-80 transition-opacity duration-300 group-hover:opacity-95"
            aria-hidden
          />

          <div className="absolute bottom-3 left-3 z-10 sm:bottom-4 sm:left-4">
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/25 sm:text-xs">
              {project.category}
            </span>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col border-t border-border/60 bg-gradient-to-b from-surface to-surface-muted/50 p-5 sm:p-6">
          <h2 className="font-heading text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
            {project.title}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-muted sm:text-base">
            {project.shortDescription}
          </p>

          {project.technologies.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-xs font-medium text-foreground-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : null}

          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            {viewProjectLabel}
            <AppIcon
              name="arrow-right"
              size="sm"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
