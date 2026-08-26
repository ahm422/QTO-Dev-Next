import Link from "next/link";
import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { RichText } from "@/components/common/RichText";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";

interface ProjectOverviewChallengeProps {
  project: Project;
}

const serviceIcons: AppIconName[] = [
  "compass",
  "palette",
  "laptop-code",
  "flask-vial",
  "cloud",
];

export function ProjectOverviewChallenge({ project }: ProjectOverviewChallengeProps) {
  const industry =
    project.chips.find((c) => c.label.toLowerCase() === "industry")?.value ??
    project.chips[0]?.value;

  return (
    <section
      className="relative overflow-hidden bg-background py-16 md:py-20 lg:py-24"
      aria-labelledby="overview-challenge-heading"
    >
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Overview"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Project Overview & Challenge"
              description="Context, constraints, and the business problem we set out to solve."
              headingId="overview-challenge-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="space-y-8 lg:col-span-3" data-reveal>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  Objective
                </h3>
                <RichText
                  html={project.about.overview}
                  as="div"
                  className="mt-3 text-base leading-8 text-foreground-muted md:text-lg"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {industry ? (
                  <MetaCard icon="building" label="Client industry" value={industry} />
                ) : null}
                {project.about.audience ? (
                  <MetaCard icon="users" label="Target users" value={project.about.audience} />
                ) : null}
                {project.timeline ? (
                  <MetaCard icon="clock" label="Duration" value={project.timeline} />
                ) : null}
                {project.about.client ? (
                  <MetaCard icon="handshake" label="Client" value={project.about.client} />
                ) : null}
              </div>

              <article className="rounded-2xl border border-error/15 bg-surface p-6 shadow-sm ring-1 ring-error/[0.05] md:p-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-error/10 text-error">
                    <AppIcon name="shield-halved" size="sm" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Business problem</h3>
                </div>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-foreground-muted">
                  {project.problem.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                        <AppIcon name="xmark" size="sm" className="!text-[10px]" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <aside
              data-reveal
              className="rounded-2xl border border-border bg-surface p-6 shadow-md ring-1 ring-black/[0.03] lg:col-span-2"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AppIcon name="layers" size="sm" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">Services provided</h3>
              </div>
              <div className="mt-5 space-y-1.5">
                {project.services.map((service, idx) => (
                  <div
                    key={service}
                    className="flex items-center gap-2.5 text-sm text-foreground-muted"
                  >
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <AppIcon
                        name={serviceIcons[idx % serviceIcons.length]}
                        size="sm"
                        className="!text-[10px]"
                      />
                    </span>
                    {service}
                  </div>
                ))}
              </div>

              {project.pdfDownloadUrl ? (
                <Link
                  href={project.pdfDownloadUrl}
                  aria-label="Download case study PDF"
                  className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Download Case Study PDF
                </Link>
              ) : null}
            </aside>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: AppIconName;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm ring-1 ring-black/[0.02]">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <AppIcon name={icon} size="sm" className="!text-xs" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{value}</p>
    </div>
  );
}
