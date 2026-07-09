"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/components/theme/cn";
import { useHeroTilt, type HeroTiltConfig } from "@/hooks/useHeroTilt";
import { useMotionEnabled } from "@/hooks/useReducedMotion";

export function TiltCard({
  className,
  children,
  maxTilt,
  enableParallax = true,
}: {
  className?: string;
  children: ReactNode;
  maxTilt?: number;
  enableParallax?: boolean;
}) {
  const hitRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  const tiltConfig: HeroTiltConfig | undefined = maxTilt
    ? { maxDelta: maxTilt }
    : undefined;

  useHeroTilt(hitRef, tiltRef, motionEnabled, tiltConfig);

  return (
    <div ref={hitRef} className={cn("[perspective:1200px]", className)}>
      <div
        ref={tiltRef}
        className={cn("h-full w-full", enableParallax && "[transform-style:preserve-3d]")}
        style={enableParallax ? { transformStyle: "preserve-3d" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
