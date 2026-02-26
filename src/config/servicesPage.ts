/**
 * Services page copy and section-level strings (issue #40).
 * Single config for hero, grid, process, why choose us, and CTA.
 */

export const servicesPageConfig = {
  hero: {
    heading: "Our Services",
    subhead:
      "Comprehensive technology solutions designed to accelerate your business growth",
    ctaText: "Get in Touch",
    ctaHref: "/contact",
    breadcrumbLabel: "Services",
  },
  grid: {
    subtitle: "WHAT WE OFFER",
    title: "Custom Software Development Services",
    titleHighlight: "Custom",
    description:
      "From web and mobile to cloud and AI—we deliver end-to-end solutions that scale with your business.",
    learnMoreLabel: "Learn More",
  },
  process: {
    subtitle: "HOW WE DELIVER",
    title: "Our Service Delivery Process",
    titleHighlight: "Process",
    description:
      "A clear, six-step framework—from discovery to long-term support—designed to reduce risk and keep you confident at every stage.",
  },
  whyChooseUs: {
    subtitle: "WHY CHOOSE US",
    title: "Why Partner With Us for Services",
    titleHighlight: "Partner",
    body: "We combine technical excellence with a partnership mindset. From discovery to launch and beyond, our team delivers custom software that scales with you—without compromise.",
    ctaLabel: "See our work",
    ctaHref: "/portfolio",
    cardLabel: "WHY QTO DEV",
  },
  cta: {
    title: "Ready to Get Started?",
    description: "Let's discuss which service is right for your business.",
    primaryButtonText: "Schedule a Call",
    primaryButtonHref: "/contact",
  },
} as const;
