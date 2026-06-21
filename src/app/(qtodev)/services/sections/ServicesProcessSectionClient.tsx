"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { servicesPageConfig } from "@/config/servicesPage";
type ServicesPageConfigType = typeof servicesPageConfig;
import type { WorkProcessStep } from "@/types/service";

const SECTION_HEADING_ID = "services-process-heading";

export function ServicesProcessSectionClient({ steps, config }: { steps: WorkProcessStep[]; config?: ServicesPageConfigType }) {
  if (steps.length === 0) return null;
  const cfg = config ?? servicesPageConfig;
  const { process: processConfig } = cfg;

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-black py-20 md:py-28",
        "border-y border-white/5"
      )}
      aria-labelledby={SECTION_HEADING_ID}
    >
      {/* Richer gradient and glow for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244,139,34,0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 20% 100%, rgba(244,139,34,0.05) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 80% 50%, rgba(244,139,34,0.03) 0%, transparent 50%)",
        }}
      />
      {/* Soft orb blurs */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[400px] rounded-full bg-primary/10 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-0 w-[400px] h-[350px] rounded-full bg-primary/[0.08] blur-[80px]"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16 text-white">
            <SectionHeader
              subtitle={processConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title={processConfig.title}
              titleHighlight={processConfig.titleHighlight}
              headingId={SECTION_HEADING_ID}
              centered
            />
            <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/80 md:text-lg">
              {processConfig.description}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => {
              const stepNumber = String(step.order).padStart(2, "0");
              return (
                <div
                  key={step.title}
                  data-reveal
                  className={cn(
                    "group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 md:p-8",
                    "transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08]",
                    "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-0.5",
                    "border-l-4 border-l-transparent hover:border-l-primary"
                  )}
                >
                  {/* Step number: large, subtle */}
                  <span
                    className="absolute right-5 top-5 font-heading text-4xl font-bold tabular-nums text-white/5 md:text-5xl"
                    aria-hidden
                  >
                    {stepNumber}
                  </span>

                  <div className="relative flex flex-1 flex-col">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <span className="inline-flex items-center rounded-lg bg-primary/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        Step {stepNumber}
                      </span>
                      {step.icon && (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-all duration-300 group-hover:bg-primary/25 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                          <AppIcon
                            name={step.icon as AppIconName}
                            size="lg"
                            className="shrink-0"
                          />
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white md:text-xl tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75 md:text-base">
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
