"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { SiDocker, SiJavascript, SiReact, SiTypescript } from "@icons-pack/react-simple-icons";
import { Container } from "@/components/common/Container";
import { HeroTerminalMockup } from "@/components/hero/HeroTerminalMockup";
import { HeroHeading } from "@/components/hero/HeroHeading";
import { Button } from "@/components/ui/button";
import { type HeroConfig, resolveHeroConfig } from "@/config/hero";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/components/theme/cn";

export function HeroSection({ config }: Readonly<{ config?: HeroConfig }>) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const {
    badge,
    heading,
    headingHighlight,
    subtext,
    ctaPrimary,
    ctaPrimaryHref,
    trustedByLabel,
    terminalLines,
  } = resolveHeroConfig(config);

  const tiltEnabled = !reducedMotion;

  // Ambient glow only — 3D tilt activates on terminal hover (useHeroTilt).
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reducedMotion || !isDesktop || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      sectionRef.current.style.setProperty("--hero-pointer-x", `${x}%`);
      sectionRef.current.style.setProperty("--hero-pointer-y", `${y}%`);
    },
    [reducedMotion, isDesktop]
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      onPointerMove={handlePointerMove}
      className="hero-warm-bg relative min-h-[100dvh] overflow-hidden text-white [--hero-pointer-x:70%] [--hero-pointer-y:50%]"
    >
      {/* Subtle grid overlay */}
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
        <div className="grid grid-cols-1 items-center gap-14 sm:gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
          {/* Left column: copy */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div
              className={cn(
                "mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-white/[0.06] px-4 py-2 backdrop-blur-sm",
                "transition-colors duration-300 hover:border-primary/60 hover:bg-white/[0.08]",
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
              <span className="text-xs font-semibold text-primary/90 sm:text-sm">
                {badge}
              </span>
            </div>

            <div
              className={cn(
                !reducedMotion &&
                  "animate-hero-content-fade animation-delay-150 animation-fill-backwards"
              )}
            >
              <HeroHeading className="text-center lg:text-left" heading={heading} headingHighlight={headingHighlight} />
            </div>

            {subtext ? (
              <p
                className={cn(
                  "mt-7 max-w-xl text-base leading-relaxed tracking-tight text-[#9CA3AF] sm:mt-8 sm:text-lg sm:leading-relaxed",
                  !reducedMotion &&
                    "animate-hero-content-fade animation-delay-300 animation-fill-backwards"
                )}
              >
                {subtext}
              </p>
            ) : null}

            {/* Primary CTA */}
            <div
              className={cn(
                "mt-10 w-full max-w-sm sm:mt-12 sm:max-w-none",
                "mx-auto lg:mx-0",
                !reducedMotion &&
                  "animate-hero-content-fade animation-delay-450 animation-fill-backwards"
              )}
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  "h-12 w-full rounded-full px-8 text-base font-semibold text-white",
                  "shadow-[0_0_20px_rgba(244,139,34,0.35)] transition-all duration-300",
                  "hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(244,139,34,0.6)]",
                  "active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1208]",
                  "lg:w-auto lg:min-w-[11rem]"
                )}
              >
                <Link href={ctaPrimaryHref}>{ctaPrimary}</Link>
              </Button>
            </div>

            {/* Trusted by */}
            <div
              className={cn(
                "mt-12 w-full sm:mt-14",
                !reducedMotion &&
                  "animate-hero-content-fade animation-delay-600 animation-fill-backwards"
              )}
            >
              <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/45 sm:text-xs">
                {trustedByLabel}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
                {(
                  [
                    { Icon: SiReact, label: "React", hideSmall: false },
                    { Icon: SiTypescript, label: "TypeScript", hideSmall: false },
                    { Icon: SiJavascript, label: "JavaScript", hideSmall: false },
                    { Icon: SiDocker, label: "Docker", hideSmall: true },
                  ] as const
                ).map(({ Icon, label, hideSmall }) => (
                  <Icon
                    key={label}
                    title={label}
                    className={cn(
                      "size-7 text-white opacity-40 transition-opacity duration-300 hover:opacity-70",
                      hideSmall && "max-[380px]:hidden"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column: terminal mockup — allow chip overflow */}
          <div
            className={cn(
              "order-last w-full overflow-visible lg:order-none"
            )}
          >
            <HeroTerminalMockup
              lines={terminalLines}
              tiltEnabled={tiltEnabled}
              className="lg:translate-x-2 xl:translate-x-4"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
