/**
 * Projects page copy and section-level strings (issue #42).
 * Single config for hero, grid, filter, value section, and CTA.
 */

export const projectsPageConfig = {
  hero: {
    heading: "Our Projects",
    subhead:
      "Explore our portfolio of successful digital solutions delivered to startups, enterprises, and growing businesses across various industries.",
    ctaText: "Get In Touch",
    ctaHref: "/contact",
    breadcrumbLabel: "Projects",
  },
  grid: {
    subtitle: "OUR PROJECTS",
    title: "Our Projects",
    titleHighlight: "Projects",
    description:
      "Explore our portfolio of successful digital solutions delivered to startups, enterprises, and growing businesses across various industries.",
    viewProjectLabel: "View project",
  },
  filter: {
    allLabel: "All",
  },
  pagination: {
    placeholderText: "More projects coming soon.",
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
