"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function GlowOrb({
  variant = "static",
  className,
  color = "primary",
}: {
  variant?: "static" | "interactive";
  className?: string;
  color?: "primary" | "gold";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (variant !== "interactive" || reducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      ref.current.style.setProperty("--hero-pointer-x", `${x}%`);
      ref.current.style.setProperty("--hero-pointer-y", `${y}%`);
    },
    [variant, reducedMotion]
  );

  const colorClass =
    color === "gold"
      ? "opacity-90 [--glow:244,168,47]"
      : "opacity-100 [--glow:244,139,34]";

  return (
    <div
      ref={ref}
      onPointerMove={variant === "interactive" && !reducedMotion ? handlePointerMove : undefined}
      className={cn(
        "pointer-events-none absolute inset-0 z-0",
        colorClass,
        variant === "interactive"
          ? "hero-glow-interactive hero-glow-mobile lg:hero-glow-desktop"
          : "hero-glow-mobile lg:hero-glow-desktop",
        className
      )}
      style={
        variant === "interactive"
          ? ({
              "--hero-pointer-x": "70%",
              "--hero-pointer-y": "50%",
            } as React.CSSProperties)
          : undefined
      }
      aria-hidden
    />
  );
}
