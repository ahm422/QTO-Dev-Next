import Link from "next/link";
import { Project } from "@/content/projects/types";

interface ProjectAboutProps {
  project: Project;
}

export function ProjectAbout({ project }: ProjectAboutProps) {
  return (
    <section className="py-12 md:py-16" aria-labelledby="about-project-heading">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div>
          <h2 id="about-project-heading" className="text-2xl font-bold text-foreground md:text-3xl">
            About the Project
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground-muted">{project.about.overview}</p>
          {project.about.scope ? (
            <p className="mt-4 text-sm leading-7 text-foreground-muted"><span className="font-semibold text-foreground">Scope:</span> {project.about.scope}</p>
          ) : null}
          {project.about.client ? (
            <p className="mt-2 text-sm leading-7 text-foreground-muted"><span className="font-semibold text-foreground">Client:</span> {project.about.client}</p>
          ) : null}
          {project.about.audience ? (
            <p className="mt-2 text-sm leading-7 text-foreground-muted"><span className="font-semibold text-foreground">Audience:</span> {project.about.audience}</p>
          ) : null}
        </div>

        <aside className="rounded-2xl border border-border bg-surface-muted p-6">
          <h3 className="text-lg font-semibold text-foreground">Project Snapshot</h3>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Services</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground-muted">
              {project.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Tech Stack</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground-muted ring-1 ring-border">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Team</p>
              <p className="mt-1 text-foreground-muted">{project.team}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Timeline</p>
              <p className="mt-1 text-foreground-muted">{project.timeline}</p>
            </div>
          </div>

          {project.pdfDownloadUrl ? (
            <Link
              href={project.pdfDownloadUrl}
              aria-label="Download case study PDF"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground hover:bg-surface-muted"
            >
              Download Case Study PDF
            </Link>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
