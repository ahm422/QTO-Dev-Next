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
  ceo: {
    subtitle: "OUR STORY",
    title: "Message from the CEO",
    titleHighlight: "CEO",
    storyHeading: "Built by engineers, led with purpose",
    message:
      "QTO Dev was founded on a simple belief: technology should solve real business problems, not create new ones. From our first custom platform to enterprise ERP deployments, we've stayed close to the teams we serve—listening, building, and iterating until the solution fits the way you work.",
    badgeChips: [
      { label: "Founder & CEO", value: "Muhammad Ahmad Mustafa" },
      { label: "Years of experience", value: "10+" },
    ],
    stats: [
      { label: "Team Members", value: 45, suffix: "+" },
      { label: "Projects Delivered", value: 200, suffix: "+" },
      { label: "Years Experience", value: 10, suffix: "+" },
      { label: "Countries Served", value: 15, suffix: "+" },
    ],
  },
  erpSolutions: {
    title: "ERP Solutions",
    subtitle: "ENTERPRISE SYSTEMS",
    body: "QTO's experience implementing and modernizing ERP systems for growing businesses spans finance, HR, inventory, and customer operations—helping teams move from spreadsheets and siloed tools to unified, scalable platforms.",
    modules: [
      { name: "Finance", description: "General ledger, AP/AR, financial reporting, and compliance-ready dashboards." },
      { name: "HR", description: "Payroll, attendance, org structure, and employee self-service workflows." },
      { name: "Inventory", description: "Warehousing, procurement, stock control, and real-time availability." },
      { name: "CRM Integration", description: "Customer data sync, sales pipeline hooks, and unified client views." },
    ],
    industries: [
      "Manufacturing",
      "Retail",
      "Healthcare",
      "Professional Services",
      "Logistics",
    ],
    legacyModernization: {
      title: "Legacy Modernization",
      body: "We help organizations migrate from older ERP systems, spreadsheets, and disconnected tools to modern, integrated platforms—preserving business logic while improving performance, visibility, and maintainability.",
    },
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
