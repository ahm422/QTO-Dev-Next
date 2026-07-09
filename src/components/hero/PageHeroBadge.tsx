"use client";

import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PageHeroBadge({ label }: { label: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "mb-4 inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-white/[0.06] px-4 py-2 backdrop-blur-sm",
        "transition-colors duration-300 hover:border-primary/60 hover:bg-white/[0.08]"
      )}
    >
      <span
        className={cn(
          "size-2 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(244,139,34,0.8)]",
          !reducedMotion && "hero-badge-dot-pulse"
        )}
        aria-hidden
      />
      <span className="text-xs font-semibold text-primary/90 sm:text-sm">{label}</span>
    </div>
  );
}
