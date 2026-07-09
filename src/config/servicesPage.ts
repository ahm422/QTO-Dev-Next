/**
 * Services page copy and section-level strings (issue #40).
 * CMS: services.page — edit in admin → Pages
 */

export const servicesPageConfig = {
  hero: {
    badge: "Services",
    heading: "Custom software, built to scale",
    subhead: "Web, mobile, cloud, and AI — end to end.",
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
  technologiesWeMaster: {
    subtitle: "TECH STACK",
    title: "Technologies We Master",
    titleHighlight: "Master",
    description:
      "We build with proven tools chosen for performance, developer velocity, and long-term maintainability.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
      "Vercel",
      "Prisma",
      "Redis",
      "GraphQL",
      "Stripe",
      "Django",
      "Cloudflare",
      "D1",
      "R2",
      "Jenkins",
      "Zod",
      "Garage",
      "Coolify",
    ],
  },
  whyChooseUs: {
    subtitle: "WHY CHOOSE US",
    title: "Why Partner With Us for Services",
    titleHighlight: "Partner",
    body: "We combine technical excellence with a partnership mindset. From discovery to launch and beyond, our team delivers custom software that scales with you—without compromise.",
    ctaLabel: "See our work",
    ctaHref: "/portfolio",
    cardLabel: "WHY QTO DEV",
    checklist: [
      "Agile delivery with transparent milestones",
      "Senior engineers on every project",
      "Post-launch support and maintenance",
      "Security-first architecture",
      "Dedicated single point of contact",
    ],
  },
  cta: {
    title: "Ready to Get Started?",
    description: "Let's discuss which service is right for your business.",
    primaryButtonText: "Schedule a Call",
    primaryButtonHref: "/contact",
  },
} as const;
