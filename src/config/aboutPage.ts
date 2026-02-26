/**
 * About page copy and section-level strings (issue #44).
 * Single config for hero, company snapshot, mission/vision, values, what we do, trust, and CTA.
 */

export const aboutPageConfig = {
  hero: {
    heading: "About QTO Dev",
    subhead:
      "We're a team of passionate developers and designers creating digital solutions that drive real business results.",
    ctaText: "Learn More",
    ctaHref: "/contact",
    breadcrumbLabel: "About",
  },
  companySnapshot: {
    subtitle: "OUR STORY",
    title: "Our Story",
    titleHighlight: "Story",
    description:
      "Since our founding, we've been at the forefront of digital transformation—partnering with startups and enterprises alike.",
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
  whatWeDo: {
    subtitle: "WHAT WE DO",
    title: "What We Do",
    titleHighlight: "Do",
    description:
      "From web and mobile to design and consulting—we deliver end-to-end technology solutions.",
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
    primaryButtonText: "Schedule a Call",
    primaryButtonHref: "/contact",
  },
} as const;
