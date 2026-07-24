import Image from "next/image";
import Link from "next/link";
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface RelatedProjectsProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
  /** When true, omit outer section chrome (used inside RelevantWorkAndCTA) */
  embedded?: boolean;
}

export function RelatedProjects({
  service,
  blurDataURL,
  embedded = false,
}: RelatedProjectsProps) {
  const projects = (service.relatedProjects ?? []).slice(0, 2);
  if (projects.length === 0) return null;

  const body = (
    <Reveal staggerSelector="[data-reveal]">
      {!embedded ? (
        <div data-reveal>
          <SectionHeader
            subtitle="Relevant work"
            subtitleClassName="text-primary font-semibold tracking-[0.2em]"
            subtitlePill
            title="Case studies for this service"
            description="Challenge, solution, tech, and results from recent engagements."
            headingId="recent-projects-heading"
            centered={false}
          />
        </div>
      ) : null}

      <div
        className={`${embedded ? "" : "mt-12 "}grid gap-6 lg:grid-cols-2`}
        role="list"
      >
        {projects.map((project) => {
          const resultText = project.result || project.outcome || "";
          return (
            <article
              key={project.slug}
              data-reveal
              role="listitem"
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-md shadow-black/5 ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={project.thumbnail}
                  alt={`${project.name} preview`}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-border p-5 md:p-6">
                <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      Challenge
                    </dt>
                    <dd className="mt-1 leading-relaxed text-foreground-muted">
                      {project.challenge}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                      Solution
                    </dt>
                    <dd className="mt-1 leading-relaxed text-foreground-muted">
                      {project.solution}
                    </dd>
                  </div>
                  {project.tech?.length ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                        Tech
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-foreground-muted ring-1 ring-primary/15"
                          >
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                  {resultText ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                        Result
                      </dt>
                      <dd className="mt-1 font-medium leading-relaxed text-foreground">
                        {resultText}
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  View Case Study
                  <AppIcon name="arrow-right" size="sm" className="!text-xs" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {!embedded ? (
        <div className="mt-10 text-center" data-reveal>
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            See all projects
          </Link>
        </div>
      ) : (
        <div className="mt-6" data-reveal>
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            See all projects
            <AppIcon name="arrow-right" size="sm" className="!text-xs" />
          </Link>
        </div>
      )}
    </Reveal>
  );

  if (embedded) {
    return <div aria-labelledby="relevant-work-heading">{body}</div>;
  }

  return (
    <section
      className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24"
      aria-labelledby="recent-projects-heading"
    >
      <Container size="xl" className="relative">
        {body}
      </Container>
    </section>
  );
}
