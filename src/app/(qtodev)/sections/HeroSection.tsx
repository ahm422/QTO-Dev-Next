"use client";

import { useRef } from "react";
import { HeroLCDScreen } from "@/components/hero/HeroLCDScreen";
import { heroConfig } from "@/config/hero";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-hero-bg text-hero-fg"
    >
      {/* Single viewport: background headline + LCD aligned to headline top; pinned while LCD reveals */}
      <div className="relative h-full">
        {/* Background layer: "SITES THAT MOVE" — lowest z-index */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-0 flex justify-center pt-6 md:pt-10"
          aria-hidden
        >
          <p
            className="font-heading text-center font-bold uppercase tracking-wide text-hero-fg/10 select-none whitespace-nowrap px-4"
            style={{
              fontSize: "clamp(5rem, 22vw, 18rem)",
              lineHeight: 1,
            }}
          >
            {heroConfig.backgroundHeadline}
          </p>
        </div>

        {/* LCD layer: starts slightly below headline so full LCD is visible when revealed; constrained to hero */}
        <div className="absolute inset-0 z-20 flex flex-col pt-20 md:pt-28 overflow-hidden px-4">
          <div className="flex-1 min-h-0 flex justify-center items-start">
            <HeroLCDScreen scrollTriggerRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
