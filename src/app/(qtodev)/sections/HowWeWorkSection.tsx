"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import type { WorkProcessStep } from "@/types/service";

const SECTION_HEADING_ID = "how-we-work-heading";

const howWeWorkSteps: WorkProcessStep[] = [
  {
    order: 1,
    title: "Requirements Gathering",
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
    title: "Deployment",
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
      className={cn(
        "relative overflow-hidden bg-black py-24 md:py-32",
        "border-y border-white/5"
      )}
      aria-labelledby={SECTION_HEADING_ID}
    >
      {/* Subtle gradient and glow for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(244,139,34,0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 100%, rgba(244,139,34,0.04) 0%, transparent 50%)",
        }}
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16 text-white">
            <SectionHeader
              subtitle="HOW WE WORK"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Our Custom Software Development Process"
              titleHighlight="Process"
              headingId={SECTION_HEADING_ID}
              centered
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/80 md:text-lg">
              A clear, six-step delivery framework—from first workshop to long-term support—designed
              to reduce risk and keep you confident at every stage.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {howWeWorkSteps.map((step) => {
              const stepNumber = String(step.order).padStart(2, "0");
              return (
                <div
                  key={step.title}
                  data-reveal
                  className={cn(
                    "group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-8",
                    "shadow-lg shadow-black/25 transition-all duration-300",
                    "hover:border-primary/35 hover:bg-white/[0.09] hover:shadow-xl hover:shadow-primary/10 hover:ring-1 hover:ring-primary/20"
                  )}
                >
                  {/* Step number: large, subtle, top-right */}
                  <span
                    className="absolute right-5 top-5 font-heading text-4xl font-bold tabular-nums text-white/5 md:text-5xl"
                    aria-hidden
                  >
                    {stepNumber}
                  </span>

                  <div className="relative flex flex-1 flex-col">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span className="inline-flex items-center rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        Step {stepNumber}
                      </span>
                      {step.icon && (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                          <AppIcon
                            name={step.icon as AppIconName}
                            size="lg"
                            className="shrink-0"
                          />
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/80 md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
