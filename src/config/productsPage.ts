/**
 * Products page chrome (hero + footer CTA).
 * Product bodies (ERP, Construct Quest) are managed in the CMS (issue #368).
 */

export const productsPageConfig = {
  hero: {
    badge: "Products",
    heading: "Software products built for real work",
    subhead:
      "ERP platforms that unify operations, and Construct Quest — a construction bidding & project intelligence platform in development.",
    ctaText: "Explore Construct Quest",
    ctaHref: "#construct-quest",
    breadcrumbLabel: "Products",
  },
  cta: {
    title: "Interested in these products? Let's talk",
    description:
      "Whether you need enterprise ERP or want early access to Construct Quest, we'd love to hear from you.",
    primaryButtonText: "Get In Touch",
    primaryButtonHref: "/contact",
  },
} as const;
