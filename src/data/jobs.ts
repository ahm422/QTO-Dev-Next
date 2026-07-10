import type { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    workMode: "Remote-friendly",
    location: "Pakistan — core overlap GMT+5 (±3h OK)",
    employmentType: "Full-time",
    postedLabel: "Posted 18 Mar 2026",
    experience: "5+ years shipping production web products",
    compensationNote: "Competitive salary + annual review; hardware stipend",
    icon: "laptop-code",
    description:
      "Own the browser layer for client products: performance, accessibility, and a maintainable Next.js/React codebase our teams can scale.",
    roleSummary:
      "You’ll partner with design and backend engineers on greenfield builds and long-term product partnerships — not one-off brochure sites.",
    responsibilities: [
      "Lead feature delivery in Next.js (App Router), TypeScript, and Tailwind with a focus on UX quality and Core Web Vitals.",
      "Establish patterns for components, data fetching, error boundaries, and testing so delivery stays predictable as teams grow.",
      "Mentor mid-level engineers through pairing, reviews, and clear technical documentation.",
      "Work directly with stakeholders to translate fuzzy requirements into phased, shippable milestones.",
    ],
    requirements: [
      "Strong React + TypeScript; comfortable owning a route tree and shared UI kit.",
      "Experience with SSR/SSG concepts, caching, and pragmatic performance tuning.",
      "Practical API integration (REST/JSON); bonus if you’ve shipped tRPC or GraphQL consumers.",
      "Clear written English for async updates with distributed teams and clients.",
    ],
    tags: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    workMode: "Hybrid",
    location: "Lahore, Pakistan — 2 days / week on-site",
    employmentType: "Full-time",
    postedLabel: "Posted 12 Mar 2026",
    experience: "4+ years product / UX across web (mobile-responsive a plus)",
    compensationNote: "Competitive package; learning budget included",
    icon: "palette",
    description:
      "Shape end-to-end product experiences — from discovery workshops and IA to polished UI and handoff that engineers love to build.",
    roleSummary:
      "You’ll often be the bridge between client teams and engineering: facilitating decisions, documenting trade-offs, and keeping design debt low.",
    responsibilities: [
      "Run discovery sessions, synthesize research, and produce flows, wireframes, and high-fidelity UI aligned with brand systems.",
      "Maintain and evolve shared libraries (Figma), tokens, and patterns used across client engagements.",
      "Prototype interactions where they reduce risk (Figma, occasional lightweight HTML/CSS).",
      "Partner with engineers for accessible, responsive implementations and crisp QA before release.",
    ],
    requirements: [
      "Portfolio showing shipped SaaS or B2B products (not only marketing pages).",
      "Fluent Figma; comfortable with design systems, components, and variants.",
      "Understanding of accessibility basics (contrast, focus, semantics) and responsive layouts.",
      "Strong facilitation and async communication with technical and non-technical stakeholders.",
    ],
    tags: ["UX Research", "Figma", "Design Systems", "Accessibility"],
  },
  {
    id: "delivery-lead",
    title: "Delivery Lead / Project Manager",
    department: "Delivery",
    workMode: "Remote",
    location: "Pakistan — overlap with EU / GCC client hours as needed",
    employmentType: "Full-time",
    postedLabel: "Posted 05 Mar 2026",
    experience: "5+ years leading cross-functional software delivery",
    compensationNote: "Competitive salary; performance-based bonus eligible",
    icon: "users",
    description:
      "Steer multi-squad delivery for complex builds: clear plans, honest timelines, risk visibility, and calm communication under pressure.",
    roleSummary:
      "This is a client-facing lead role — you balance business outcomes, engineering reality, and team sustainability.",
    responsibilities: [
      "Own planning, RAID logs, and weekly rituals so teams stay unblocked and stakeholders stay informed.",
      "Translate contracts and statements of work into phased backlogs with measurable acceptance criteria.",
      "Coordinate QA, releases, and post-launch stabilization; escalate early when scope or timeline slips.",
      "Facilitate retros and process tweaks so each engagement leaves the team better than it started.",
    ],
    requirements: [
      "Proven track record delivering custom web/mobile products in agency or product-studio settings.",
      "Comfortable reading technical discussions (APIs, estimates) without needing to write production code.",
      "Exceptional written status updates, slide-ready summaries, and meeting discipline.",
      "Familiarity with agile fundamentals; certification is optional, outcomes matter more.",
    ],
    tags: ["Agile", "Stakeholder Management", "Planning", "Risk Management"],
  },
];
