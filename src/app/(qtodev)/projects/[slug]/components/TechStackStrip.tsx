import { Project } from "@/content/projects/types";

interface TechStackStripProps {
  project: Project;
}

export function TechStackStrip({ project }: TechStackStripProps) {
  const items = project.technologiesLogos?.length ? project.technologiesLogos : project.techStack;

  return (
    <section className="py-12 md:py-16" aria-labelledby="technologies-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="technologies-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Technologies
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">Chosen for scalability, security, and maintainability.</p>

        <div className="mt-6 flex snap-x gap-3 overflow-x-auto pb-2">
          {items.map((tech) => (
            <div
              key={tech}
              className="snap-start whitespace-nowrap rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground-muted"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
