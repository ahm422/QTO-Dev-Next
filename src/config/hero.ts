/**
 * Homepage hero copy and CTAs (issue #175).
 * Edit here to change badge, headline, body, buttons, and trusted-by placeholders.
 */

export const heroConfig = {
  badge: "NEXT-GEN ENGINEERING",

  /** White portion of the H1 */
  heading: "Architecting",
  /** Orange highlight portion */
  headingHighlight: "Digital Futures",

  subtext:
    "We build robust, scalable software systems that power modern businesses—from cloud-native platforms to intelligent automation that drives measurable growth.",

  ctaPrimary: "Start Your Project",
  ctaPrimaryHref: "/contact",
  ctaSecondary: "Explore Capabilities",
  ctaSecondaryHref: "/services",

  trustedByLabel: "TRUSTED BY INNOVATIVE TEAMS",
  trustedByLogos: ["TECHCORP", "NEXUS", "SYNAPSE", "AERIS"] as const,
} as const;
