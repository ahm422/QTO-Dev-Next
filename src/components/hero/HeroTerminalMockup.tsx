"use client";

import { useRef } from "react";
import {
  SiCloudflare,
  SiReact,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import { cn } from "@/components/theme/cn";
import { useHeroTilt } from "@/hooks/useHeroTilt";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypewriterLines } from "@/hooks/useTypewriterLines";

interface HeroTerminalMockupProps {
  readonly lines: readonly string[];
  readonly className?: string;
  /** When false: no mouse-follow (reduced motion / mobile). */
  readonly tiltEnabled?: boolean;
}

const TILT_CONFIG = { maxDelta: 16, maxShift: 14 } as const;

function ChipShell({
  className,
  parallax,
  bobClass,
  entranceClass,
  motionOk,
  children,
}: Readonly<{
  className: string;
  parallax: string;
  bobClass?: string;
  entranceClass?: string;
  motionOk: boolean;
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn("hero-chip absolute", className, entranceClass)}
      style={{ transform: parallax }}
    >
      <div
        className={cn(
          "hero-chip-inner transition-[transform,filter] duration-300",
          motionOk &&
            "lg:group-hover/terminal:scale-105 lg:group-hover/terminal:brightness-110",
          bobClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function HeroTerminalMockup({
  lines,
  className,
  tiltEnabled = false,
}: Readonly<HeroTerminalMockupProps>) {
  const reducedMotion = useReducedMotion();
  const hitRef = useRef<HTMLDivElement>(null);
  const tiltRootRef = useRef<HTMLDivElement>(null);

  useHeroTilt(hitRef, tiltRootRef, tiltEnabled, TILT_CONFIG);

  const { displayLines, activeLineIndex, showCursor } = useTypewriterLines(
    lines,
    reducedMotion
  );

  const motionOk = !reducedMotion;
  const bobOk = motionOk;

  return (
    <div
      ref={hitRef}
      className={cn(
        "group/terminal hero-terminal-hit relative w-full max-w-md mx-auto lg:max-w-none",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "hero-terminal-stage relative overflow-visible",
          motionOk && "hero-terminal-entrance"
        )}
      >
        <div ref={tiltRootRef} className="hero-terminal-tilt relative">
          <div className="pointer-events-none absolute -inset-10 rounded-[2.5rem] bg-primary/35 blur-3xl opacity-70 transition-opacity duration-500 group-hover/terminal:opacity-95 lg:-inset-12 lg:[transform:translateZ(-48px)]" />
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-primary/20 blur-xl opacity-50 transition-opacity duration-500 group-hover/terminal:opacity-75 lg:-inset-8 lg:[transform:translateZ(-24px)]" />

          <div className="pointer-events-none absolute inset-0 z-20 max-lg:contents lg:block">
            <ChipShell
              className="-left-2 -top-3 lg:-left-6 lg:-top-5"
              parallax="translate3d(calc(var(--hero-parallax-x, 0) * -14px), calc(var(--hero-parallax-y, 0) * -10px), 56px)"
              bobClass={bobOk ? "hero-chip-bob hero-chip-bob-delay-0" : undefined}
              entranceClass={motionOk ? "hero-chip-entrance hero-chip-entrance-delay-0" : undefined}
              motionOk={motionOk}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0d1117]/90 px-2.5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                <SiReact className="size-3.5 text-[#61DAFB]" />
                <span className="text-[0.65rem] font-medium text-white/80">
                  React
                </span>
              </span>
            </ChipShell>

            <ChipShell
              className="-right-1 top-8 lg:-right-5 lg:top-10"
              parallax="translate3d(calc(var(--hero-parallax-x, 0) * 18px), calc(var(--hero-parallax-y, 0) * -12px), 72px)"
              bobClass={bobOk ? "hero-chip-bob hero-chip-bob-delay-1" : undefined}
              entranceClass={motionOk ? "hero-chip-entrance hero-chip-entrance-delay-1" : undefined}
              motionOk={motionOk}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0d1117]/90 px-2.5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] ">
                <SiTypescript className="size-3.5 text-[#3178C6]" />
                <span className="text-[0.65rem] font-medium text-white/80">
                  TypeScript
                </span>
              </span>
            </ChipShell>

            <ChipShell
              className="-left-3 bottom-24 lg:-left-8 lg:bottom-28"
              parallax="translate3d(calc(var(--hero-parallax-x, 0) * -20px), calc(var(--hero-parallax-y, 0) * 10px), 48px)"
              bobClass={bobOk ? "hero-chip-bob hero-chip-bob-delay-2" : undefined}
              entranceClass={motionOk ? "hero-chip-entrance hero-chip-entrance-delay-2" : undefined}
              motionOk={motionOk}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0d1117]/90 px-2.5 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] ">
                <SiCloudflare className="size-3.5 text-[#F38020]" />
                <span className="text-[0.65rem] font-medium text-white/80">
                  Cloudflare
                </span>
              </span>
            </ChipShell>

            <ChipShell
              className="-bottom-2 left-4 lg:-bottom-4 lg:left-6"
              parallax="translate3d(calc(var(--hero-parallax-x, 0) * -10px), calc(var(--hero-parallax-y, 0) * 14px), 40px)"
              bobClass={bobOk ? "hero-chip-bob hero-chip-bob-delay-3" : undefined}
              entranceClass={motionOk ? "hero-chip-entrance hero-chip-entrance-delay-3" : undefined}
              motionOk={motionOk}
            >
              <div className="rounded-lg border border-white/15 bg-[#0d1117]/95 px-3 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.5)] ">
                <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-white/45">
                  Status
                </p>
                <p className="mt-0.5 text-xs font-medium text-white/90">
                  4 services online
                </p>
                <p className="text-[0.65rem] font-mono text-[#22c55e]/80">
                  ~42ms p95
                </p>
              </div>
            </ChipShell>

            <ChipShell
              className="-bottom-1 right-2 lg:-bottom-3 lg:-right-4"
              parallax="translate3d(calc(var(--hero-parallax-x, 0) * 16px), calc(var(--hero-parallax-y, 0) * 12px), 64px)"
              bobClass={bobOk ? "hero-chip-bob hero-chip-bob-delay-4" : undefined}
              entranceClass={motionOk ? "hero-chip-entrance hero-chip-entrance-delay-4" : undefined}
              motionOk={motionOk}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/35 bg-[#052e16]/90 px-3 py-1.5 shadow-[0_8px_24px_rgba(34,197,94,0.25)] ">
                <span className="size-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                <span className="text-[0.65rem] font-medium text-[#86efac]">
                  Deploy successful
                </span>
              </span>
            </ChipShell>
          </div>

          <div
            className={cn(
              "relative z-10 overflow-hidden rounded-xl border border-white/15",
              "bg-[#0d1117]",
              "shadow-[0_24px_64px_rgba(0,0,0,0.65),0_8px_24px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]",
              "ring-1 ring-inset ring-white/10",
              "transition-[border-color,box-shadow] duration-500",
              "group-hover/terminal:border-white/25",
              "group-hover/terminal:shadow-[0_32px_80px_rgba(0,0,0,0.7),0_12px_32px_rgba(244,139,34,0.15),0_0_0_1px_rgba(255,255,255,0.08)]",
              "lg:[transform:translateZ(0)]"
            )}
          >
            <div
              className="hero-terminal-glare pointer-events-none absolute inset-0 z-30 opacity-60 transition-opacity duration-500 group-hover/terminal:opacity-90"
              aria-hidden
            />

            <div className="relative z-10 flex items-center gap-1.5 border-b border-white/10 bg-white/[0.04] px-4 py-3 lg:px-5 lg:py-3.5">
              <span className="size-3 rounded-full bg-[#ef4444] shadow-[0_0_5px_rgba(239,68,68,0.6)]" />
              <span className="size-3 rounded-full bg-[#eab308] shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              <span className="size-3 rounded-full bg-[#22c55e] shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <span className="ml-auto text-[0.65rem] font-mono text-white/20 lg:text-xs">
                bash — 80×24
              </span>
            </div>

            <div className="relative z-10 min-h-[9.5rem] p-5 font-mono text-sm leading-relaxed lg:min-h-[11.5rem] lg:p-6 lg:text-[0.9375rem] lg:leading-relaxed">
              {displayLines.map((line, i) => (
                <p key={`${i}-${line.slice(0, 12)}`} className="text-[#22c55e]">
                  {line}
                  {showCursor && activeLineIndex === i ? (
                    <span
                      className={cn(
                        "ml-0.5 inline-block text-[#22c55e]",
                        motionOk && "hero-terminal-cursor"
                      )}
                    >
                      ▋
                    </span>
                  ) : null}
                </p>
              ))}
              {showCursor && activeLineIndex >= displayLines.length ? (
                <p className="text-[#22c55e]">
                  <span
                    className={cn(
                      "inline-block text-[#22c55e]",
                      motionOk && "hero-terminal-cursor"
                    )}
                  >
                    ▋
                  </span>
                </p>
              ) : null}
            </div>

            <div className="relative z-10 flex items-center gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-2 lg:px-5 lg:py-2.5">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10 lg:w-28">
                <div className="h-full w-3/4 rounded-full bg-primary shadow-[0_0_6px_rgba(244,139,34,0.6)]" />
              </div>
              <span className="text-[0.6rem] font-mono text-white/30 lg:text-[0.65rem]">
                75% compiled
              </span>
              <span className="ml-auto text-[0.6rem] font-mono text-[#22c55e]/60 lg:text-[0.65rem]">
                ● Server Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
