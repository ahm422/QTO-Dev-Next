"use client";

import { useRef } from "react";
import { motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { TiltCard } from "@/components/animations/TiltCard";
import { cn } from "@/components/theme/cn";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { RichText } from "@/components/common/RichText";
import type { WorkProcessStep } from "@/types/service";

const SECTION_HEADING_ID = "how-we-work-heading";

function ProcessStepCard({
  step,
  motionEnabled,
}: {
  readonly step: WorkProcessStep;
  readonly motionEnabled: boolean;
}) {
  const stepNumber = String(step.order).padStart(2, "0");
  const cardRef = useRef<HTMLDivElement>(null);

  const cardInner = (
    <div
      className={cn(
        "group relative flex h-full min-h-[220px] flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:min-h-[240px] md:p-8",
        "shadow-lg shadow-black/25 transition-[border-color,background-color,box-shadow] duration-300",
        "hover:border-primary/35 hover:bg-white/[0.09] hover:shadow-xl hover:shadow-primary/10 hover:ring-1 hover:ring-primary/20"
      )}
    >
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="process-timeline-node inline-flex items-center rounded-lg bg-primary/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Step {stepNumber}
          </span>
          {step.icon ? (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <AppIcon name={step.icon as AppIconName} size="lg" className="shrink-0" />
            </span>
          ) : null}
        </div>
        <h3 className="font-heading text-lg font-semibold text-white md:text-xl">
          {step.title}
        </h3>
        <RichText
          html={step.description}
          className="mt-3 flex-1 text-sm leading-relaxed text-white/80 md:text-base"
        />
      </div>
    </div>
  );

  const wrapped = motionEnabled ? (
    <motion.div
      ref={cardRef}
      className="h-full"
      initial={{ scale: 1 }}
      whileInView={{ scale: 1.02 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="h-full" maxTilt={6}>
        {cardInner}
      </TiltCard>
    </motion.div>
  ) : (
    <div ref={cardRef} className="h-full">
      {cardInner}
    </div>
  );

  return wrapped;
}

export function HowWeWorkSectionClient({ steps }: { readonly steps: WorkProcessStep[] }) {
  const motionEnabled = useMotionEnabled();
  const framerReduced = useFramerReducedMotion();
  const animate = motionEnabled && !framerReduced;

  if (steps.length === 0) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-black py-24 md:py-32",
        "border-y border-white/5"
      )}
      aria-labelledby={SECTION_HEADING_ID}
    >
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
          <div data-reveal className="mb-14 md:mb-16 text-white [&_h2]:text-white">
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

          {/* Desktop: connected timeline */}
          <div data-reveal className="relative hidden lg:block">
            <div
              className="process-timeline-line pointer-events-none absolute left-[16.67%] right-[16.67%] top-[2.75rem] z-0 h-px"
              aria-hidden
            />
            <ol
              className="relative grid list-none grid-cols-3 gap-8"
              aria-label="Process steps"
            >
              {steps.map((step) => (
                <li key={step.title} className="relative z-10">
                  <ProcessStepCard step={step} motionEnabled={animate} />
                </li>
              ))}
            </ol>
          </div>

          {/* Mobile: horizontal scroll timeline */}
          <section
            data-reveal
            className="process-timeline-scroll process-timeline-fade-edges lg:hidden"
            aria-label="Process steps"
          >
            <ol className="flex list-none gap-4 snap-x snap-mandatory overflow-x-auto pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {steps.map((step) => (
                <li
                  key={step.title}
                  className="w-[min(85vw,320px)] shrink-0 snap-center"
                >
                  <ProcessStepCard step={step} motionEnabled={false} />
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      </Container>
    </section>
  );
}
