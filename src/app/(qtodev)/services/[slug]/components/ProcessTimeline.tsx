import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";

interface ProcessTimelineProps {
  service: WebDevelopmentServiceData;
}

const stepIcons = ["compass", "palette", "hammer", "laptop-code", "flask-vial", "rocket"] as const;

export function ProcessTimeline({ service }: ProcessTimelineProps) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-surface via-surface to-primary/[0.03] py-16 md:py-20 lg:py-24"
      aria-labelledby="process-heading"
    >
      {/* Warm gradient orbs */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-96 rounded-full bg-primary/[0.07] blur-3xl -translate-x-1/4 translate-y-1/3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/3 right-0 h-56 w-72 rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2 translate-x-1/4"
        aria-hidden
      />

      <Container size="full" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Process"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Our proven web development process"
              description="Structured, transparent, and built to minimize risk."
              headingId="process-heading"
              centered
            />
          </div>

          <div
            className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-8"
            role="list"
            aria-label="Process steps"
          >
            {service.processSteps.map((step, idx) => {
              const number = String(idx + 1).padStart(2, "0");
              const iconName = stepIcons[idx % stepIcons.length];
              return (
                <article
                  key={step.title}
                  data-reveal
                  role="listitem"
                  className="group relative flex min-h-[280px] flex-col rounded-2xl border border-border/80 bg-surface/95 p-6 sm:p-7 shadow-sm shadow-black/[0.04] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.06] focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-surface"
                >
                  {/* Connector line (desktop) */}
                  {idx < service.processSteps.length - 1 ? (
                    <span
                      className="pointer-events-none absolute -right-3 top-[4.5rem] z-0 hidden h-px w-6 bg-gradient-to-r from-primary/25 to-transparent xl:block"
                      aria-hidden="true"
                    />
                  ) : null}

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary px-2.5 font-mono text-sm font-bold text-white shadow-sm"
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/18"
                        aria-hidden="true"
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
                            aria-hidden="true"
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
        </Reveal>
      </Container>
    </section>
  );
}
