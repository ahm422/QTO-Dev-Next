"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { heroConfig } from "@/config/hero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
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

/** Build heading with optional highlighted word */
function HeroHeading() {
  const { heading, headingHighlight } = heroConfig;
  if (!headingHighlight || !heading.includes(headingHighlight)) {
    return (
      <h1 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
        {heading}
      </h1>
    );
  }
  const parts = heading.split(headingHighlight);
  return (
    <h1 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
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

const ctaBase =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const ctaPrimaryStyles =
  "px-6 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30";
const ctaSecondaryStyles =
  "px-6 py-3 text-lg border-2 border-white/80 text-white hover:bg-white/10";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const hasVideo = heroConfig.lcdVideos.length > 0;
  const videoSrc = hasVideo ? heroConfig.lcdVideos[0] : null;
  const lines = heroConfig.lcdTextLines;
  const currentLine = lines[slideIndex];
  const primaryHref = heroConfig.ctaPrimaryHref;
  const secondaryHref = heroConfig.ctaSecondaryHref;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video || !hasVideo) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(wrapper);
    return () => obs.disconnect();
  }, [hasVideo]);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const section = scrollTriggerRef?.current;
      const triggerEl = triggerRef?.current ?? section;
      // All targets must be valid DOM elements in the document (avoids ScrollTrigger "reading 'end'" error)
      const ready =
        wrapper?.isConnected &&
        triggerEl?.isConnected &&
        section?.isConnected;
      if (!wrapper || !triggerEl || !section || !ready) {
        gsap.set(wrapper, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (reducedMotion) {
        gsap.set(wrapper, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      try {
        gsap.fromTo(
          wrapper,
          { opacity: 0, y: 80, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: triggerEl,
              start: "top top",
              end: "+=600",
              scrub: 0.8,
              pin: section,
              pinSpacing: true,
            },
          }
        );
      } catch {
        // Fallback if ScrollTrigger fails (e.g. refs not ready or invalid)
        gsap.to(wrapper, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [reducedMotion, scrollTriggerRef, triggerRef, triggerReady] }
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
      className="relative w-full max-w-4xl mx-auto max-h-[calc(100vh-12rem)]"
    >
      <div className="w-full max-w-4xl">
        {/* Refined frame: softer border, professional shadow */}
        <div className="overflow-hidden rounded-xl border-2 border-white/10 bg-black/95 shadow-2xl shadow-black/60 ring-1 ring-white/5 backdrop-blur-sm">
          <div
            ref={contentRef}
            className="relative flex min-h-[340px] flex-col justify-center overflow-hidden px-6 py-10 md:min-h-[400px] md:px-12 md:py-16"
          >
            {videoSrc && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover opacity-25"
                src={videoSrc}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
            )}

            <div className="relative z-10 flex flex-col items-center text-center">
              <HeroHeading />
              <p className="mt-4 mb-8 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg lg:text-xl">
                {heroConfig.subtext}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {primaryHref ? (
                  <Link
                    href={primaryHref}
                    className={cn(ctaBase, ctaPrimaryStyles)}
                  >
                    {heroConfig.ctaPrimary}
                    <AppIcon name="arrow-right" size="sm" className="shrink-0" />
                  </Link>
                ) : (
                  <span className={cn(ctaBase, ctaPrimaryStyles)}>
                    {heroConfig.ctaPrimary}
                  </span>
                )}
                {secondaryHref ? (
                  <Link
                    href={secondaryHref}
                    className={cn(ctaBase, ctaSecondaryStyles)}
                  >
                    {heroConfig.ctaSecondary}
                  </Link>
                ) : (
                  <span className={cn(ctaBase, ctaSecondaryStyles)}>
                    {heroConfig.ctaSecondary}
                  </span>
                )}
              </div>
            </div>

            {lines.length > 0 && (
              <div className="relative z-10 mt-8 flex flex-col items-center">
                <div className="h-px w-16 bg-white/30 mb-4" aria-hidden />
                <p
                  key={slideIndex}
                  className="text-center font-heading text-sm font-semibold uppercase tracking-widest text-white/60 md:text-base"
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
        <div className="mx-auto mt-3 h-2 w-20 rounded-b-full bg-white/10 md:mt-4 md:h-2.5 md:w-28" />
      </div>
    </div>
  );
}
