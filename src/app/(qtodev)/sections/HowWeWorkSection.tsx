import { Container } from "@/components/common/Container";
import { Card } from "@/components/ui/shared/Card";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import type { WorkProcessStep } from "@/types/service";

const SECTION_HEADING_ID = "how-we-work-heading";

const howWeWorkSteps: WorkProcessStep[] = [
  {
    order: 1,
    title: "Discovery",
    description:
      "We dig into your goals, users, and constraints to define a clear problem statement and success metrics.",
    icon: "magnifying-glass",
  },
  {
    order: 2,
    title: "Design",
    description:
      "We translate strategy into UX flows, interface designs, and technical approach that align with your brand.",
    icon: "palette",
  },
  {
    order: 3,
    title: "Development",
    description:
      "Our engineers build in small, reviewable increments with clean, testable code and transparent progress.",
    icon: "laptop-code",
  },
  {
    order: 4,
    title: "QA & Testing",
    description:
      "We validate functionality, performance, and accessibility across devices before anything goes near production.",
    icon: "flask-vial",
  },
  {
    order: 5,
    title: "Launch",
    description:
      "We coordinate releases, monitoring, and rollback plans so going live feels controlled—not chaotic.",
    icon: "rocket",
  },
  {
    order: 6,
    title: "Support",
    description:
      "Post-launch, we stay close with fixes, enhancements, and roadmap guidance as your product grows.",
    icon: "gear",
  },
];

export function HowWeWorkSection() {
  return (
    <section
      className="bg-[#0b1120] py-16 md:py-20"
      aria-labelledby={SECTION_HEADING_ID}
    >
      <Container>
        <div className="text-center">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-cta-gold">
            How We Work
          </span>
          <h2
            id={SECTION_HEADING_ID}
            className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl"
          >
            Our Custom Software Development Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            A clear, six-step delivery framework—from first workshop to long-term support—designed
            to reduce risk and keep you confident at every stage.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-12 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {howWeWorkSteps.map((step) => {
            const stepNumber = String(step.order).padStart(2, "0");
            return (
              <Card
                key={step.title}
                className="flex h-full flex-col justify-between border-border/40 bg-surface/5 p-6 text-left"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center justify-center rounded-lg bg-cta-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cta-gold">
                      Step {stepNumber}
                    </span>
                    {step.icon && (
                      <AppIcon
                        name={step.icon as AppIconName}
                        size="base"
                        className="text-cta-gold"
                      />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white md:text-lg">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

