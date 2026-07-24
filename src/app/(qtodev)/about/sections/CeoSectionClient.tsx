"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { useHeroTilt } from "@/hooks/useHeroTilt";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/components/theme/cn";
import { homepageSectionPadding } from "@/components/theme/sectionClasses";
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
  compact = false,
}: {
  founder: LeadershipMember;
  ceo: CeoConfig;
  compact?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const hitRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tiltEnabled = !reducedMotion && !compact;

  useHeroTilt(hitRef, tiltRef, tiltEnabled);

  const firstName = founder.name.split(" ").find(Boolean) ?? founder.name;
  const message = ceo.message || founder.bio || "";
  const bobOk = !reducedMotion;

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-surface via-primary/5 to-surface border-y border-border",
        compact ? homepageSectionPadding : "py-20 md:py-28 lg:py-32"
      )}
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
          <div
            className={cn(
              "grid items-center gap-12 lg:grid-cols-2",
              compact ? "lg:gap-10" : "lg:gap-16"
            )}
          >
            {/* Photo card — left */}
            <div
              data-reveal
              ref={hitRef}
              className={cn(
                "group/ceo relative mx-auto w-full",
                compact ? "max-w-xs lg:max-w-none" : "max-w-md lg:max-w-none"
              )}
            >
              <div ref={tiltRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
                <div
                  className={cn(
                    "pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/30 blur-2xl opacity-60 transition-opacity duration-500",
                    !compact && "group-hover/ceo:opacity-85"
                  )}
                />

                <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-primary via-orange-400 to-primary shadow-2xl shadow-primary/30">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-[calc(1.5rem-2px)] bg-surface",
                      compact ? "aspect-[3/4]" : "aspect-[4/5]"
                    )}
                  >
                    {founder.imageUrl ? (
                      <Image
                        src={founder.imageUrl}
                        alt={`${founder.name}, ${founder.designation}`}
                        width={800}
                        height={1000}
                        className="h-full w-full object-cover object-[center_15%]"
                        sizes={compact ? "(max-width: 1024px) 80vw, 320px" : "(max-width: 1024px) 90vw, 480px"}
                        quality={85}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-semibold text-primary">
                        {firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {!compact && (
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
                )}
              </div>
            </div>

            {/* Copy — right */}
            <div className={compact ? "space-y-6" : "space-y-8"}>
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
                <h3 className="text-xl font-semibold font-heading text-foreground md:text-2xl">
                  {ceo.storyHeading}
                </h3>
                <p
                  className={cn(
                    "text-base text-foreground-muted leading-relaxed md:text-lg",
                    compact && "line-clamp-4"
                  )}
                >
                  {message}
                </p>
              </div>

              {compact ? (
                <div data-reveal>
                  <Link
                    href="/about"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold",
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                      "transition-all duration-300",
                      "hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    )}
                  >
                    View About Us
                    <AppIcon name="arrow-right" size="sm" className="shrink-0" />
                  </Link>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
