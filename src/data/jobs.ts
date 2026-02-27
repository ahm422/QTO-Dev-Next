import type { Job } from "@/types/job";

export const jobs: Job[] = [
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote-friendly · GMT+3 to GMT+6",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@qtodev.com?subject=Application%20-%20Senior%20Frontend%20Engineer",
    description:
      "Lead frontend projects using React and Next.js, collaborating closely with designers and product stakeholders.",
    tags: ["React", "TypeScript", "Next.js"],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Hybrid · Lahore, Pakistan",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@qtodev.com?subject=Application%20-%20Product%20Designer",
    description:
      "Design end-to-end product experiences from discovery and UX flows to visual design and design systems.",
    tags: ["UX", "UI", "Design Systems"],
  },
  {
    id: "delivery-lead",
    title: "Delivery Lead / Project Manager",
    department: "Delivery",
    location: "Remote · Within +/- 3h of GMT+5",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@qtodev.com?subject=Application%20-%20Delivery%20Lead%20%2F%20Project%20Manager",
    description:
      "Own client relationships and delivery outcomes across multiple projects, keeping teams aligned and shipping on time.",
    tags: ["Agile", "Client-facing", "Leadership"],
  },
];

