import Link from "next/link";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { RichText } from "@/components/common/RichText";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";

interface ProjectAboutProps {
  project: Project;
}

const serviceIcons: AppIconName[] = ["compass", "palette", "laptop-code", "flask-vial", "cloud"];

export function ProjectAbout({ project }: ProjectAboutProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="about-project-heading">
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 -translate-x-1/3 rounded-full bg-primary/[0.04] blur-[100px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="About"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="About the Project"
              headingId="about-project-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
            <div className="lg:col-span-3" data-reveal>
              <RichText
                html={project.about.overview}
                as="div"
                className="text-base leading-8 text-foreground-muted md:text-lg"
              />

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {project.about.scope && (
                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm ring-1 ring-black/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <AppIcon name="bullseye" size="sm" className="!text-xs" />
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Scope</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{project.about.scope}</p>
                  </div>
                )}
                {project.about.client && (
                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm ring-1 ring-black/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <AppIcon name="building" size="sm" className="!text-xs" />
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Client</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{project.about.client}</p>
                  </div>
                )}
                {project.about.audience && (
                  <div className="rounded-xl border border-border bg-surface p-4 shadow-sm ring-1 ring-black/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <AppIcon name="globe" size="sm" className="!text-xs" />
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Audience</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{project.about.audience}</p>
                  </div>
                )}
              </div>
            </div>

            <aside
              data-reveal
              className="rounded-2xl border border-border bg-surface p-6 shadow-md ring-1 ring-black/[0.03] transition-all duration-300 hover:shadow-lg hover:ring-primary/10 lg:col-span-2"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AppIcon name="chart-line" size="sm" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">Project Snapshot</h3>
              </div>

              <div className="mt-5 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Services</p>
                <div className="mt-2 space-y-1.5">
                  {project.services.map((service, idx) => (
                    <div key={service} className="flex items-center gap-2.5 text-sm text-foreground-muted">
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <AppIcon name={serviceIcons[idx % serviceIcons.length]} size="sm" className="!text-[10px]" />
                      </span>
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Tech Stack</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-foreground-muted ring-1 ring-primary/15 transition-colors hover:bg-primary/10 hover:text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-muted/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Team</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{project.team}</p>
                </div>
                <div className="rounded-lg bg-surface-muted/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Timeline</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{project.timeline}</p>
                </div>
              </div>

              {project.pdfDownloadUrl && (
                <Link
                  href={project.pdfDownloadUrl}
                  aria-label="Download case study PDF"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <AppIcon name="arrow-right" size="sm" className="!text-xs rotate-[-90deg]" />
                  Download Case Study PDF
                </Link>
              )}
            </aside>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
