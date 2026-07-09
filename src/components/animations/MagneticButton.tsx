"use client";

import { useRef, type ReactNode } from "react";
import { Slot } from "radix-ui";
import { cn } from "@/components/theme/cn";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { useMotionEnabled } from "@/hooks/useReducedMotion";

export function MagneticButton({
  asChild = false,
  strength = 0.35,
  className,
  children,
  ...props
}: {
  asChild?: boolean;
  strength?: number;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();
  useMagneticButton(ref, motionEnabled, strength);

  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp ref={ref} className={cn(className)} {...props}>
      {children}
    </Comp>
  );
}
