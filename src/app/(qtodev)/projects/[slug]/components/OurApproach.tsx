import { Project } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";

interface OurApproachProps {
  project: Project;
}

const stepIcons: AppIconName[] = ["magnifying-glass", "palette", "hammer", "rocket"];

export function OurApproach({ project }: OurApproachProps) {
  if (!project.approach) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24" aria-labelledby="our-approach-heading">
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-72 w-72 -translate-y-1/2 -translate-x-1/3 rounded-full bg-primary/[0.05] blur-[80px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Approach"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title={project.approach.title || "Our Approach"}
              description="A structured, collaborative process designed for predictable delivery."
              headingId="our-approach-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div data-reveal>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <AppIcon name="compass" size="sm" className="!text-sm" />
                </span>
                Delivery Steps
              </h3>
              <div className="relative mt-6 space-y-0">
                <div
                  className="absolute left-[18px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
                  aria-hidden
                />
                {project.approach.steps.map((step, index) => (
                  <div key={step} className="relative flex items-start gap-5 py-3">
                    <span className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                      <AppIcon name={stepIcons[index % stepIcons.length]} size="sm" className="!text-xs" />
                    </span>
                    <div className="flex-1 rounded-xl border border-border bg-background p-4 shadow-sm ring-1 ring-black/[0.02] transition-all duration-200 hover:shadow-md hover:ring-primary/10">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step {index + 1}</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {project.approach.challenges?.length ? (
              <div data-reveal>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                    <AppIcon name="shield-halved" size="sm" className="!text-sm" />
                  </span>
                  Challenges &amp; How We Solved Them
                </h3>
                <div className="mt-6 space-y-3">
                  {project.approach.challenges.map((challenge, index) => (
                    <div
                      key={challenge}
                      className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 shadow-sm ring-1 ring-black/[0.02] transition-all duration-200 hover:shadow-md"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-xs font-bold text-warning">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground-muted">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
