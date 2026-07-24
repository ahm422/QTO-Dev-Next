import type { Project, TechCategory } from "./types";
import { DEFAULT_APPROACH_STEPS } from "./types";
import { PEXELS_TECH_IMAGES } from "@/config/pexelsImages";

const defaultServices = [
  "Product Discovery",
  "UI/UX Design",
  "Full-Stack Web App",
  "QA & Testing",
];

function defaultTechByCategory(techStack: string[]): TechCategory[] {
  return [{ category: "Technologies", items: techStack }];
}

function brandProject(input: {
  slug: string;
  title: string;
  subtitle: string;
  industry: string;
  type: string;
  client: string;
  audience: string;
  overview: string;
  scope: string;
  techStack: string[];
  techByCategory?: TechCategory[];
  problem: string[];
  solution: string[];
  outcomes: string[];
  featureTitle: string;
  featureBullets: string[];
  featureBenefit: string;
  imageIndex: number;
  related: Array<{ slug: string; title: string; summary: string; thumbIndex: number }>;
}): Project {
  const hero = PEXELS_TECH_IMAGES[input.imageIndex] ?? PEXELS_TECH_IMAGES[0];
  return {
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    heroImage: { url: hero, alt: `${input.title} product overview` },
    chips: [
      { label: "Industry", value: input.industry },
      { label: "Type", value: input.type },
      { label: "Duration", value: "4–6 Months" },
      { label: "Delivery", value: "Dedicated Product Team" },
    ],
    about: {
      overview: input.overview,
      scope: input.scope,
      client: input.client,
      audience: input.audience,
    },
    services: defaultServices,
    techStack: input.techStack,
    techByCategory: input.techByCategory ?? defaultTechByCategory(input.techStack),
    team: "Product Manager + Designer + 2–3 Engineers + QA",
    timeline: "16–24 weeks",
    problem: input.problem,
    solution: input.solution,
    outcomes: input.outcomes,
    features: [
      {
        title: input.featureTitle,
        bullets: input.featureBullets,
        benefit: input.featureBenefit,
        image: { url: hero, alt: `${input.title} — ${input.featureTitle}` },
      },
      {
        title: "Platform Foundations",
        bullets: ["Secure authentication", "Responsive UI", "Operational reporting"],
        benefit: "A maintainable base for the next product cycle.",
        image: { url: hero, alt: `${input.title} foundations` },
      },
      {
        title: "Integrations",
        bullets: ["API-first connectors", "Reliable data sync", "Admin controls"],
        benefit: "Teams work from one connected system of record.",
        image: { url: hero, alt: `${input.title} integrations` },
      },
      {
        title: "Launch Readiness",
        bullets: ["QA coverage for critical flows", "Monitoring hooks", "Handover docs"],
        benefit: "Go-live with clear ownership and fewer surprises.",
        image: { url: hero, alt: `${input.title} launch readiness` },
      },
    ],
    approach: {
      title: "Technology & Development Approach",
      steps: [...DEFAULT_APPROACH_STEPS],
    },
    relatedProjects: input.related.map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      thumbnail: PEXELS_TECH_IMAGES[r.thumbIndex] ?? PEXELS_TECH_IMAGES[0],
    })),
    demoUrl: `/contact?intent=request-demo&project=${input.slug}`,
  };
}

export const finflowProject = brandProject({
  slug: "finflow-inc",
  title: "FinFlow Inc.",
  subtitle: "Payment infrastructure and analytics that cut reconciliation time for finance teams.",
  industry: "Fintech",
  type: "SaaS Web Platform",
  client: "FinFlow Inc.",
  audience: "Finance operations and treasury teams",
  overview:
    "FinFlow partnered with QtoDev to replace fragmented payment tooling with a unified infrastructure and analytics layer for reconciliation and real-time reporting.",
  scope: "Product strategy, UX/UI, full-stack engineering, payments integrations, and launch support.",
  techStack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
  problem: [
    "Reconciliation lived in spreadsheets across banks and processors.",
    "Finance leaders lacked real-time visibility into cash and exceptions.",
    "Reporting cycles were manual and error-prone at month-end.",
  ],
  solution: [
    "Designed a payment operations dashboard with exception queues and ownership.",
    "Integrated processors and bank feeds into a normalized ledger model.",
    "Automated reconciliation rules and scheduled finance reports.",
  ],
  outcomes: [
    "Faster daily reconciliation with fewer manual matches.",
    "Real-time exception visibility for ops and finance leads.",
    "Month-end reporting reduced from days of spreadsheet work to scheduled exports.",
  ],
  featureTitle: "Reconciliation Command Center",
  featureBullets: [
    "Unified ledger across processors and bank accounts",
    "Exception queues with assignee and SLA tracking",
    "Scheduled reports for controllers and auditors",
  ],
  featureBenefit: "Finance teams close books faster with fewer surprises.",
  imageIndex: 0,
  related: [
    { slug: "shopverse", title: "ShopVerse", summary: "Headless commerce and custom checkout.", thumbIndex: 2 },
    { slug: "lahebo-grc-platform", title: "Lahebo GRC Platform", summary: "Compliance workflows and audit readiness.", thumbIndex: 0 },
  ],
});

