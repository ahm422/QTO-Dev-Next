/**
 * Homepage hero copy and CTAs (issue #175, #201).
 * Edit here to change badge, headline, body, buttons, trusted-by, and terminal lines.
 */

export const heroConfig = {
  badge: "Next-Gen Software Engineering",

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

  trustedByLabel: "TRUSTED BY",

  terminalLines: [
    "> Initializing core systems...",
    "> Loading modules: React, Node.js, AWS...",
    "> Compiling assets [OK]",
    "> Server running on port 3000",
  ],
} as const;
