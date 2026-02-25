/**
 * Engagement Models section copy and labels (issue #30).
 * Centered header and shared strings for the engagement model cards.
 */

export const engagementModelsConfig = {
  /** Small uppercase label in gold (e.g. "ENGAGEMENT MODELS") */
  subtitle: "ENGAGEMENT MODELS",

  /** Main section title; titleHighlight is wrapped in primary/gold */
  title: "Choose the model that fits your pace",

  /** Word within title to highlight (primary/gold) */
  titleHighlight: "pace",

  /** Description below the main title */
  description:
    "Simple engagement options designed for clarity, speed, and long-term partnership.",

  /** Label for the "Get Started" CTA on each card */
  getStartedLabel: "Get Started",

  /** Label for the popular card badge */
  mostPopularLabel: "MOST POPULAR",

  /** Base path for CTA links; data can append ?model=... for each option */
  contactBasePath: "/contact",
} as const;
