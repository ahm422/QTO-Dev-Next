/**
 * Portfolio section copy (issue #18).
 * Left-aligned header, title with gold highlight, tagline, and View All CTA.
 */

export const portfolioConfig = {
  /** Small uppercase label above the main title (e.g. "PORTFOLIO") */
  subtitle: "PORTFOLIO",

  /** Main section title; titleHighlight is wrapped in primary/gold */
  title: "Custom Software Development Highlights",

  /** Word within title to highlight (primary/gold) */
  titleHighlight: "Highlights",

  /** Tagline below the main title */
  description:
    "Bringing dreams to life through innovative solutions.",

  /** Label for the View All CTA button */
  viewAllLabel: "View All -",

  /** href for the View All CTA (projects listing) */
  viewAllHref: "/projects",
} as const;
