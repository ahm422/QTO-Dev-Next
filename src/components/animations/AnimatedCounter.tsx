"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/components/theme/cn";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
  label,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  label?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(reducedMotion ? value : 0);
  const hasAnimated = useRef(false);

  const formatted = `${prefix}${display}${suffix}`;

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          setDisplay(Math.round(easeOutCubic(progress) * value));
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion, value, duration]);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      aria-live="polite"
      aria-label={label ? `${label}: ${prefix}${value}${suffix}` : undefined}
    >
      {formatted}
    </span>
  );
}
