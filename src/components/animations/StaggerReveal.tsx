"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/Reveal";

export function StaggerReveal({
  className,
  children,
  staggerDelay = 80,
  childSelector = ":scope > *",
}: {
  className?: string;
  children: ReactNode;
  staggerDelay?: number;
  childSelector?: string;
}) {
  return (
    <Reveal
      className={className}
      staggerSelector={childSelector}
      staggerDelay={staggerDelay}
    >
      {children}
    </Reveal>
  );
}
