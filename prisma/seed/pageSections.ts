import { stringifyMetadata } from "@/lib/metadata";
import { prisma } from "./helpers";

const sections: { slug: string; label: string; data: Record<string, unknown> }[] = [
  // ─── HOMEPAGE ──────────────────────────────────────────────────────────────
  {
    slug: "homepage.hero",
    label: "Homepage — Hero",
    data: {
      badge: "Next-Gen Software Engineering",
      heading: "Architecting",
      headingHighlight: "Digital Futures",
      subtext:
        "We build robust, scalable software systems that power modern businesses—from cloud-native platforms to intelligent automation that drives measurable growth.",
      ctaPrimary: "Start Your Project",
      ctaPrimaryHref: "/contact",
      ctaSecondary: "Explore Capabilities",
      ctaSecondaryHref: "/services",
      trustedByLabel: "TRUSTED BY",
      terminalLines: [
        "> Initializing core systems...",
        "> Loading modules: React, Node.js, AWS...",
        "> Compiling assets [OK]",
        "> Server running on port 3000",
      ],
    },
  },
  {
    slug: "homepage.about-company",
    label: "Homepage — About QTO DEV",
    data: {
      subtitle: "About QTO DEV",
      title: "Navigating Tech Horizons Together",
      description:
        "We partner with businesses to build scalable technology solutions. From back-end systems to product design, we bring clarity and execution to every project.",
      tags: [] as Array<{ icon: string; label: string }>,
      exploreMoreLabel: "EXPLORE MORE",
      exploreMoreHref: "/about",
      stats: [
        { value: "200+", label: "Successful Projects Delivered" },
        { value: "150+", label: "Satisfied Clients Worldwide" },
        { value: "45+", label: "Skilled Professionals" },
      ],
    },
  },
  {
    slug: "homepage.build-something-real",
    label: "Homepage — Build Something Real (CTA)",
    data: {
      subtitle: "LET'S BUILD SOMETHING REAL",
      title: "Ready to build something exceptional?",
      titleHighlight: "exceptional?",
      description:
        "Join teams who ship faster with QTO DEV — from MVPs to scalable platforms. Let's discuss scope, timeline, and the best execution plan.",
      primaryCtaLabel: "Book a Consultation",
      primaryCtaHref: "/contact",
      primaryCtaSuffix: "It's Free",
      secondaryCtaLabel: "View Work",
      secondaryCtaHref: "/projects",
      benefits: [
        "80% long-term partnerships",
        "Weekly demos + transparent delivery",
        "Senior engineers + production-grade",
      ],
    },
  },
  {
    slug: "homepage.stats-header",
    label: "Homepage — Stats Section Header",
    data: {
      subtitle: "STATS & NUMBERS",
      title: "Our Impact in Numbers",
    },
  },
  {
    slug: "homepage.our-services",
    label: "Homepage — Our Services Section",
    data: {
      subtitle: "OUR SERVICES",
      title: "Top Custom Software Development Services",
      titleHighlight: "Software Development Services",
      description: "Turning your vision into reality with QTO's premium custom software solutions",
      learnMoreLabel: "Learn more →",
      exploreMoreLabel: "Explore more services",
    },
  },
  {
    slug: "homepage.portfolio",
    label: "Homepage — Featured Work Section",
    data: {
      subtitle: "OUR FEATURED WORK",
      title: "Our Featured Work",
      titleHighlight: "Featured",
      description: "",
      viewAllLabel: "View All -",
      viewAllHref: "/projects",
    },
  },
  {
    slug: "homepage.why-choose-us",
    label: "Homepage — Why Choose Us Section",
    data: {
      heading: "Why Choose Us?",
      body: "We combine technical excellence with a deep understanding of your business. From discovery to launch, our team delivers custom software that scales with you—without compromise.",
      ctaLabel: "See solutions",
      ctaHref: "/services",
      cardLabel: "WHY QTO DEV?",
    },
  },
  {
    slug: "homepage.testimonials",
    label: "Homepage — Testimonials Section",
    data: {
      subtitle: "TESTIMONIALS",
      title: "Success Stories From Our Clients",
      titleHighlight: "From Our Clients",
    },
  },
  {
    slug: "homepage.industries",
    label: "Homepage — Industries Section",
    data: {
      subtitle: "INDUSTRIES",
      title: "Industries We Serve",
      titleHighlight: null,
      prevLabel: "← Prev",
      nextLabel: "Next →",
      autoScrollIntervalMs: 4500,
      carouselAriaLabel: "Industries we serve",
    },
  },
  {
    slug: "homepage.engagement-models",
    label: "Homepage — Engagement Models Section",
    data: {
      subtitle: "ENGAGEMENT MODELS",
      title: "Choose the model that fits your pace",
      titleHighlight: "pace",
      description: "Simple engagement options designed for clarity, speed, and long-term partnership.",
      getStartedLabel: "Get Started",
      mostPopularLabel: "MOST POPULAR",
      contactBasePath: "/contact",
    },
  },
  {
    slug: "homepage.partner-up",
    label: "Homepage — Partner Up Section",
    data: {
      subtitle: "LET'S PARTNER UP",
      title: "What our Customers Say?",
      titleHighlight: "Customers Say?",
      introLine: "WE'RE JUST A MESSAGE AWAY!",
      bullet1: "We'll respond to you within 24 hours.",
      bullet2: "You'll be talking to product and tech experts.",
      formTitle: "Send Us a Message",
      nameLabel: "Full name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      messageLabel: "Message",
      namePlaceholder: "Enter full name",
      emailPlaceholder: "Enter your email",
      phonePlaceholder: "Your Phone",
      messagePlaceholder: "Enter your message…",
      ndaLabel: "This project requires an NDA",
      notBotLabel: "I'm not a bot",
      submitLabel: "Send us a message",
      locationLine1: "Islamabad, Pakistan",
      locationLine2: "Blue Area, P-10",
      phone: "+92 312 1234567",
      email: "hello@qtodev.com",
    },
  },
  {
    slug: "homepage.insights",
    label: "Homepage — Insights/Blog Section",
    data: {
      subtitle: "INSIGHTS",
      title: "Latest from Our Blog",
      description: "Thought leadership, technical deep dives, and industry trends curated by our team.",
      readMoreLabel: "Read More",
      readMoreCtaLabel: "Read More",
      viewAllPostsLabel: "View All Posts",
      authorLabel: "QTO DEV Team",
      emptyStateMessage: "No blog posts published yet. Check back soon.",
    },
  },
  {
    slug: "homepage.faqs-header",
    label: "Homepage — FAQs Section Header",
    data: {
      subtitle: "FAQs",
      title: "Frequently Asked Questions",
      description: "Clear answers to the most common questions. If you need anything else, we're one message away.",
    },
  },
  {
    slug: "homepage.featured-work",
    label: "Homepage — Featured Work Labels",
    data: {
      viewProjectLabel: "VIEW PROJECT",
      letsTalkLabel: "LET'S TALK +",
      footerLabel: "QTO DEV",
      contactHref: "/contact",
    },
  },

  // ─── SERVICES PAGE ─────────────────────────────────────────────────────────
  {
    slug: "services.page",
    label: "Services Page — All Sections",
    data: {
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
          "Next.js", "React", "TypeScript", "Node.js", "Tailwind CSS",
          "PostgreSQL", "MongoDB", "Docker", "AWS", "Vercel",
          "Prisma", "Redis", "GraphQL", "Stripe",
          "Django", "Cloudflare", "D1", "R2", "Jenkins", "Zod", "Garage", "Coolify",
        ],
      },
      whyChooseUs: {
        subtitle: "WHY CHOOSE US",
        title: "Why Partner With Us for Services",
        titleHighlight: "Partner",
        body: "We combine technical excellence with a partnership mindset. From discovery to launch and beyond, our team delivers custom software that scales with you—without compromise.",
        ctaLabel: "See our work",
        ctaHref: "/projects",
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
    },
  },

  // ─── ABOUT PAGE ────────────────────────────────────────────────────────────
  {
    slug: "about.page",
    label: "About Page — All Sections",
    data: {
      hero: {
        badge: "About QTO Dev",
        heading: "Engineering-led. Outcome-driven.",
        subhead:
          "We build secure, scalable systems that help teams move faster.",
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
        stats: [
          { label: "Founded", value: "2015" },
          { label: "Team Size", value: "45+" },
          { label: "Projects Delivered", value: "200+" },
        ],
        timeline: [
          {
            year: "2015",
            title: "Founded",
            description:
              "Started as a small engineering-led studio focused on solving hard problems the right way.",
          },
          {
            year: "2018",
            title: "Enterprise ERP",
            description:
              "Expanded into ERP implementations and legacy modernization for growing businesses.",
          },
          {
            year: "2022",
            title: "Global Clients",
            description:
              "Partnered with organizations across multiple industries and regions worldwide.",
          },
          {
            year: "Today",
            title: "Trusted Partner",
            description:
              "A mature delivery practice combining builder mindset with long-term client relationships.",
          },
        ],
        journeyNarrative:
          "Our journey began with a small team of engineers obsessed with solving hard problems the right way. Today, we combine that same builder mindset with mature delivery practices to help organizations modernize systems, launch new products, and create digital experiences that stand the test of time.",
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
        description: "Ready to partner with a team that cares about your success?",
        primaryButtonText: "Lets Chat Or Get In Touch",
        primaryButtonHref: "/contact",
      },
    },
  },

  // ─── BLOGS PAGE ────────────────────────────────────────────────────────────
  {
    slug: "blogs.page",
    label: "Blog Page — All Sections",
    data: {
      hero: {
        badge: "Blog",
        heading: "Ideas from the build floor",
        subhead:
          "Practical notes on development, performance, and product.",
        breadcrumbLabel: "Blog",
      },
      featured: {
        subtitle: "FEATURED",
        title: "Featured Articles",
        titleHighlight: "Featured",
        description: "Hand-picked reads on development, performance, and modern web.",
      },
      grid: {
        subtitle: "ALL POSTS",
        title: "Articles & Insights",
        titleHighlight: "Insights",
        description: "Browse all our posts on web development, React, performance, and more.",
      },
      filter: {
        allLabel: "All",
        searchPlaceholder: "Search articles...",
        activeTagLabel: "Tag",
        clearFiltersLabel: "Clear filters",
      },
      pagination: {
        pageSize: 9,
        prevLabel: "Previous",
        nextLabel: "Next",
        pageLabel: "Page",
        ofLabel: "of",
      },
      cta: {
        title: "Ready to Build Your Next Project?",
        description:
          "Turn ideas from our articles into real-world solutions with a team that ships high-performance software.",
        primaryButtonText: "Request a Free Consultation",
        primaryButtonHref: "/contact",
      },
    },
  },

  // ─── CAREERS PAGE ──────────────────────────────────────────────────────────
  {
    slug: "careers.page",
    label: "Careers Page — All Sections",
    data: {
      hero: {
        badge: "Careers",
        heading: "Build with a team that ships",
        subhead:
          "Join engineers and designers solving real client problems.",
        primaryCtaText: "View Open Roles",
        primaryCtaHref: "#open-roles",
        secondaryCtaText: "Open Career Portal",
        secondaryCtaHref:
          "https://career.qtohouse.com.pk/?utm_source=qto_dev_website&utm_medium=careers",
        breadcrumbLabel: "Careers",
      },
      whyWork: {
        subtitle: "WHY WORK WITH US",
        title: "Do Your Best Work With a Team That Has Your Back",
        titleHighlight: "Best Work",
        description:
          "We keep teams small, communication clear, and expectations realistic so you can focus on doing work you're proud of.",
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
          { title: "Competitive Compensation", body: "Market-aligned salaries with regular reviews based on impact, not just tenure." },
          { title: "Health Coverage", body: "Comprehensive medical coverage options for you and your family (location-dependent)." },
          { title: "Time Off That Actually Works", body: "Paid time off, local holidays, and end-of-year slowdown so you can properly recharge." },
          { title: "Learning Budget", body: "Annual budget for courses, books, conferences, or tooling that furthers your craft." },
          { title: "Home Office Setup", body: "Stipend for hardware and workspace so you can do your best work comfortably." },
          { title: "Flexible Hours", body: "Core collaboration windows with flexibility around how you structure the rest of your day." },
        ],
      },
      culture: {
        subtitle: "LIFE AT QTO DEV",
        title: "A Culture Built Around Craft, Ownership, and Trust",
        titleHighlight: "Culture",
        description:
          "We hire thoughtfully, trust people with real ownership, and keep meetings light so you can focus on shipping.",
        highlights: [
          { title: "Small, Senior-Heavy Teams", body: "Work closely with experienced people who care about craft and outcomes." },
          { title: "Bias Toward Shipping", body: "Clear priorities, quick iterations, and learning from real users." },
          { title: "Respectful Collaboration", body: "No egos, no heroics—just people who support each other and ship." },
        ],
      },
      cta: {
        title: "Ready to Apply?",
        description:
          "All applications are handled through the QTO House career portal. Create an account (or sign in) to apply for open roles and keep your profile up to date.",
        primaryButtonText: "Go to Career Portal",
        secondaryButtonText: "Learn About Our Work",
        secondaryButtonHref: "/projects",
      },
    },
  },

  // ─── PROJECTS PAGE ─────────────────────────────────────────────────────────
  {
    slug: "projects.page",
    label: "Projects Page — All Sections",
    data: {
      hero: {
        badge: "Our Work",
        heading: "Software that ships and lasts",
        subhead: "Selected work across industries and stacks.",
        breadcrumbLabel: "Projects",
      },
      grid: {
        subtitle: "CLIENT WORK",
        title: "Selected Client Work",
        titleHighlight: "Work",
        description:
          "A curated look at recent digital products and platforms we've designed, built, and scaled with our clients.",
        viewProjectLabel: "View project",
      },
      filter: { allLabel: "All" },
      valueSection: {
        subtitle: "WHY OUR WORK MATTERS",
        title: "What You Can Expect",
        titleHighlight: "Expect",
        description: "We deliver real impact with modern technology and a client-focused approach.",
        items: [
          { title: "Real impact", description: "Solutions that drive measurable business outcomes." },
          { title: "Modern stack", description: "Current technologies and best practices." },
          { title: "Client-focused", description: "Partnership from discovery through launch and beyond." },
        ],
      },
      cta: {
        title: "Want to See More?",
        description: "Check out our latest case studies and project insights.",
        primaryButtonText: "Contact Us",
        primaryButtonHref: "/contact",
      },
    },
  },

  // ─── CONTACT PAGE ──────────────────────────────────────────────────────────
  {
    slug: "contact.page",
    label: "Contact Page — Hero & Headings",
    data: {
      hero: {
        badge: "Contact",
        heading: "Let's talk about your project",
        subhead:
          "Tell us what you're building — we'll reply within one business day.",
        breadcrumbLabel: "Contact",
      },
      form: {
        sectionTitle: "Send Us a Message",
        sectionSubtitle: "Fill out the form below and we'll respond within 24 hours.",
      },
      cta: {
        title: "Ready to Start?",
        description: "Let's build something great together.",
        primaryButtonText: "Schedule a Call",
        primaryButtonHref: "/contact",
      },
    },
  },

  // ─── FAQS PAGE ─────────────────────────────────────────────────────────────
  {
    slug: "faqs.page",
    label: "FAQs Page — Hero",
    data: {
      hero: {
        heading: "Frequently Asked Questions",
        subhead: "Clear answers to the most common questions. If you need anything else, we're one message away.",
        breadcrumbLabel: "FAQs",
      },
    },
  },
];

export async function seedPageSections() {
  console.log("  Seeding page sections…");
  for (const section of sections) {
    await prisma.pageSection.upsert({
      where: { slug: section.slug },
      create: { slug: section.slug, label: section.label, data: stringifyMetadata(section.data) ?? "{}", isPublished: true },
      update: { label: section.label, data: stringifyMetadata(section.data) ?? "{}" },
    });
  }
  console.log(`  ✓ ${sections.length} page sections seeded`);
}
