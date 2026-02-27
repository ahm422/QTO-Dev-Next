"use client";

import { useEffect, useRef, useState } from "react";
import { HeroLCDScreen } from "@/components/hero/HeroLCDScreen";
import { heroConfig } from "@/config/hero";
import { useHeroScrollSentinel } from "@/contexts/HeroScrollContext";
import { cn } from "@/components/theme/cn";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroScroll = useHeroScrollSentinel();
  const reducedMotion = useReducedMotion();

  const backgroundHeadlines =
    heroConfig.backgroundHeadlines && heroConfig.backgroundHeadlines.length > 0
      ? heroConfig.backgroundHeadlines
      : [heroConfig.backgroundHeadline];

  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || backgroundHeadlines.length <= 1) return;

    const interval = window.setInterval(() => {
      setHeadlineIndex((index) => (index + 1) % backgroundHeadlines.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [backgroundHeadlines.length, reducedMotion]);

  const currentBackgroundHeadline =
    backgroundHeadlines[headlineIndex] ?? heroConfig.backgroundHeadline;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-hero-bg text-hero-fg"
      aria-label="Introduction"
    >
      {/* Soft gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(244,139,34,0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(244,139,34,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative h-full">
        {/* Background layer: decorative headline */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex justify-center pt-6 md:pt-10"
          aria-hidden
        >
          <p
            key={currentBackgroundHeadline}
            className={cn(
              "font-heading text-center font-bold uppercase tracking-wide text-hero-fg/10 select-none px-4",
              !reducedMotion && "hero-headline-animated"
            )}
            style={{
              fontSize: "clamp(5rem, 22vw, 18rem)",
              lineHeight: 1,
            }}
          >
            {currentBackgroundHeadline}
          </p>
        </div>

        {/* LCD layer */}
        <div className="absolute inset-x-0 top-0 bottom-0 z-20 flex flex-col pt-6 md:pt-10 pb-8 md:pb-12 overflow-hidden">
          <div className="flex-1 min-h-0 flex justify-center items-start px-4">
            <HeroLCDScreen
              scrollTriggerRef={sectionRef}
              triggerRef={heroScroll?.sentinelRef}
              triggerReady={heroScroll?.ready}
            />
          </div>

          {/* Scroll hint: user-friendly cue to explore */}
          <div
            className="flex flex-col items-center gap-2 pt-4 text-hero-fg/50"
            aria-hidden
          >
            <span className="text-xs uppercase tracking-widest font-medium">
              Scroll to explore
            </span>
            <div
              className={cn(
                "w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2",
                "animate-bounce motion-reduce:animate-none"
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
