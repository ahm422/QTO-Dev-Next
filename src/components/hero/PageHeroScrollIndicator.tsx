"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PageHeroScrollIndicator() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      aria-hidden
    >
      <div className="page-hero-scroll-indicator flex flex-col items-center gap-2">
        <span className="h-8 w-px bg-white/50" />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/70"
          aria-hidden
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
