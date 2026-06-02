"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { HeroDashboardMockup } from "@/components/hero/HeroDashboardMockup";
import { HeroHeading } from "@/components/hero/HeroHeading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Button } from "@/components/ui/button";
import { heroConfig } from "@/config/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/components/theme/cn";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const {
    badge,
    subtext,
    ctaPrimary,
    ctaPrimaryHref,
    ctaSecondary,
    ctaSecondaryHref,
    trustedByLabel,
    trustedByLogos,
  } = heroConfig;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      sectionRef.current.style.setProperty("--hero-pointer-x", `${x}%`);
      sectionRef.current.style.setProperty("--hero-pointer-y", `${y}%`);
    },
    [reducedMotion]
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      onPointerMove={handlePointerMove}
      className="relative min-h-[100dvh] overflow-hidden bg-black text-white [--hero-pointer-x:70%] [--hero-pointer-y:50%]"
    >
      {/* Vignette + grid */}
      <div className="hero-grid-bg pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,rgba(0,0,0,0.65)_100%)]"
        aria-hidden
      />

      {/* Interactive radial glow — follows pointer on desktop */}
      <div
        className="hero-glow-interactive pointer-events-none absolute inset-0 z-0 hero-glow-mobile lg:hero-glow-desktop"
        aria-hidden
      />

      <Container className="relative z-10 flex min-h-[100dvh] flex-col justify-center py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-14 sm:gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          {/* Left column: copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div
              className={cn(
                "mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-sm",
                "transition-colors duration-300 hover:border-primary/30 hover:bg-white/[0.08]",
                !reducedMotion && "animate-hero-content-fade animation-fill-backwards"
              )}
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(244,139,34,0.8)]",
                  !reducedMotion && "hero-badge-dot-pulse"
                )}
                aria-hidden
              />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-sm">
                {badge}
              </span>
            </div>

            <div
              className={cn(
                !reducedMotion &&
                  "animate-hero-content-fade animation-delay-150 animation-fill-backwards"
              )}
            >
              <HeroHeading className="text-center lg:text-left" />
            </div>

            {subtext ? (
              <p
                className={cn(
                  "mt-7 max-w-xl text-base leading-relaxed text-[#9CA3AF] sm:mt-8 sm:text-lg sm:leading-relaxed",
                  !reducedMotion &&
                    "animate-hero-content-fade animation-delay-150 animation-fill-backwards"
                )}
              >
                {subtext}
              </p>
            ) : null}

            {/* CTAs */}
            <div
              className={cn(
                "mt-10 flex w-full max-w-sm flex-col gap-3 sm:mt-12 sm:max-w-md sm:gap-4",
                "mx-auto lg:mx-0 lg:max-w-none lg:flex-row lg:items-center",
                !reducedMotion &&
                  "animate-hero-content-fade animation-delay-300 animation-fill-backwards"
              )}
            >
              {ctaPrimaryHref ? (
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "h-12 w-full rounded-lg text-base font-semibold text-white shadow-lg shadow-primary/25",
                    "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/35 active:scale-[0.98]",
                    "lg:w-auto lg:min-w-[11rem]"
                  )}
                >
                  <Link href={ctaPrimaryHref}>{ctaPrimary}</Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="h-12 w-full rounded-lg text-base font-semibold text-white lg:w-auto"
                >
                  {ctaPrimary}
                </Button>
              )}
              {ctaSecondaryHref ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(
                    "group/cta h-12 w-full rounded-lg border-white/25 bg-white/[0.03] text-base text-white backdrop-blur-sm",
                    "transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white",
                    "lg:w-auto lg:min-w-[12rem]"
                  )}
                >
                  <Link href={ctaSecondaryHref}>
                    {ctaSecondary}
                    <AppIcon
                      name="arrow-right"
                      size="sm"
                      className="shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1"
                    />
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full border-white/25 text-white lg:w-auto"
                >
                  {ctaSecondary}
                  <AppIcon name="arrow-right" size="sm" className="shrink-0" />
                </Button>
              )}
            </div>

            {/* Trusted by */}
            <div
              className={cn(
                "mt-12 w-full sm:mt-14",
                !reducedMotion &&
                  "animate-hero-content-fade animation-delay-300 animation-fill-backwards"
              )}
            >
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/45 sm:text-xs">
                {trustedByLabel}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10 lg:justify-start">
                {trustedByLogos.map((logo, index) => (
                  <span
                    key={logo}
                    className={cn(
                      "text-sm font-bold uppercase tracking-wider text-white/35 transition-colors duration-300 hover:text-white/60 sm:text-base",
                      index === 3 && "max-[380px]:hidden"
                    )}
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: dashboard mockup */}
          <div
            className={cn(
              "order-last w-full lg:order-none",
              !reducedMotion &&
                "animate-hero-content-fade animation-delay-300 animation-fill-backwards"
            )}
          >
            <HeroDashboardMockup className="lg:translate-x-2 xl:translate-x-4" />
          </div>
        </div>
      </Container>
    </section>
  );
}
