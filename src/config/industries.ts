/**
 * Industries We Serve section copy (issue #28).
 * Header, nav labels, and auto-scroll interval.
 */

export const industriesConfig = {
  /** Small uppercase label above the title */
  subtitle: "INDUSTRIES",

  /** Main section heading */
  title: "Industries We Serve",

  /** Part of title to highlight in gold (primary); optional */
  titleHighlight: undefined as string | undefined,

  /** Label for previous slide button */
  prevLabel: "← Prev",

  /** Label for next slide button */
  nextLabel: "Next →",

  /** Auto-advance interval in milliseconds */
  autoScrollIntervalMs: 4500,

  /** Aria label for the carousel region */
  carouselAriaLabel: "Industries we serve",
} as const;