export const meditrackProject = brandProject({
  slug: "meditrack-health",
  title: "MediTrack Health",
  subtitle: "Secure patient and wellness tracking for clinics and telehealth teams.",
  industry: "Healthcare",
  type: "Web + Mobile Platform",
  client: "MediTrack Health",
  audience: "Clinicians, care coordinators, and patients",
  overview:
    "MediTrack needed a secure platform for patient records, wellness tracking, and care coordination across clinics and telehealth.",
  scope: "Discovery, UX, web and mobile delivery, secure data model, and HIPAA-minded practices.",
  techStack: ["React Native", "Next.js", "Node.js", "PostgreSQL", "AWS"],
  problem: [
    "Patient data was split across EHR exports and messaging tools.",
    "Care plans were hard to share between clinic and telehealth staff.",
    "Patients lacked a clear view of progress and next steps.",
  ],
  solution: [
    "Built role-based access for clinics, coordinators, and patients.",
    "Centralized care plans, notes, and wellness metrics in one timeline.",
    "Shipped mobile experiences for patients and on-the-go clinicians.",
  ],
  outcomes: [
    "Care teams coordinate from a single patient timeline.",
    "Patients engage more consistently with assigned wellness plans.",
    "Fewer handoff errors between clinic and telehealth visits.",
  ],
  featureTitle: "Care Coordination Hub",
  featureBullets: [
    "Shared patient timeline across roles",
    "Secure messaging and task assignments",
    "Wellness metrics with progress alerts",
  ],
  featureBenefit: "Clinics deliver coordinated care without chasing files.",
  imageIndex: 1,
  related: [
    { slug: "learnhub-education", title: "LearnHub Education", summary: "LMS with assessments and certifications.", thumbIndex: 5 },
    { slug: "finflow-inc", title: "FinFlow Inc.", summary: "Payment analytics for finance teams.", thumbIndex: 0 },
  ],
});

export const shopverseProject = brandProject({
  slug: "shopverse",
  title: "ShopVerse",
  subtitle: "Headless commerce built for brands scaling checkout and inventory.",
  industry: "E-commerce",
  type: "Headless Commerce",
  client: "ShopVerse",
  audience: "DTC brands and commerce operators",
  overview:
    "ShopVerse partnered with QtoDev to launch a headless storefront with custom checkout, inventory sync, and multi-channel selling.",
  scope: "Storefront UX, checkout architecture, inventory integrations, and performance tuning.",
  techStack: ["Next.js", "Shopify Hydrogen", "Node.js", "Redis", "Stripe"],
  problem: [
    "Monolithic themes blocked custom checkout experiments.",
    "Inventory drifted across channels during peak campaigns.",
    "Page speed and conversion lagged behind brand goals.",
  ],
  solution: [
    "Delivered a headless storefront with composable checkout steps.",
    "Synced inventory across web and marketplace channels.",
    "Optimized critical paths for Core Web Vitals and conversion.",
  ],
  outcomes: [
    "Higher conversion on optimized checkout flows.",
    "Fewer oversell incidents during campaigns.",
    "Faster storefront performance on key category pages.",
  ],
  featureTitle: "Composable Checkout",
  featureBullets: [
    "Modular checkout steps and payment methods",
    "Real-time inventory checks before purchase",
    "Campaign-ready merchandising blocks",
  ],
  featureBenefit: "Brands ship commerce experiments without replatforming every season.",
  imageIndex: 2,
  related: [
    { slug: "finflow-inc", title: "FinFlow Inc.", summary: "Payment infrastructure and reconciliation.", thumbIndex: 0 },
    { slug: "propwise-realty", title: "PropWise Realty", summary: "Listings and deal management.", thumbIndex: 4 },
  ],
});

