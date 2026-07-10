/** CMS: careers.page — edit in admin → Pages */
export const careersPageConfig = {
  hero: {
    badge: "Careers",
    heading: "Build with a team that ships",
    subhead:
      "Join engineers and designers solving real client problems.",
    primaryCtaText: "View Open Roles",
    primaryCtaHref: "#open-roles",
    breadcrumbLabel: "Careers",
  },
  whyWork: {
    subtitle: "WHY WORK WITH US",
    title: "Do Your Best Work With a Team That Has Your Back",
    titleHighlight: "Best Work",
    description:
      "We keep teams small, communication clear, and expectations realistic so you can focus on doing work you’re proud of.",
    items: [
      {
        title: "Impactful Client Work",
        body: "Ship products and platforms that solve real problems for startups and established companies—not just internal tools.",
        icon: "sparkles",
      },
      {
        title: "Growth & Mentorship",
        body: "Pairing, reviews, and honest feedback to help you level up your craft without politics or drama.",
        icon: "arrow-trending-up",
      },
      {
        title: "Flexible, Remote-Friendly",
        body: "We work with clear overlap hours and async-friendly practices so you can do deep work and still have a life.",
        icon: "globe",
      },
      {
        title: "Modern Stack",
        body: "TypeScript, Next.js, Tailwind, and a thoughtful toolbox—no legacy monoliths as your day job.",
        icon: "layers",
      },
    ],
  },
  benefits: {
    subtitle: "BENEFITS & PERKS",
    title: "Support That Goes Beyond Salary",
    titleHighlight: "Beyond",
    description:
      "We offer a mix of financial, learning, and lifestyle benefits designed to keep you healthy, supported, and excited about your work.",
    items: [
      {
        title: "Competitive Compensation",
        body: "Market-aligned salaries with regular reviews based on impact, not just tenure.",
        icon: "star",
      },
      {
        title: "Health Coverage",
        body: "Comprehensive medical coverage options for you and your family (location-dependent).",
        icon: "heart",
      },
      {
        title: "Time Off That Actually Works",
        body: "Paid time off, local holidays, and end-of-year slowdown so you can properly recharge.",
        icon: "calendar",
      },
      {
        title: "Learning Budget",
        body: "Annual budget for courses, books, conferences, or tooling that furthers your craft.",
        icon: "lightbulb",
      },
      {
        title: "Home Office Setup",
        body: "Stipend for hardware and workspace so you can do your best work comfortably.",
        icon: "laptop-code",
      },
      {
        title: "Flexible Hours",
        body: "Core collaboration windows with flexibility around how you structure the rest of your day.",
        icon: "clock",
      },
    ],
  },
  culture: {
    subtitle: "LIFE AT QTO DEV",
    title: "A Culture Built Around Craft, Ownership, and Trust",
    titleHighlight: "Culture",
    description:
      "We hire thoughtfully, trust people with real ownership, and keep meetings light so you can focus on shipping.",
    highlights: [
      {
        title: "Small, Senior-Heavy Teams",
        body: "Work closely with experienced people who care about craft and outcomes.",
      },
      {
        title: "Bias Toward Shipping",
        body: "Clear priorities, quick iterations, and learning from real users.",
      },
      {
        title: "Respectful Collaboration",
        body: "No egos, no heroics—just people who support each other and ship.",
      },
    ],
  },
  cta: {
    title: "Ready to Apply?",
    description:
      "Browse open roles below and apply directly on this site. We review every application and will be in touch if there's a fit.",
    primaryButtonText: "Browse Open Roles",
    primaryButtonHref: "#open-roles",
    secondaryButtonText: "Learn About Our Work",
    secondaryButtonHref: "/projects",
  },
} as const;

export type CareersPageConfig = typeof careersPageConfig;

const PORTAL_HOST = "career.qtohouse.com.pk";

function isPortalHref(href?: string | null): boolean {
  if (!href) return false;
  return href.includes(PORTAL_HOST);
}

/** Merge CMS careers.page with code defaults; strip stale portal CTAs from saved CMS rows. */
export function resolveCareersPageConfig(
  cms: CareersPageConfig | null | undefined
): CareersPageConfig {
  if (!cms) return careersPageConfig;

  const heroMerged = { ...careersPageConfig.hero, ...cms.hero } as Record<string, unknown>;
  delete heroMerged.secondaryCtaText;
  delete heroMerged.secondaryCtaHref;
  const heroBase = heroMerged as CareersPageConfig["hero"];

  const ctaFromCms = cms.cta ?? careersPageConfig.cta;
  const cta = {
    ...careersPageConfig.cta,
    ...ctaFromCms,
    description: careersPageConfig.cta.description,
    primaryButtonText: careersPageConfig.cta.primaryButtonText,
    primaryButtonHref: isPortalHref(ctaFromCms.primaryButtonHref)
      ? careersPageConfig.cta.primaryButtonHref
      : (ctaFromCms.primaryButtonHref ?? careersPageConfig.cta.primaryButtonHref),
  };

  return {
    ...careersPageConfig,
    ...cms,
    hero: heroBase,
    cta,
  };
}

