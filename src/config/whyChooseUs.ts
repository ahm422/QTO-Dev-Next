/**
 * Why Choose Us section copy and links (issue #22).
 * Two-column layout: left copy + CTA, right carousel of benefit cards.
 */

export const whyChooseUsConfig = {
  /** Main section heading */
  heading: "Why Choose Us?",

  /** Body paragraph below the heading */
  body:
    "We combine technical excellence with a deep understanding of your business. From discovery to launch, our team delivers custom software that scales with you—without compromise.",

  /** CTA button label */
  ctaLabel: "See solutions",

  /** CTA href (e.g. /solutions or /contact) */
  ctaHref: "/services",

  /** Small uppercase label on the benefit card */
  cardLabel: "WHY QTO DEV?",

  /** Checklist bullets shown below the CTA */
  checklist: [
    "Agile delivery with transparent milestones",
    "Senior engineers on every project",
    "Post-launch support and maintenance",
    "Security-first architecture",
    "Dedicated single point of contact",
  ],
} as const;
