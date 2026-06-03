"use client";

import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroTerminalMockupProps {
  readonly lines: readonly string[];
  readonly className?: string;
}

export function HeroTerminalMockup({
  lines,
  className,
}: Readonly<HeroTerminalMockupProps>) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group/terminal relative w-full max-w-md mx-auto lg:max-w-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Ambient glow behind terminal */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/20 blur-3xl opacity-50 transition-opacity duration-500 group-hover/terminal:opacity-75"
        aria-hidden
      />

      {/* 3D perspective wrapper */}
      <div
        className="relative"
        style={{
          transform: "perspective(1000px) rotateY(-12deg) rotateX(4deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Terminal frame */}
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/70",
            "bg-[#0d1117]",
            "ring-1 ring-inset ring-white/10",
            "transition-[border-color] duration-500 group-hover/terminal:border-white/25"
          )}
        >
          {/* Chrome bar */}
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="size-3 rounded-full bg-[#ef4444] shadow-[0_0_5px_rgba(239,68,68,0.6)]" />
            <span className="size-3 rounded-full bg-[#eab308] shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
            <span className="size-3 rounded-full bg-[#22c55e] shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            <span className="ml-auto text-[0.65rem] font-mono text-white/20">
              bash — 80×24
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-5 font-mono text-sm leading-relaxed">
            {lines.map((line, i) => (
              <p
                key={i}
                className={cn(
                  "text-[#22c55e]",
                  !reducedMotion && "hero-terminal-line"
                )}
                style={
                  !reducedMotion ? { animationDelay: `${i * 420}ms` } : undefined
                }
              >
                {line}
              </p>
            ))}
            <span
              className={cn(
                "mt-1 inline-block text-[#22c55e]",
                !reducedMotion && "hero-terminal-cursor"
              )}
            >
              ▋
            </span>
          </div>

          {/* Status footer */}
          <div className="flex items-center gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/4 rounded-full bg-primary shadow-[0_0_6px_rgba(244,139,34,0.6)]" />
            </div>
            <span className="text-[0.6rem] font-mono text-white/30">
              75% compiled
            </span>
            <span className="ml-auto text-[0.6rem] font-mono text-[#22c55e]/60">
              ● Server Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
