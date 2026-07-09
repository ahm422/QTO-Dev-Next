/**
 * About QTO DEV section copy (issue #68).
 * Section label, title, description, tags, CTA, and stat labels.
 * Stat values come from @/data/about (company.projects, clients, team).
 */

export const aboutCompanyConfig = {
  /** Small uppercase label with dashes (e.g. "— ABOUT QTO DEV —") */
  subtitle: "About QTO DEV",

  /** Main section heading */
  title: "Navigating Tech Horizons Together",

  /** Word within title to highlight (gradient) */
  titleHighlight: "Together",

  /** Short paragraph below the title */
  description:
    "We partner with businesses to build scalable technology solutions. From back-end systems to product design, we bring clarity and execution to every project.",

  /** Pill-style tags (label + icon) — cleaned up per content request */
  tags: [] as Array<{ icon: string; label: string }>,

  /** Circular CTA on the image card */
  exploreMoreLabel: "EXPLORE MORE",
  exploreMoreHref: "/about",

  /**
   * Stats displayed as value + label (homepage About section).
   */
  stats: [
    { value: "200+", label: "Successful Projects Delivered" },
    { value: "150+", label: "Satisfied Clients Worldwide" },
    { value: "45+", label: "Skilled Professionals" },
  ],
} as const;
