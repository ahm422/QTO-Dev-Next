import type { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    workMode: "Remote-friendly",
    location: "Within GMT+3 to GMT+6 time zones",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@qtodev.com?subject=Application%20-%20Senior%20Frontend%20Engineer",
    description:
      "Lead modern frontend products in React and Next.js, partnering closely with designers and product stakeholders to ship polished, high-performing interfaces.",
    tags: ["React", "TypeScript", "Next.js"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    workMode: "Hybrid",
    location: "Lahore, Pakistan",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@qtodev.com?subject=Application%20-%20Product%20Designer",
    description:
      "Own the end-to-end product design process—from discovery and UX flows to refined UI, visual language, and design systems that scale.",
    tags: ["UX", "UI", "Design Systems"],
  },
  {
    id: "delivery-lead",
    title: "Delivery Lead / Project Manager",
    department: "Delivery",
    workMode: "Remote",
    location: "Within +/- 3h of GMT+5",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@qtodev.com?subject=Application%20-%20Delivery%20Lead%20%2F%20Project%20Manager",
    description:
      "Build trusted client partnerships and steer complex projects from kickoff to launch, keeping cross-functional teams aligned, unblocked, and shipping on time.",
    tags: ["Agile", "Client-facing", "Leadership"],
  },
];

