"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { heroConfig } from "@/config/hero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/theme/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LCD_CYCLE_MS = 4000;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function HeroHeading() {
  const { heading, headingHighlight } = heroConfig;
  const headingClasses =
    "font-heading font-bold leading-tight text-white tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl";
  if (!headingHighlight || !heading.includes(headingHighlight)) {
    return <h1 className={headingClasses}>{heading}</h1>;
  }
  const parts = heading.split(headingHighlight);
  return (
    <h1 className={headingClasses}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="text-primary">{headingHighlight}</span>
          )}
        </span>
      ))}
    </h1>
  );
}

export interface HeroLCDScreenProps {
  scrollTriggerRef?: React.RefObject<HTMLElement | null>;
  triggerRef?: React.RefObject<HTMLElement | null>;
  triggerReady?: boolean;
}

export function HeroLCDScreen({
  scrollTriggerRef,
  triggerRef,
  triggerReady,
}: HeroLCDScreenProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageStripRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const heroImages = heroConfig.heroImages ?? [];
  const hasLcdImage = heroImages.length > 0;
  const lcdImageSrc = hasLcdImage
    ? heroImages[imageIndex % heroImages.length]
    : null;
  const lines = heroConfig.lcdTextLines;
  const currentLine = lines[slideIndex];
  const primaryHref = heroConfig.ctaPrimaryHref;
  const secondaryHref = heroConfig.ctaSecondaryHref;

  useEffect(() => {
    if (reducedMotion || !hasLcdImage || heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setImageIndex((i) => (i + 1) % heroImages.length);
    }, LCD_CYCLE_MS * 2);
    return () => clearInterval(interval);
  }, [reducedMotion, hasLcdImage, heroImages.length]);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const section = scrollTriggerRef?.current;
      const triggerEl = triggerRef?.current ?? section;
      const ready =
        wrapper?.isConnected && triggerEl?.isConnected && section?.isConnected;

      if (!wrapper || !triggerEl || !section || !ready) {
        gsap.set(wrapper, { opacity: 1, y: 0 });
        return;
      }

      if (reducedMotion) {
        gsap.set(wrapper, { opacity: 1, y: 0 });
        return;
      }

      try {
        const tween = gsap.fromTo(
          wrapper,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            force3D: true,
            scrollTrigger: {
              trigger: triggerEl,
              start: "top top",
              end: "+=400",
              scrub: 0.4,
              pin: section,
              pinSpacing: true,
            },
          }
        );

        const spacer = (tween.scrollTrigger as unknown as { spacer?: HTMLElement })?.spacer;
        if (spacer) {
          spacer.style.background = "var(--hero-bg, #1a1a1a)";
        }
      } catch {
        gsap.set(wrapper, { opacity: 1, y: 0 });
      }
    },
    {
      dependencies: [reducedMotion, scrollTriggerRef, triggerRef, triggerReady],
    }
  );

  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroConfig.lcdTextLines.length);
    }, LCD_CYCLE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-6xl mx-auto"
      style={{ opacity: 0, willChange: "transform, opacity" }}
    >
      <div className="w-full">
        {/* LCD frame — no backdrop-blur, no ring, GPU-friendly */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/95 shadow-2xl shadow-black/50">
          <div
            ref={contentRef}
            className="relative flex min-h-[380px] flex-col justify-center overflow-hidden px-6 py-12 md:min-h-[480px] md:px-14 md:py-20"
          >
            {/* Image background with gradient overlay for text legibility */}
            {lcdImageSrc && (
              <>
                <img
                  src={lcdImageSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"
                  aria-hidden
                />
              </>
            )}

            <div className="relative z-10 flex flex-col items-center text-center">
              <HeroHeading />
              {heroConfig.subtext && (
                <p
                  className={cn(
                    "mt-4 max-w-2xl text-base text-white/85 md:text-lg",
                    !reducedMotion && "animate-hero-content-fade animation-delay-150 animation-fill-backwards"
                  )}
                >
                  {heroConfig.subtext}
                </p>
              )}
              <div
                className={cn(
                  "mt-8 flex flex-wrap items-center justify-center gap-4",
                  !reducedMotion && "animate-hero-content-fade animation-delay-300 animation-fill-backwards"
                )}
              >
                {primaryHref ? (
                  <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href={primaryHref}>
                      {heroConfig.ctaPrimary}
                      <AppIcon
                        name="arrow-right"
                        size="sm"
                        className="shrink-0"
                      />
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="shadow-lg shadow-primary/20">
                    {heroConfig.ctaPrimary}
                  </Button>
                )}
                {secondaryHref ? (
                  <Button asChild variant="outline" size="lg" className="border-white/80 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <Link href={secondaryHref}>
                      {heroConfig.ctaSecondary}
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" className="border-white/80 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    {heroConfig.ctaSecondary}
                  </Button>
                )}
              </div>
            </div>

            {lines.length > 0 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center md:bottom-6">
                <p
                  key={slideIndex}
                  className="text-center font-heading text-xs font-medium uppercase tracking-widest text-white/50 md:text-sm"
                  style={
                    reducedMotion
                      ? undefined
                      : { animation: "lcd-text-fade 0.6s ease-out" }
                  }
                >
                  {currentLine}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* LCD chin */}
        <div className="mx-auto mt-3 h-2 w-20 rounded-b-full bg-white/10 md:mt-4 md:h-2.5 md:w-28" />
      </div>

      {/* Image strip — CSS-only transform, no separate ScrollTrigger */}
      {heroImages.length > 0 && (
        <div
          ref={imageStripRef}
          className="pointer-events-none mt-6 hidden justify-center gap-3 px-4 md:flex"
          aria-hidden
        >
          {heroImages.slice(0, 4).map((src) => (
            <div
              key={src}
              className="relative h-20 w-32 overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-lg shadow-black/40"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
