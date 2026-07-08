import { Service } from "@/types/service";
import { getServiceCardImage } from "@/config/serviceCardImages";

function cardImage(slug: string) {
  const { src, alt } = getServiceCardImage(slug);
  return { image: src, imageAlt: alt };
}

export const services: Service[] = [
  {
    id: "1",
    slug: "web-development",
    title: "Web Development",
    shortDescription:
      "Custom web applications built with modern frameworks and cloud-ready architecture. We ship fast, SEO-friendly products that scale with traffic and your roadmap. From PWAs to real-time platforms, performance stays first.",
    description:
      "We build fast, scalable web applications that deliver exceptional user experiences. From progressive web apps to real-time platforms, our full-stack expertise ensures your product is performant, SEO-ready, and built to grow with your business.",
    icon: "laptop-code",
    features: [
      "Responsive Design",
      "Performance Optimization",
      "SEO Friendly",
      "Scalable Architecture",
    ],
    relatedProjects: ["1", "2"],
    bulletColumns: [
      [
        "Progressive Web Apps",
        "Real-time Applications",
        "Performance Optimization",
      ],
      ["SPA & MPA Architecture", "API Development", "SEO-Ready"],
    ],
    technologyTags: ["React", "Next.js", "TypeScript", "Node.js", "Python"],
    ...cardImage("web-development"),
  },
  {
    id: "2",
    slug: "mobile-development",
    title: "Mobile App Development",
    shortDescription:
      "Native and cross-platform apps that feel at home on iOS and Android. We cover concept through store deployment with a focus on performance and offline support. Backend sync and push stay integrated from day one.",
    description:
      "We deliver native and cross-platform mobile apps that feel at home on iOS and Android. From concept to App Store deployment, we focus on performance, offline support, and seamless integration with your backend.",
    icon: "mobile-screen",
    features: [
      "Cross-Platform Development",
      "Native Performance",
      "App Store Deployment",
      "Push Notifications",
    ],
    relatedProjects: ["3"],
    bulletColumns: [
      ["Cross-Platform (iOS & Android)", "Native Performance", "App Store Ready"],
      ["Push Notifications", "Offline Support", "Real-time Sync"],
    ],
    technologyTags: ["React Native", "Swift", "Kotlin", "Flutter"],
    ...cardImage("mobile-development"),
  },
  {
    id: "3",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    shortDescription:
      "Interfaces users love and that convert. Research, wireframes, and prototypes feed into accessible design systems your teams can ship against. Beautiful products that stay inclusive and on-brand.",
    description:
      "We craft interfaces that users love and that drive conversion. Our process blends user research, wireframing, and prototyping with accessibility and design systems so your product is both beautiful and inclusive.",
    icon: "palette",
    features: [
      "User Research",
      "Wireframing & Prototyping",
      "Design Systems",
      "Accessibility",
    ],
    relatedProjects: ["1", "2"],
    bulletColumns: [
      ["User Research & Testing", "Wireframing & Prototyping", "Design Systems"],
      ["Accessibility (a11y)", "Conversion Optimization", "Visual Design"],
    ],
    technologyTags: ["Figma", "Adobe XD", "Prototyping", "Design Systems"],
    ...cardImage("ui-ux-design"),
  },
  {
    id: "4",
    slug: "consulting",
    title: "Technical Consulting",
    shortDescription:
      "Expert guidance on stack selection, architecture review, and performance audits. We help cut technical debt and align technology with business goals. Decisions stay practical and evidence-based.",
    description:
      "Get expert guidance on technology stack selection, architecture review, and performance audits. We help you make informed decisions, reduce technical debt, and align technology with your business goals.",
    icon: "chart-line",
    features: [
      "Architecture Review",
      "Performance Audit",
      "Security Assessment",
      "Technology Strategy",
    ],
    relatedProjects: ["4"],
    bulletColumns: [
      ["Architecture Review", "Performance Audit", "Security Assessment"],
      ["Technology Strategy", "Code Review", "Best Practices"],
    ],
    technologyTags: ["Architecture", "DevOps", "Security", "Strategy"],
    ...cardImage("consulting"),
  },
  {
    id: "5",
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    shortDescription:
      "Reliable infrastructure so teams ship faster and systems stay secure. Cloud migration, CI/CD, and IaC with observability baked in. DevOps practices that reduce cost and risk.",
    description:
      "We design and operate reliable, scalable infrastructure so your teams can ship faster and your systems stay secure. From cloud migration to CI/CD pipelines, we bring DevOps best practices to your stack.",
    icon: "cloud",
    features: [
      "Cloud Migration",
      "CI/CD Pipelines",
      "Infrastructure as Code",
      "Monitoring & Observability",
    ],
    relatedProjects: [],
    bulletColumns: [
      ["Cloud Migration (AWS, GCP, Azure)", "CI/CD Pipelines", "Infrastructure as Code"],
      ["Monitoring & Observability", "Container Orchestration", "Cost Optimization"],
    ],
    technologyTags: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    ...cardImage("cloud-devops"),
  },
  {
    id: "6",
    slug: "ai-machine-learning",
    title: "Generative AI",
    shortDescription:
      "Intelligent features powered by your data, ML, and LLMs. From recommendations to custom models, we integrate AI that is practical and scalable. Real business value over buzzwords.",
    description:
      "We build intelligent features and ML-powered products that leverage your data. From recommendation engines to custom models, we help you integrate AI in a practical, scalable way that delivers real business value.",
    icon: "robot",
    features: [
      "Custom ML Models",
      "Data Pipelines",
      "Recommendation Systems",
      "Model Deployment & MLOps",
    ],
    relatedProjects: [],
    bulletColumns: [
      ["Custom ML Models", "Data Pipelines", "Recommendation Systems"],
      ["NLP & Computer Vision", "Model Deployment", "MLOps"],
    ],
    technologyTags: ["Python", "TensorFlow", "PyTorch", "MLOps", "LLMs"],
    ...cardImage("ai-machine-learning"),
  },
];
