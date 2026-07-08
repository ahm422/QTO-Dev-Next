"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { useHeroTilt } from "@/hooks/useHeroTilt";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/components/theme/cn";
import type { LeadershipMember } from "@/types/leadership";
import { aboutPageConfig } from "@/config/aboutPage";

type CeoConfig = typeof aboutPageConfig.ceo & {
  stats: readonly { label: string; value: number; suffix?: string }[];
};

const HEADING_ID = "about-ceo-heading";

function ChipShell({
  className,
  bobClass,
  children,
}: {
  className: string;
  bobClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("absolute z-20", className)}>
      <div className={bobClass}>{children}</div>
    </div>
  );
}

export function CeoSectionClient({
  founder,
  ceo,
}: {
  founder: LeadershipMember;
  ceo: CeoConfig;
}) {
  const reducedMotion = useReducedMotion();
  const hitRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tiltEnabled = !reducedMotion;

  useHeroTilt(hitRef, tiltRef, tiltEnabled);

  const firstName = founder.name.split(" ").find(Boolean) ?? founder.name;
  const message = ceo.message || founder.bio || "";
  const bobOk = !reducedMotion;

  return (
    <section
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden bg-gradient-to-b from-surface via-primary/5 to-surface border-y border-border"
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-1/4 left-0 w-[480px] h-[320px] rounded-full bg-orange-400/10 blur-3xl -translate-x-1/3"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[520px] h-[360px] rounded-full bg-primary/10 blur-3xl translate-x-1/4 translate-y-1/3"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Photo card — left */}
            <div data-reveal ref={hitRef} className="group/ceo relative mx-auto w-full max-w-md lg:max-w-none">
              <div ref={tiltRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
                <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/30 blur-2xl opacity-60 transition-opacity duration-500 group-hover/ceo:opacity-85" />

                <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-primary via-orange-400 to-primary shadow-2xl shadow-primary/30">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(1.5rem-2px)] bg-surface">
                    {founder.imageUrl ? (
                      <Image
                        src={founder.imageUrl}
                        alt={`${founder.name}, ${founder.designation}`}
                        width={800}
                        height={1000}
                        className="h-full w-full object-cover object-[center_15%]"
                        sizes="(max-width: 1024px) 90vw, 480px"
                        quality={85}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-semibold text-primary">
                        {firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 max-lg:contents lg:block">
                  {ceo.badgeChips.map((chip, i) => {
                    const value = chip.label.toLowerCase().includes("founder")
                      ? founder.name
                      : chip.value;
                    const positions = [
                      "-left-2 -top-3 lg:-left-5 lg:-top-4",
                      "-right-1 bottom-8 lg:-right-4 lg:bottom-12",
                    ];
                    return (
                      <ChipShell
                        key={chip.label}
                        className={positions[i] ?? "-bottom-2 left-4"}
                        bobClass={bobOk ? `hero-chip-bob hero-chip-bob-delay-${i}` : undefined}
                      >
                        <span className="inline-flex flex-col rounded-xl border border-white/20 bg-[#0d1117]/90 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-white/50">
                            {chip.label}
                          </span>
                          <span
                            className={cn(
                              "font-semibold text-white/95",
                              chip.label.toLowerCase().includes("founder")
                                ? "max-w-[11rem] text-xs leading-snug"
                                : "text-sm"
                            )}
                          >
                            {value}
                          </span>
                        </span>
                      </ChipShell>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Copy — right */}
            <div className="space-y-8">
              <div data-reveal>
                <SectionHeader
                  subtitle={ceo.subtitle}
                  subtitleClassName="text-primary font-semibold tracking-widest"
                  subtitlePill
                  title={ceo.title}
                  titleHighlight={ceo.titleHighlight}
                  headingId={HEADING_ID}
                />
              </div>

              <div data-reveal className="space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold font-heading text-foreground">
                  {ceo.storyHeading}
                </h3>
                <p className="text-base md:text-lg text-foreground-muted leading-relaxed">
                  {message}
                </p>
              </div>

              <ul
                data-reveal
                className="grid grid-cols-2 gap-6 sm:grid-cols-4 pt-2 list-none p-0 m-0"
                aria-label="Company statistics"
              >
                {ceo.stats.map((stat) => (
                  <li key={stat.label} className="text-center sm:text-left">
                    <div className="text-2xl md:text-3xl font-bold font-heading text-foreground">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                        label={stat.label}
                      />
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                      {stat.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
