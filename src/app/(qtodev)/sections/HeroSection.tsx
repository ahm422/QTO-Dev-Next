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
      {/* Single viewport: background headline + LCD centered; pinned while LCD reveals */}
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

        {/* LCD layer: centered in wide space, revealed on scroll — above background text */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <HeroLCDScreen scrollTriggerRef={sectionRef} />
        </div>
      </div>
    </section>
  );
}
