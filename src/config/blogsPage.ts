/**
 * Blog listing page copy and section-level strings (issue #46).
 * Single config for hero, featured, grid, filter, pagination, and CTA.
 */

export const blogsPageConfig = {
  hero: {
    heading: "Insights & Articles",
    subhead:
      "Stay updated with industry trends, technology insights, business automation strategies, and expert development guides from our team.",
    breadcrumbLabel: "Blog",
  },
  featured: {
    subtitle: "FEATURED",
    title: "Featured Articles",
    titleHighlight: "Featured",
    description:
      "Hand-picked reads on development, performance, and modern web.",
  },
  grid: {
    subtitle: "ALL POSTS",
    title: "Articles & Insights",
    titleHighlight: "Insights",
    description:
      "Browse all our posts on web development, React, performance, and more.",
  },
  filter: {
    allLabel: "All",
  },
  pagination: {
    placeholderText: "More articles coming soon.",
  },
  cta: {
    title: "Ready to Build Your Next Project?",
    description: "Turn ideas from our articles into real-world solutions with a team that ships high-performance software.",
    primaryButtonText: "Request a Free Consultation",
    primaryButtonHref: "/contact",
  },
} as const;
