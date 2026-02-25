"use client";

import Link from "next/link";
import { cn } from "@/components/theme/cn";

interface HeaderCTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** Optional aria-label for accessibility when visible text is generic */
  ariaLabel?: string;
}

/**
 * Capsule CTA button using logo primary (orange), with a white dot on the right.
 * Default: primary background, white text, white dot. High contrast in all themes.
 * On hover/focus-visible: white expands from the dot to fill the button;
 * dot becomes primary (swap). Text turns dark for contrast on white.
 */
export function HeaderCTAButton({
  href,
  children,
  className,
  onClick,
  ariaLabel,
}: HeaderCTAButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      {/* Expanding fill from dot (right): origin right so it fully covers the button */}
      <span
        className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 translate-x-1/2 rounded-full bg-white transition-transform duration-500 ease-out scale-0 group-hover:scale-[8] group-focus-visible:scale-[8] origin-right"
        aria-hidden
      />
      {/* Label and dot above; text stays visible: white on primary, dark on hover fill */}
      <span className="relative z-10 flex items-center gap-2">
        <span className="transition-colors duration-500 ease-out group-hover:text-gray-900 group-focus-visible:text-gray-900">
          {children}
        </span>
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-white transition-colors duration-500 ease-out group-hover:bg-primary group-focus-visible:bg-primary"
          aria-hidden
        />
      </span>
    </Link>
  );
}
