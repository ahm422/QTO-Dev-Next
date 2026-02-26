/**
 * Blog listing page copy and section-level strings (issue #46).
 * Single config for hero, featured, grid, filter, pagination, and CTA.
 */

export const blogsPageConfig = {
  hero: {
    heading: "Our Blog",
    subhead:
      "Insights, tips, and best practices from our team of experts.",
    breadcrumbLabel: "Blog",
    ctaText: "Subscribe",
    ctaHref: "/contact",
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
    title: "Stay in the loop",
    description: "Get the latest posts and updates delivered to your inbox.",
    primaryButtonText: "Subscribe",
    primaryButtonHref: "/contact",
  },
} as const;
