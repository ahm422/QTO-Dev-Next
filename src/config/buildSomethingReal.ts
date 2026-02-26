/**
 * Build Something Real section copy (issue #38).
 * "Let's Build Something Real" — dark gradient CTA with headline, two CTAs, three benefit bullets.
 */

export const buildSomethingRealConfig = {
  /** Small uppercase label above the main title */
  subtitle: "LET'S BUILD SOMETHING REAL",

  /** Main section heading */
  title: "Ready to build something exceptional?",

  /** Part of title to highlight in primary/gold */
  titleHighlight: "exceptional?",

  /** Centered body paragraph */
  description:
    "Join teams who ship faster with QTO DEV — from MVPs to scalable platforms. Let's discuss scope, timeline, and the best execution plan.",

  /** Primary CTA */
  primaryCtaLabel: "Book a Consultation",
  primaryCtaHref: "/contact",
  primaryCtaSuffix: "It's Free",

  /** Secondary CTA */
  secondaryCtaLabel: "View Work",
  secondaryCtaHref: "/projects",

  /** Three benefit bullets (displayed with vertical dividers) */
  benefits: [
    "80% long-term partnerships",
    "Weekly demos + transparent delivery",
    "Senior engineers + production-grade",
  ],
} as const;
