/**
 * Portfolio section copy (issue #18, #72).
 * Centered "Our Featured Work" header and View All CTA.
 */

export const portfolioConfig = {
  /** Small uppercase label above the main title */
  subtitle: "PORTFOLIO",

  /** Main section title; titleHighlight is wrapped in primary/gold */
  title: "Our Featured Work",

  /** Word within title to highlight (primary/gold) */
  titleHighlight: "Featured",

  /** Tagline below the main title (empty — no secondary description under Featured Work) */
  description: "",

  /** Label for the View All CTA button */
  viewAllLabel: "View All",

  /** href for the View All CTA (projects listing) */
  viewAllHref: "/projects",
} as const;
