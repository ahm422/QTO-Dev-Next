import { Project } from "@/content/projects/types";
import { DEFAULT_APPROACH_STEPS } from "@/content/projects/types";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";

interface TechnologyAndApproachProps {
  project: Project;
}

const stepIcons: AppIconName[] = [
  "magnifying-glass",
  "compass",
  "palette",
  "hammer",
  "flask-vial",
  "rocket",
];

export function TechnologyAndApproach({ project }: TechnologyAndApproachProps) {
  const categories =
    project.techByCategory?.length
      ? project.techByCategory
      : [
          {
            category: "Technologies",
            items:
              project.technologiesLogos?.length
                ? project.technologiesLogos
                : project.techStack,
          },
        ];

  const steps =
    project.approach?.steps?.length === 6
      ? project.approach.steps
      : [...DEFAULT_APPROACH_STEPS];

  return (
    <section
      className="relative overflow-hidden bg-surface py-16 md:py-20 lg:py-24"
      aria-labelledby="technology-approach-heading"
    >
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-primary/[0.04] blur-[80px]"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Technology"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Technology & Development Approach"
              description="The stack we chose and the delivery workflow that took the product live."
              headingId="technology-approach-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 space-y-6" data-reveal>
            {categories.map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  {group.category}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {group.items.map((tech) => (
                    <span
                      key={`${group.category}-${tech}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground-muted shadow-sm ring-1 ring-black/[0.02]"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <AppIcon name="gear" size="sm" className="!text-[10px]" />
                      </span>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12" data-reveal>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              Development workflow
            </h3>
            <ol
              className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
              aria-label="Development approach steps"
            >
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex flex-col items-center rounded-xl border border-border bg-background p-4 text-center shadow-sm"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                    <AppIcon
                      name={stepIcons[index % stepIcons.length]}
                      size="sm"
                      className="!text-xs"
                    />
                  </span>
                  <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 text-sm font-medium leading-snug text-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {project.approach?.challenges?.length ? (
            <div className="mt-10" data-reveal>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <AppIcon name="shield-halved" size="sm" className="!text-sm" />
                </span>
                Challenges we solved
              </h3>
              <div className="mt-4 space-y-3">
                {project.approach.challenges.map((challenge, index) => (
                  <div
                    key={challenge}
                    className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 shadow-sm"
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
        </Reveal>
      </Container>
    </section>
  );
}