export const greenchainProject = brandProject({
  slug: "greenchain-logistics",
  title: "GreenChain Logistics",
  subtitle: "Supply-chain visibility and route optimization that cuts emissions and delays.",
  industry: "Logistics",
  type: "Operations Platform",
  client: "GreenChain Logistics",
  audience: "Fleet operators and logistics planners",
  overview:
    "GreenChain needed end-to-end visibility and smarter routing so fleets could cut emissions while hitting delivery windows.",
  scope: "Ops discovery, mapping UX, routing services, and real-time tracking dashboards.",
  techStack: ["Next.js", "TypeScript", "PostgreSQL", "Mapbox", "AWS"],
  problem: [
    "Dispatchers lacked a single view of shipments and handoffs.",
    "Routes were planned manually with little emissions awareness.",
    "Customers got delayed ETAs without proactive updates.",
  ],
  solution: [
    "Built a live operations map with shipment and fleet status.",
    "Introduced route optimization with emissions and SLA constraints.",
    "Automated customer ETA updates from tracking events.",
  ],
  outcomes: [
    "Shorter average delivery times on optimized routes.",
    "Measurable reduction in empty miles and emissions.",
    "Fewer “where is my order” support tickets.",
  ],
  featureTitle: "Fleet Visibility Map",
  featureBullets: [
    "Live shipment and vehicle positions",
    "Route plans with SLA and emissions scoring",
    "Automated ETA notifications to customers",
  ],
  featureBenefit: "Operators run greener fleets without sacrificing on-time delivery.",
  imageIndex: 3,
  related: [
    { slug: "shopverse", title: "ShopVerse", summary: "Headless commerce at scale.", thumbIndex: 2 },
    { slug: "meditrack-health", title: "MediTrack Health", summary: "Care coordination platform.", thumbIndex: 1 },
  ],
});

export const propwiseProject = brandProject({
  slug: "propwise-realty",
  title: "PropWise Realty",
  subtitle: "Listings, virtual tours, and deal pipelines from search to closing.",
  industry: "Real Estate",
  type: "Marketplace + CRM",
  client: "PropWise Realty",
  audience: "Agents, developers, and home buyers",
  overview:
    "PropWise wanted one product for listings, virtual tours, and deal management so agents stop juggling disconnected tools.",
  scope: "Marketplace UX, media pipelines, CRM workflows, and SEO-friendly listing pages.",
  techStack: ["Next.js", "Tailwind CSS", "PostgreSQL", "Cloudinary", "Vercel"],
  problem: [
    "Listings, tours, and CRM lived in separate vendor tools.",
    "Buyers dropped off between inquiry and showing.",
    "Developers lacked a clean pipeline view of deals.",
  ],
  solution: [
    "Unified listings with embedded virtual tours and inquiry forms.",
    "Added deal stages with tasks for agents and developers.",
    "Shipped fast, SEO-ready property pages for discovery.",
  ],
  outcomes: [
    "Higher inquiry-to-showing conversion on featured listings.",
    "Agents manage deals without leaving the platform.",
    "Developers see pipeline health across projects.",
  ],
  featureTitle: "Deal Pipeline Board",
  featureBullets: [
    "Stages from inquiry to closing",
    "Tour scheduling linked to listings",
    "Document checklist per deal",
  ],
  featureBenefit: "Agents close more deals with less tool-switching.",
  imageIndex: 4,
  related: [
    { slug: "learnhub-education", title: "LearnHub Education", summary: "Course platform for training teams.", thumbIndex: 5 },
    { slug: "greenchain-logistics", title: "GreenChain Logistics", summary: "Fleet visibility and routing.", thumbIndex: 3 },
  ],
});

export const learnhubProject = brandProject({
  slug: "learnhub-education",
  title: "LearnHub Education",
  subtitle: "LMS with courses, assessments, progress tracking, and certifications.",
  industry: "Education",
  type: "Learning Platform",
  client: "LearnHub Education",
  audience: "Schools, training providers, and learners",
  overview:
    "LearnHub needed a modern LMS for courses, assessments, progress tracking, and certifications for schools and corporate training.",
  scope: "Curriculum UX, video and assessment flows, reporting, and certification issuance.",
  techStack: ["Next.js", "TypeScript", "PostgreSQL", "Mux", "Tailwind CSS"],
  problem: [
    "Legacy LMS UX frustrated both instructors and learners.",
    "Progress and assessment data were hard to report on.",
    "Certificates were issued manually after course completion.",
  ],
  solution: [
    "Designed a clear learner journey from enroll to certificate.",
    "Built assessments with progress dashboards for instructors.",
    "Automated certificate generation on completion rules.",
  ],
  outcomes: [
    "Higher course completion rates on redesigned paths.",
    "Instructors see cohort progress without exports.",
    "Certificates issue automatically when learners qualify.",
  ],
  featureTitle: "Learner Progress Dashboard",
  featureBullets: [
    "Module and assessment completion tracking",
    "Instructor cohort views and alerts",
    "Automated certificate templates",
  ],
  featureBenefit: "Training providers scale programs without manual admin work.",
  imageIndex: 5,
  related: [
    { slug: "meditrack-health", title: "MediTrack Health", summary: "Patient and wellness tracking.", thumbIndex: 1 },
    { slug: "propwise-realty", title: "PropWise Realty", summary: "Listings and deal management.", thumbIndex: 4 },
  ],
});

export const brandProjects: Project[] = [
  finflowProject,
  meditrackProject,
  shopverseProject,
  greenchainProject,
  propwiseProject,
  learnhubProject,
];
