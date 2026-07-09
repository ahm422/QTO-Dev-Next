/**
 * Projects page copy and section-level strings (issue #42).
 * CMS: projects.page — edit in admin → Pages
 */

export const projectsPageConfig = {
  hero: {
    heading: "Software that ships and lasts",
    subhead: "Selected work across industries and stacks.",
    breadcrumbLabel: "Projects",
  },
  grid: {
    subtitle: "CLIENT WORK",
    title: "Selected Client Work",
    titleHighlight: "Work",
    description:
      "A curated look at recent digital products and platforms we’ve designed, built, and scaled with our clients.",
    viewProjectLabel: "View project",
  },
  filter: {
    allLabel: "All",
  },
  valueSection: {
    subtitle: "WHY OUR WORK MATTERS",
    title: "What You Can Expect",
    titleHighlight: "Expect",
    description:
      "We deliver real impact with modern technology and a client-focused approach.",
    items: [
      { title: "Real impact", description: "Solutions that drive measurable business outcomes." },
      { title: "Modern stack", description: "Current technologies and best practices." },
      { title: "Client-focused", description: "Partnership from discovery through launch and beyond." },
    ],
  },
  cta: {
    title: "Want to See More?",
    description: "Check out our latest case studies and project insights.",
    primaryButtonText: "Contact Us",
    primaryButtonHref: "/contact",
  },
} as const;
