"use client";

import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroDashboardMockupProps {
  readonly className?: string;
}

export function HeroDashboardMockup({
  className,
}: Readonly<HeroDashboardMockupProps>) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group/mockup relative w-full max-w-md mx-auto lg:max-w-none",
        !reducedMotion && "hero-mockup-float",
        className
      )}
      aria-hidden="true"
    >
      {/* Ambient glow behind card */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/25 blur-3xl opacity-60 transition-opacity duration-500 group-hover/mockup:opacity-90 sm:-inset-6"
        aria-hidden
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/15 p-5 shadow-2xl shadow-black/60 sm:p-6 lg:p-7",
          "bg-white/[0.06] backdrop-blur-xl",
          "ring-1 ring-inset ring-white/10",
          "transition-transform duration-500 ease-out",
          "group-hover/mockup:scale-[1.02] group-hover/mockup:border-white/20",
          !reducedMotion && "motion-safe:group-hover/mockup:-translate-y-1"
        )}
      >
        {/* Top glass highlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.12] to-transparent"
          aria-hidden
        />

        {/* Window chrome */}
        <div className="relative mb-4 flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
          <span className="size-2.5 rounded-full bg-[#eab308] shadow-[0_0_6px_rgba(234,179,8,0.4)]" />
          <span className="size-2.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
        </div>
        <div
          className={cn(
            "relative mb-6 h-1 w-[42%] rounded-full bg-primary shadow-[0_0_12px_rgba(244,139,34,0.5)]",
            !reducedMotion && "hero-accent-pulse"
          )}
        />

        {/* Placeholder bars */}
        <div className="relative mb-7 space-y-3">
          <div
            className={cn(
              "h-3 w-full rounded-md bg-white/10",
              !reducedMotion && "hero-bar-shimmer"
            )}
            style={!reducedMotion ? { animationDelay: "0ms" } : undefined}
          />
          <div
            className={cn(
              "h-3 w-[88%] rounded-md bg-white/10",
              !reducedMotion && "hero-bar-shimmer"
            )}
            style={!reducedMotion ? { animationDelay: "150ms" } : undefined}
          />
          <div
            className={cn(
              "h-3 w-[68%] rounded-md bg-white/10",
              !reducedMotion && "hero-bar-shimmer"
            )}
            style={!reducedMotion ? { animationDelay: "300ms" } : undefined}
          />
        </div>

        {/* Bottom widgets */}
        <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
          {/* Progress ring */}
          <div className="flex items-center justify-center rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm transition-colors duration-300 group-hover/mockup:border-primary/30 group-hover/mockup:bg-primary/5">
            <svg viewBox="0 0 64 64" className="size-[4.5rem] sm:size-20">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="text-white/10"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * 0.75}`}
                transform="rotate(-90 32 32)"
                className={cn(
                  "text-primary drop-shadow-[0_0_8px_rgba(244,139,34,0.6)]",
                  !reducedMotion && "hero-ring-pulse"
                )}
              />
            </svg>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-center gap-2.5 rounded-xl border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-sm transition-colors duration-300 group-hover/mockup:border-primary/30 group-hover/mockup:bg-primary/5">
            <div
              className={cn(
                "w-3 rounded-sm bg-white/15",
                !reducedMotion && "hero-chart-bar"
              )}
              style={{ height: "2rem", animationDelay: "0ms" }}
            />
            <div
              className={cn(
                "w-3 rounded-sm bg-primary shadow-[0_0_10px_rgba(244,139,34,0.45)]",
                !reducedMotion && "hero-chart-bar"
              )}
              style={{ height: "3rem", animationDelay: "120ms" }}
            />
            <div
              className={cn(
                "w-3 rounded-sm bg-white/15",
                !reducedMotion && "hero-chart-bar"
              )}
              style={{ height: "1.5rem", animationDelay: "240ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
