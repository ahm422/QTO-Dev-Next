import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface ProcessTimelineProps {
  service: WebDevelopmentServiceData;
}

const stepIcons = ["compass", "palette", "hammer", "laptop-code", "flask-vial", "rocket"] as const;

export function ProcessTimeline({ service }: ProcessTimelineProps) {
  return (
    <section className="bg-surface py-14 md:py-20" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="process-heading" className="text-2xl font-bold text-foreground md:text-3xl">
          Our Proven Web Development Process
        </h2>
        <p className="mt-3 text-sm text-foreground-muted">Structured, transparent, and built to minimize risk.</p>

        <div className="mt-8 overflow-x-auto pb-2">
          <div className="grid min-w-[960px] grid-cols-6 gap-4 md:min-w-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {service.processSteps.map((step, idx) => {
              const number = String(idx + 1).padStart(2, "0");
              return (
                <article key={step.title} className="relative rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  {idx < service.processSteps.length - 1 ? (
                    <span className="pointer-events-none absolute -right-2 top-1/2 hidden h-0.5 w-4 -translate-y-1/2 bg-border xl:block" aria-hidden="true" />
                  ) : null}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">Step {number}</span>
                    <AppIcon name={stepIcons[idx % stepIcons.length]} size="base" />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-foreground">{step.title}</h3>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-6 text-foreground-muted">
                    {step.deliverables.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
