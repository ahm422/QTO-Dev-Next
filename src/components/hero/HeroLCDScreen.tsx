"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black";
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
  const imageStripRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoErrorCount, setVideoErrorCount] = useState(0);
  const reducedMotion = useReducedMotion();
  const hasVideo = heroConfig.lcdVideos.length > 0;
  const hasAvailableVideo =
    hasVideo && videoErrorCount < heroConfig.lcdVideos.length;
  const videoSrc = hasAvailableVideo
    ? heroConfig.lcdVideos[videoIndex % heroConfig.lcdVideos.length]
    : null;
  const lines = heroConfig.lcdTextLines;
  const currentLine = lines[slideIndex];
  const primaryHref = heroConfig.ctaPrimaryHref;
  const secondaryHref = heroConfig.ctaSecondaryHref;
  const heroImages = heroConfig.heroImages ?? [];

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

  useEffect(() => {
    if (reducedMotion || !hasVideo || heroConfig.lcdVideos.length <= 1) return;
    const interval = setInterval(() => {
      setVideoIndex((i) => (i + 1) % heroConfig.lcdVideos.length);
    }, LCD_CYCLE_MS * 2);
    return () => clearInterval(interval);
  }, [reducedMotion, hasVideo]);

  const handleVideoError = useCallback(() => {
    setVideoErrorCount((count) => {
      const nextCount = count + 1;
      if (
        heroConfig.lcdVideos.length > 1 &&
        nextCount <= heroConfig.lcdVideos.length
      ) {
        setVideoIndex((i) => (i + 1) % heroConfig.lcdVideos.length);
      }
      return nextCount;
    });
  }, []);

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
            {/* Video background with gradient overlay for text legibility */}
            {videoSrc && (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                  src={videoSrc}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={handleVideoError}
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

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {primaryHref ? (
                  <Link
                    href={primaryHref}
                    className={cn(ctaBase, ctaPrimaryStyles)}
                  >
                    {heroConfig.ctaPrimary}
                    <AppIcon
                      name="arrow-right"
                      size="sm"
                      className="shrink-0"
                    />
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
