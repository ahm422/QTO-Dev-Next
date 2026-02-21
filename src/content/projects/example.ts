import { Project } from "./types";

export const laheboProject: Project = {
  slug: "lahebo-grc-platform",
  title: "Lahebo GRC Platform",
  subtitle: "Reduced compliance cycle time and improved audit readiness across distributed teams.",
  heroImage: {
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=900&fit=crop",
    alt: "Lahebo GRC platform shown across desktop, tablet, and mobile screens",
  },
  chips: [
    { label: "Industry", value: "Governance, Risk & Compliance" },
    { label: "Type", value: "SaaS Web Platform" },
    { label: "Duration", value: "6 Months" },
    { label: "Delivery", value: "Dedicated Product Team" },
  ],
  about: {
    overview:
      "Lahebo partnered with QtoDev to modernize their legacy compliance workflows into a unified digital platform that enables real-time risk visibility, policy tracking, and audit evidence management.",
    scope:
      "Product strategy, UX/UI design, frontend and backend engineering, QA automation, and deployment pipeline setup.",
    client: "Lahebo",
    audience: "Compliance managers, risk officers, and operations leaders",
  },
  services: ["Product Discovery", "UI/UX Design", "Full-Stack Web App", "QA & Testing", "Cloud DevOps"],
  techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Tailwind CSS", "AWS"],
  team: "Product Manager + UX Designer + 2 Frontend Devs + 2 Backend Devs + QA",
  timeline: "24 weeks",
  problem: [
    "Manual spreadsheet-driven controls created inconsistent reporting and delayed audits.",
    "Risk data lived in isolated tools, making cross-team accountability difficult.",
    "Executives lacked clear visibility into compliance posture and remediation progress.",
  ],
  solution: [
    "Designed a role-based dashboard for real-time compliance and risk monitoring.",
    "Implemented workflow automation for evidence collection and policy approvals.",
    "Built centralized risk registers with ownership, priority, and SLA tracking.",
    "Created downloadable audit-ready reports and structured activity logs.",
    "Integrated notifications and reminders to increase completion rates.",
  ],
  outcomes: [
    "45% faster internal audit preparation across core teams.",
    "30% improvement in on-time remediation task completion.",
    "Executive reporting shifted from weekly manual updates to real-time dashboards.",
  ],
  features: [
    {
      title: "Compliance Command Center",
      bullets: [
        "Real-time KPI tiles for controls, incidents, and pending tasks",
        "Configurable widgets by role and department",
        "Drill-down by framework, team, and due date",
      ],
      benefit: "Decision-makers get instant clarity on compliance health and urgent actions.",
      image: {
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800&fit=crop",
        alt: "Dashboard showing compliance KPIs and risk indicators",
      },
    },
    {
      title: "Audit Evidence Workflows",
      bullets: [
        "Automated reminders for evidence submission",
        "Approval queues with timestamps and ownership",
        "Versioned document storage with traceable history",
      ],
      benefit: "Audits run faster with complete, verifiable records in one place.",
      image: {
        url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
        alt: "Workflow screen for audit evidence approvals and tracking",
      },
    },
    {
      title: "Risk Register & Action Plans",
      bullets: [
        "Unified risk register with impact and likelihood scoring",
        "Owner assignment and remediation deadlines",
        "Escalation rules for breached SLAs",
      ],
      benefit: "Teams reduce compliance risk by acting earlier and with clearer accountability.",
      image: {
        url: "https://images.unsplash.com/photo-1551281044-8b9a20f1d4d8?w=1200&h=800&fit=crop",
        alt: "Risk register table with status, owners, and due dates",
      },
    },
  ],
  approach: {
    title: "How We Built It",
    steps: [
      "Discovery workshops mapped business goals, constraints, and key user journeys.",
      "Rapid wireframing validated workflows before development.",
      "Sprint-based delivery shipped modular features every 2 weeks.",
      "Structured QA and UAT reduced regressions before launch.",
    ],
    challenges: [
      "Legacy data quality varied across teams, requiring normalization pipelines.",
      "Multiple stakeholder groups needed tailored dashboards and permissions.",
    ],
  },
  technologiesLogos: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Tailwind CSS"],
  testimonial: {
    quote:
      "QtoDev transformed our compliance process into a product our teams actually use daily. Their delivery speed and strategic thinking exceeded expectations.",
    name: "A. Rahman",
    role: "Head of Risk & Compliance",
    company: "Lahebo",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
  },
  relatedProjects: [
    {
      slug: "saas-dashboard",
      title: "SaaS Analytics Dashboard",
      summary: "Real-time operational analytics for leadership teams.",
      thumbnail: "https://images.unsplash.com/photo-1516534775068-bb57e5ab928e?w=900&h=600&fit=crop",
    },
    {
      slug: "ecommerce-platform",
      title: "E-commerce Platform Redesign",
      summary: "Conversion-focused redesign with improved checkout flow.",
      thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=900&h=600&fit=crop",
    },
    {
      slug: "startup-website",
      title: "Tech Startup Website",
      summary: "High-performance marketing site built for lead generation.",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop",
    },
  ],
  pdfDownloadUrl: "/assets/case-studies/lahebo-case-study.pdf",
  demoUrl: "/contact?intent=request-demo&project=lahebo-grc-platform",
};