"use client";

import Link from "next/link";
import { cn } from "@/components/theme/cn";
import { AppIcon } from "@/components/ui/shared/AppIcon";

const baseClassName = cn(
  "fixed z-30 bottom-6 right-4 md:bottom-8 md:right-6",
  "items-center justify-center bg-primary text-white shadow-lg",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "transition hover:scale-105 hover:shadow-xl",
  "motion-reduce:transition-none motion-reduce:hover:scale-100"
);

/**
 * Fixed floating CTA to /contact. Two Tailwind-toggled variants (no JS media queries)
 * so SSR and client match across breakpoints.
 */
export function FloatingContactButton() {
  return (
    <>
      <Link
        href="/contact"
        aria-label="Contact Us"
        className={cn(baseClassName, "inline-flex size-14 rounded-full md:hidden")}
      >
        <AppIcon name="envelope" size="base" />
      </Link>
      <Link
        href="/contact"
        className={cn(
          baseClassName,
          "hidden gap-2 rounded-full px-5 py-3 text-sm font-semibold md:inline-flex"
        )}
      >
        <AppIcon name="envelope" size="sm" />
        Contact Us
      </Link>
    </>
  );
}
