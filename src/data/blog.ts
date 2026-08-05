import { BlogPost } from "@/types/blog";
import { PEXELS_TECH_IMAGES } from "@/config/pexelsImages";
import { BLOG_NEWS_CATEGORY } from "@/config/blogCategories";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "getting-started-nextjs",
    title: "Getting Started with Next.js 14",
    description:
      "Learn how to build fast web applications with Next.js 14 and modern features like the App Router and Server Components.",
    excerpt:
      "Discover the latest features in Next.js 14 including App Router, Server Components, streaming, and production-ready defaults for modern product teams.",
    content: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 makes it easier to ship production-ready applications without stitching together routing, data fetching, and rendering strategies by hand. For product teams, that means faster iteration, clearer boundaries between server and client work, and better defaults for performance.</p>
      <p>Whether you are migrating a marketing site or building a multi-tenant SaaS product, the App Router gives you a consistent model for layouts, loading states, and nested routes that scale with your codebase.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Enhanced App Router with nested layouts and streaming</li>
        <li>Server Components by default for leaner client bundles</li>
        <li>Optimized image and font pipelines</li>
        <li>Strong TypeScript ergonomics out of the box</li>
      </ul>
      <h2>Getting Started</h2>
      <p>Start with Node.js 18+ and scaffold a project with the official CLI. Prefer TypeScript from day one so route params, search params, and server actions stay typed as the app grows.</p>
      <blockquote>Next.js makes it easy to create full-stack applications with flexibility where you need it.</blockquote>
      <h3>Installation</h3>
      <p>Use the create-next-app CLI to scaffold a new project:</p>
      <pre><code>npx create-next-app@latest my-app --typescript</code></pre>
      <p>From there, keep shared UI in a design system folder, colocate route-level data loaders with the page that needs them, and reserve client components for interactive islands only. That pattern keeps Core Web Vitals healthy while still allowing rich product UX.</p>
      <h2>What to prioritize in production</h2>
      <p>Instrument the critical path early: metadata for SEO, caching for CMS reads, and clear error boundaries for forms. Teams that treat Next.js as an application platform—not just a React bundler—usually ship cleaner releases and recover faster when something breaks.</p>
    `,
    author: "John Doe",
    publishedAt: "2024-02-15",
    updatedAt: "2024-02-15",
    featured: true,
    category: "Web Development",
    tags: ["Next.js", "React", "Tutorial"],
    image: PEXELS_TECH_IMAGES[0],
    coverImage: {
      url: PEXELS_TECH_IMAGES[0],
      alt: "Next.js development and modern web stack",
    },
    readingTime: 8,
  },
  {
    id: "2",
    slug: "performance-optimization-tips",
    title: "Web Performance Optimization Tips",
    description:
      "Essential techniques to make your website faster, more responsive, and more competitive in search.",
    excerpt:
      "Master essential performance optimization techniques to improve Core Web Vitals, perceived speed, and conversion on marketing and product surfaces.",
    content: `
      <h2>Why Performance Matters</h2>
      <p>Web performance is not only a technical KPI. Slow pages lose attention, lower conversion, and make SEO gains harder to defend. A fast experience also reduces support load because users make fewer mistakes in slow or janky interfaces.</p>
      <h3>Core Web Vitals</h3>
      <ul>
        <li>Largest Contentful Paint (LCP)</li>
        <li>Interaction to Next Paint (INP)</li>
        <li>Cumulative Layout Shift (CLS)</li>
      </ul>
      <h2>Optimization Strategies</h2>
      <p>Start with the largest wins: reduce render-blocking work, ship modern image formats, and avoid layout shifts from late-loading media. Then profile real user journeys—especially checkout, intake forms, and authenticated dashboards.</p>
      <blockquote>Performance is not just a technical concern; it directly impacts your bottom line.</blockquote>
      <h3>Image Optimization</h3>
      <p>Prefer responsive images, explicit dimensions, and formats like WebP or AVIF. Lazy-load below-the-fold media and reserve space so the page does not jump when assets arrive.</p>
      <h3>JavaScript budget</h3>
      <p>Every kilobyte of client JS competes with interactivity. Split routes, defer non-critical widgets, and keep analytics scripts from blocking first paint. Measure before and after with field data, not only Lighthouse lab scores.</p>
      <h2>A practical cadence</h2>
      <p>Bake performance checks into pull requests for high-traffic templates. When a regression slips through, treat it like a product bug: reproduce, measure, fix, and verify on staging before promoting.</p>
    `,
    author: "Jane Smith",
    publishedAt: "2024-02-10",
    updatedAt: "2024-02-10",
    featured: true,
    category: "Performance",
    tags: ["Performance", "Optimization", "Web Vitals"],
    image: PEXELS_TECH_IMAGES[1],
    coverImage: {
      url: PEXELS_TECH_IMAGES[1],
      alt: "Web performance and optimization",
    },
    readingTime: 12,
  },
  {
    id: "3",
    slug: "react-best-practices",
    title: "React Best Practices 2024",
    description:
      "Modern React patterns and best practices for building scalable, maintainable applications.",
    excerpt:
      "Learn practical React patterns for 2024—hooks, state boundaries, composition, and performance habits that keep large codebases understandable.",
    content: `
      <h2>React Best Practices</h2>
      <p>React has matured into a stable foundation for product UI. The teams that move fastest are not the ones chasing every new API—they are the ones with clear component boundaries, predictable data flow, and ruthless consistency in naming and file structure.</p>
      <h3>Functional Components</h3>
      <ul>
        <li>Prefer function components and hooks over class components</li>
        <li>Keep components small and focused on a single responsibility</li>
        <li>Lift state only as far as shared consumers need it</li>
      </ul>
      <h2>State Management</h2>
      <p>Start with local state and server data. Introduce a global store only when multiple distant trees share mutable client state. Over-centralizing early often creates more coupling than it removes.</p>
      <blockquote>Good state management is the foundation of a scalable React application.</blockquote>
      <h3>Performance Optimization</h3>
      <p>Use memoization tools when profiling shows wasteful re-renders—not by default. Premature memoization obscures intent and can hide real architectural problems.</p>
      <h2>Testing and accessibility</h2>
      <p>Cover critical flows with interaction tests, assert accessible names, and avoid snapshot-only suites. Accessible React is usually simpler React: semantic elements, keyboard paths, and honest loading states.</p>
      <p>Document component contracts in Storybook or equivalent when a pattern is reused across product areas. That reduces accidental prop sprawl and helps design and engineering share the same language for states like empty, loading, and error.</p>
    `,
    author: "Mike Johnson",
    publishedAt: "2024-02-05",
    updatedAt: "2024-02-05",
    featured: false,
    category: "React",
    tags: ["React", "Best Practices", "JavaScript"],
    image: PEXELS_TECH_IMAGES[2],
    coverImage: {
      url: PEXELS_TECH_IMAGES[2],
      alt: "React and front-end development",
    },
    readingTime: 10,
  },
  {
    id: "4",
    slug: "tailwind-css-guide",
    title: "Complete Guide to Tailwind CSS",
    description:
      "Master Tailwind CSS and build beautiful, consistent UIs with a utility-first workflow.",
    excerpt:
      "A practical guide to Tailwind CSS—utility-first styling, responsive design, design tokens, and habits that keep large UI systems maintainable.",
    content: `
      <h2>Introduction to Tailwind CSS</h2>
      <p>Tailwind CSS speeds up UI delivery by making design decisions explicit in markup. Used well, it creates consistency across marketing pages and product surfaces without a sprawling CSS architecture.</p>
      <h3>Key Concepts</h3>
      <ul>
        <li>Utility-first composition</li>
        <li>Responsive variants and container queries</li>
        <li>Design tokens via theme configuration</li>
        <li>Dark mode and semantic color roles</li>
      </ul>
      <h2>Getting Started</h2>
      <p>Install Tailwind, wire your content paths, and define a small set of brand tokens before inventing one-off values. Resist growing an infinite palette of custom colors—semantic roles scale better than raw hex dumps.</p>
      <blockquote>Tailwind CSS lets you build modern designs without leaving your HTML.</blockquote>
      <h3>Best Practices</h3>
      <p>Extract repeated patterns into components once a utility cluster appears three or more times. Keep spacing and typography on a shared scale so pages feel like one product instead of a collage of experiments.</p>
      <h2>Working with design systems</h2>
      <p>Pair Tailwind with a component library for buttons, forms, and dialogs. Utilities shine for layout and one-off composition; shared primitives protect accessibility and interaction details.</p>
      <p>When reviewing PRs, watch for magic numbers and one-off colors. Prefer tokens and existing spacing scales so the UI stays coherent as more people contribute. A short lint or design-token checklist beats long style debates later.</p>
    `,
    author: "Sarah Williams",
    publishedAt: "2024-01-30",
    updatedAt: "2024-01-30",
    featured: false,
    category: "CSS",
    tags: ["Tailwind CSS", "CSS", "Styling"],
    image: PEXELS_TECH_IMAGES[3],
    coverImage: {
      url: PEXELS_TECH_IMAGES[3],
      alt: "Tailwind CSS and modern UI styling",
    },
    readingTime: 15,
  },
  {
    id: "5",
    slug: "qto-dev-platform-launch",
    title: "QTO DEV Launches Next-Gen Delivery Platform",
    description:
      "Announcing our new delivery platform for faster builds and clearer client collaboration across every engagement.",
    excerpt:
      "We're rolling out a new delivery platform that tightens feedback loops, keeps milestones visible, and helps teams ship with less status churn.",
    content: `
      <h2>What's shipping</h2>
      <p>Today we are launching the next generation of our delivery platform—built for clarity from kickoff to handoff. Clients and delivery leads share one workspace for scope, milestones, reviews, and release notes.</p>
      <h3>Highlights</h3>
      <ul>
        <li>Live milestone tracking for every engagement</li>
        <li>Faster review cycles with shared workspaces</li>
        <li>Stronger security defaults across environments</li>
        <li>Clearer ownership for decisions and blockers</li>
      </ul>
      <h2>Why it matters</h2>
      <p>Status meetings should not be the source of truth. When progress is visible, teams spend less time reconstructing what happened last week and more time shipping the next increment. Clients get earlier signals when priorities need to change.</p>
      <blockquote>Better tooling means we spend more time building product and less time chasing status.</blockquote>
      <h2>How we will use it</h2>
      <p>New engagements start on the platform by default. Existing programs migrate in waves so we can preserve historical context while improving day-to-day collaboration. We will keep publishing lessons from the rollout as we learn.</p>
      <p>If you are an active client, your delivery lead will share the migration plan and what changes for weekly reviews. The goal is less status theater and more shared visibility into outcomes that matter.</p>
    `,
    author: "QTO DEV Team",
    publishedAt: "2024-03-12",
    updatedAt: "2024-03-12",
    featured: false,
    category: BLOG_NEWS_CATEGORY,
    tags: ["Company", "Product", "Announcement"],
    image: PEXELS_TECH_IMAGES[4],
    coverImage: {
      url: PEXELS_TECH_IMAGES[4],
      alt: "QTO DEV team launching a new platform",
    },
    readingTime: 4,
  },
  {
    id: "6",
    slug: "qto-dev-office-expansion",
    title: "QTO DEV Expands Engineering Capacity",
    description:
      "We're growing the engineering and delivery team to support more ambitious product builds across the region.",
    excerpt:
      "New engineering roles and studio capacity are coming online to support larger multi-product roadmaps without sacrificing craft.",
    content: `
      <h2>Growing with our clients</h2>
      <p>Demand for high-performance product builds continues to climb—so we are expanding capacity across engineering, design partnership, and delivery coordination. Growth only helps if quality stays high, which is why we are hiring carefully and investing in pairing practices.</p>
      <h3>What we're adding</h3>
      <ul>
        <li>Additional full-stack and platform engineers</li>
        <li>Dedicated QA and release coordination</li>
        <li>Stronger pairing between design and engineering</li>
        <li>More capacity for discovery and technical shaping</li>
      </ul>
      <h2>Looking ahead</h2>
      <p>Expect more published learnings from the build floor as the team scales: architecture notes, delivery retrospectives, and practical guides from real client work. If you are exploring a complex product roadmap, we would love to talk about how an expanded pod can support it.</p>
      <p>We are also tightening onboarding so new engineers ship meaningful work in their first weeks—paired delivery, shared checklists, and clear ownership of quality bars. That investment keeps growth from diluting the craft clients hire us for.</p>
      <blockquote>Capacity without craft is just headcount. We are expanding both.</blockquote>
      <h2>Open roles</h2>
      <p>If you care about product quality, honest estimates, and collaborative delivery, watch the careers page for openings across engineering, design partnership, and QA. We hire for judgment and communication as much as raw coding speed.</p>
    `,
    author: "QTO DEV Team",
    publishedAt: "2024-03-01",
    updatedAt: "2024-03-01",
    featured: false,
    category: BLOG_NEWS_CATEGORY,
    tags: ["Company", "Team", "Growth"],
    image: PEXELS_TECH_IMAGES[5],
    coverImage: {
      url: PEXELS_TECH_IMAGES[5],
      alt: "Engineering team collaboration at QTO DEV",
    },
    readingTime: 3,
  },
];
