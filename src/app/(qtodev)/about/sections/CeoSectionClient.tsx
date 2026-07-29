"use client";

import { useRef, useState } from "react";
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

type CeoConfig = Omit<typeof aboutPageConfig.ceo, "stats"> & {
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
  const [imageFailed, setImageFailed] = useState(false);

  useHeroTilt(hitRef, tiltRef, tiltEnabled);

  const firstName = founder.name.split(" ").find(Boolean) ?? founder.name;
  const message = ceo.message || founder.bio || "";
  const bobOk = !reducedMotion;
  const showImage = Boolean(founder.imageUrl) && !imageFailed;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border",
        "bg-gradient-to-b from-surface via-primary/[0.04] to-surface",
        compact ? homepageSectionPadding : "py-20 md:py-28 lg:py-32"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-1/4 left-0 h-[320px] w-[420px] -translate-x-1/3 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[480px] translate-x-1/4 translate-y-1/3 rounded-full bg-orange-400/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            className={cn(
              "grid items-center",
              /* Tighter pairing — fill the container, less dead space between columns */
              "gap-8 sm:gap-10 lg:gap-8 xl:gap-10",
              compact
                ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]"
                : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
            )}
          >
            {/* Photo */}
            <div
              data-reveal
              ref={hitRef}
              className="group/ceo relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
            >
              <div ref={tiltRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
                <div
                  className={cn(
                    "pointer-events-none absolute -inset-5 rounded-[2rem] bg-primary/25 blur-2xl opacity-50 transition-opacity duration-500",
                    "group-hover/ceo:opacity-75"
                  )}
                  aria-hidden
                />

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-[2px] bg-gradient-to-br from-primary via-orange-400 to-primary/80 shadow-xl shadow-primary/20">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-[calc(1rem-1px)] sm:rounded-[calc(1.5rem-2px)] bg-surface",
                      compact ? "aspect-[4/5]" : "aspect-[4/5] lg:aspect-[3/4]"
                    )}
                  >
                    {showImage ? (
                      <Image
                        src={founder.imageUrl!}
                        alt={`${founder.name}, ${founder.designation}`}
                        width={800}
                        height={1000}
                        className="h-full w-full object-cover object-[center_18%] transition-transform duration-700 ease-out group-hover/ceo:scale-[1.03]"
                        sizes="(max-width: 1024px) 90vw, 42vw"
                        quality={85}
                        priority={compact}
                        onError={() => setImageFailed(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-semibold text-primary">
                        {firstName.charAt(0)}
                      </div>
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                </div>

                {/* Name plate — compact/homepage; about page uses floating chips */}
                {compact ? (
                  <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-4 sm:bottom-4">
                    <div className="rounded-xl border border-white/15 bg-[#0d1117]/85 px-3.5 py-2.5 backdrop-blur-md shadow-lg sm:px-4 sm:py-3">
                      <p className="text-sm font-semibold text-white sm:text-base">{founder.name}</p>
                      <p className="text-xs text-white/65 sm:text-sm">{founder.designation}</p>
                    </div>
                  </div>
                ) : null}

                {!compact && (
                  <div className="pointer-events-none absolute inset-0 max-lg:contents lg:block">
                    {ceo.badgeChips.map((chip, i) => {
                      const value = chip.label.toLowerCase().includes("founder")
                        ? founder.name
                        : chip.value;
                      const positions = [
                        "-left-3 -top-3 xl:-left-5 xl:-top-4",
                        "-right-2 bottom-8 xl:-right-4 xl:bottom-12",
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

            {/* Copy */}
            <div className="flex min-w-0 flex-col justify-center space-y-5 sm:space-y-6 lg:space-y-7">
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

              <div data-reveal className="relative space-y-4">
                <div
                  className="absolute -left-1 top-0 hidden h-full w-1 rounded-full bg-gradient-to-b from-primary to-primary/20 sm:block lg:-left-4"
                  aria-hidden
                />
                <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
                  {ceo.storyHeading}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed text-foreground-muted sm:text-base md:text-lg",
                    compact ? "line-clamp-5 sm:line-clamp-6" : "max-w-prose"
                  )}
                >
                  <span className="mr-1 text-2xl leading-none text-primary/40" aria-hidden>
                    &ldquo;
                  </span>
                  {message}
                </p>
              </div>

              {compact ? (
                <div data-reveal className="flex flex-wrap items-center gap-4 pt-1">
                  <Link
                    href="/about"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold sm:px-6 sm:py-3",
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                      "transition-all duration-300",
                      "hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    )}
                  >
                    View About Us
                    <AppIcon name="arrow-right" size="sm" className="shrink-0" />
                  </Link>
                  <p className="text-xs text-foreground-muted sm:text-sm">
                    <span className="font-medium text-foreground">{founder.name}</span>
                    <span className="mx-1.5 text-border">·</span>
                    {founder.designation}
                  </p>
                </div>
              ) : (
                <ul
                  data-reveal
                  className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 pt-2 list-none p-0 m-0"
                  aria-label="Company statistics"
                >
                  {ceo.stats.map((stat) => (
                    <li
                      key={stat.label}
                      className="rounded-xl border border-border/60 bg-card/50 px-3 py-3 text-center sm:px-4 sm:text-left"
                    >
                      <div className="text-2xl font-bold font-heading text-foreground md:text-3xl">
                        <AnimatedCounter
                          value={stat.value}
                          suffix={stat.suffix}
                          label={stat.label}
                        />
                      </div>
                      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-foreground-muted sm:text-xs">
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
