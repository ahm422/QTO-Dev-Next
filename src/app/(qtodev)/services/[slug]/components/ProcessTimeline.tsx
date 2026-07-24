import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface ProcessTimelineProps {
  service: WebDevelopmentServiceData;
}

const stepIcons: AppIconName[] = [
  "compass",
  "palette",
  "server",
  "flask-vial",
  "rocket",
];

export function ProcessTimeline({ service }: ProcessTimelineProps) {
  const steps = service.processSteps ?? [];
  const chips = service.approachSupportChips ?? [];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-surface via-surface to-primary/[0.03] py-16 md:py-20 lg:py-24"
      aria-labelledby="approach-heading"
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-96 -translate-x-1/4 translate-y-1/3 rounded-full bg-primary/[0.07] blur-3xl"
        aria-hidden
      />

      <Container size="full" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Approach"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Our Service-Specific Approach"
              description="A focused five-step path for this engagement—not a repeat of the main Services process."
              headingId="approach-heading"
              centered
            />
          </div>

          <div
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6"
            role="list"
            aria-label="Approach steps"
          >
            {steps.map((step, idx) => {
              const number = String(idx + 1).padStart(2, "0");
              const iconName = stepIcons[idx % stepIcons.length];
              return (
                <article
                  key={step.title}
                  data-reveal
                  role="listitem"
                  className="group relative flex min-h-[260px] flex-col rounded-2xl border border-border/80 bg-surface/95 p-6 shadow-sm shadow-black/[0.04] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.06]"
                >
                  {idx < steps.length - 1 ? (
                    <span
                      className="pointer-events-none absolute -right-3 top-[4.5rem] z-0 hidden h-px w-6 bg-gradient-to-r from-primary/25 to-transparent xl:block"
                      aria-hidden
                    />
                  ) : null}

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary px-2.5 font-mono text-sm font-bold text-white shadow-sm"
                        aria-hidden
                      >
                        {number}
                      </span>
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/15"
                        aria-hidden
                      >
                        <AppIcon name={iconName} size="sm" />
                      </span>
                    </div>

                    <h3 className="mt-5 text-base font-semibold leading-snug text-foreground">
                      {step.title}
                    </h3>

                    <ul
                      className="mt-4 flex-1 space-y-2.5 text-[13px] leading-relaxed text-foreground-muted"
                      aria-label={`Deliverables for ${step.title}`}
                    >
                      {step.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50"
                            aria-hidden
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>

          {chips.length > 0 ? (
            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
              data-reveal
              aria-label="Approach support areas"
            >
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex min-h-[36px] items-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground-muted shadow-sm ring-1 ring-black/[0.02]"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
