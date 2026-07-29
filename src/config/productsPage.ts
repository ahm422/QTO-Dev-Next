/**
 * Products page chrome (hero + footer CTA).
 * Product bodies are managed in the CMS and rendered in order on /products.
 */

export const productsPageConfig = {
  hero: {
    badge: "Products",
    heading: "Software products built for real work",
    subhead:
      "Platforms and tools we build for operations, bidding, and project intelligence — explore what's live and what's coming next.",
    ctaText: "Explore products",
    ctaHref: "#construct-quest",
    breadcrumbLabel: "Products",
  },
  cta: {
    title: "Interested in these products? Let's talk",
    description:
      "Whether you need enterprise software or want early access to something in development, we'd love to hear from you.",
    primaryButtonText: "Get In Touch",
    primaryButtonHref: "/contact",
  },
} as const;
