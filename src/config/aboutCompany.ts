/**
 * About Company section copy (issue #12).
 * Section label, title, description, tags, CTA, and stat labels.
 * Stat values come from @/data/about (company.projects, clients, team).
 */

export const aboutCompanyConfig = {
  /** Small uppercase label with dashes (e.g. "— ABOUT COMPANY —") */
  subtitle: "ABOUT COMPANY",

  /** Main section heading */
  title: "Navigating Tech Horizons Together",

  /** Short paragraph below the title */
  description:
    "We partner with businesses to build scalable technology solutions. From back-end systems to product design, we bring clarity and execution to every project.",

  /** Pill-style tags (label + icon for Back-End Development, Product Design, etc.) */
  tags: [
    { label: "Back-End Development", icon: "⌘" },
    { label: "Product Design", icon: "◇" },
  ],

  /** Circular CTA on the image card */
  exploreMoreLabel: "EXPLORE MORE",
  exploreMoreHref: "/about",

  /**
   * Stat labels only. Values are taken from aboutData.company
   * in order: projects, clients, team (formatted in section as "20.5 k" style).
   */
  statLabels: ["Projects Done", "Happy Clients", "Team Members"],
} as const;
