/**
 * About page copy and section-level strings (issue #44).
 * Single config for hero, company snapshot, mission/vision, values, what we do, trust, and CTA.
 */

export const aboutPageConfig = {
  hero: {
    pageHeading: "About QTO Dev",
    heading: "Empowering Businesses Through Intelligent Technology",
    subhead:
      "At QTO Dev, we build secure, scalable, performance-driven software—from custom web platforms and ERP systems to workflow automation tools—so organizations can operate smarter and grow faster.",
    ctaText: "Get In Touch",
    ctaHref: "/contact",
    breadcrumbLabel: "About",
  },
  companySnapshot: {
    subtitle: "OUR JOURNEY",
    title: "Our Journey",
    titleHighlight: "Journey",
    description:
      "From our early days as a small engineering-led studio to a trusted technology partner for growing businesses, our journey has been shaped by curiosity, craftsmanship, and long-term relationships.",
  },
  mission: {
    subtitle: "MISSION & VISION",
    title: "Our Mission & Vision",
    titleHighlight: "Mission",
    description:
      "Our purpose and our aspiration—guiding everything we build and every partnership we form.",
  },
  values: {
    subtitle: "OUR VALUES",
    title: "What We Stand For",
    titleHighlight: "Stand",
    description:
      "The principles that guide our work and our relationships with clients and partners.",
  },
  trust: {
    subtitle: "WHY TRUST US",
    title: "Why Clients Trust Us",
    titleHighlight: "Trust",
    description: "We're committed to excellence in every project.",
    reasons: [
      "10+ years of combined experience",
      "150+ successful projects",
      "99.9% client satisfaction rate",
      "On-time and on-budget delivery",
      "Dedicated support team",
      "Transparent communication",
    ],
  },
  cta: {
    title: "Let's Work Together",
    description:
      "Ready to partner with a team that cares about your success?",
    primaryButtonText: "Lets Chat Or Get In Touch",
    primaryButtonHref: "/contact",
  },
} as const;
