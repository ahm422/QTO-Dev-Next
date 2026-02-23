"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/shared/Button";
import { heroConfig } from "@/config/hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LCD_CYCLE_MS = 3500;

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

export interface HeroLCDScreenProps {
  /** Ref to the hero section; used as pin target so the page doesn't move during reveal */
  scrollTriggerRef?: React.RefObject<HTMLElement | null>;
  /** Optional ref for ScrollTrigger start (e.g. sentinel at doc top) so pin starts at scroll 0 */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** When true, sentinel is mounted so triggerRef.current is set (for dependency) */
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

  // Lazy-play video when LCD is in view
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

  // Scroll-triggered reveal: pin the hero so the page doesn't move; LCD reveals over "SITES THAT MOVE".
  // Use sentinel as trigger when provided so pin starts at scroll 0 (headline stays visible).
  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const section = scrollTriggerRef?.current;
      const triggerEl = triggerRef?.current ?? section;
      if (!wrapper || !section) return;

      if (reducedMotion) {
        gsap.set(wrapper, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Pin the hero section (not the LCD): page stays still from scroll 0, LCD reveals, then unpin.
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
    },
    { dependencies: [reducedMotion, scrollTriggerRef, triggerRef, triggerReady] }
  );

  // Cycle through text lines (and optional video) inside the screen
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroConfig.lcdTextLines.length);
    }, LCD_CYCLE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-4xl mx-auto max-h-[calc(100vh-10rem)]">
      {/* Monitor frame: thin bezel, optional stand */}
      <div className="w-full max-w-4xl">
        <div className="overflow-hidden rounded-lg border-4 border-neutral-700 bg-neutral-800 shadow-2xl shadow-black/50 ring-1 ring-neutral-600 md:rounded-xl">
          {/* Inner screen: hero content (heading, subtext, CTAs) inside LCD */}
          <div
            ref={contentRef}
            className="relative flex min-h-[320px] flex-col justify-center overflow-hidden bg-neutral-900 px-6 py-10 md:min-h-[380px] md:px-10 md:py-14"
          >
            {/* Optional video background */}
            {videoSrc && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
                src={videoSrc}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
            )}
            {/* Hero content: heading, subtext, CTAs — high contrast on dark */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                {heroConfig.heading}
              </h1>
              <p className="mb-6 max-w-2xl text-base text-white/90 md:text-lg lg:text-xl">
                {heroConfig.subtext}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  {heroConfig.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  {heroConfig.ctaSecondary}
                </Button>
              </div>
            </div>
            {/* Optional cycling tagline (subtle, below main content or as ticker) */}
            {lines.length > 0 && (
              <p
                key={slideIndex}
                className="relative z-10 mt-6 text-center font-heading text-sm font-semibold uppercase tracking-wide text-white/70 md:text-base"
                style={
                  reducedMotion
                    ? undefined
                    : { animation: "lcd-text-fade 0.6s ease-out" }
                }
              >
                {currentLine}
              </p>
            )}
          </div>
        </div>
        {/* Optional stand */}
        <div className="mx-auto mt-2 h-3 w-24 rounded-b bg-neutral-700 md:mt-3 md:h-4 md:w-32" />
      </div>
    </div>
  );
}
