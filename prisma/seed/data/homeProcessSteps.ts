import type { WorkProcessStep } from "@/types/service";

/** Mirrors homepage HowWeWorkSection steps (not in src/data). */
export const homeProcessSteps: WorkProcessStep[] = [
  {
    order: 1,
    title: "Requirements Gathering",
    description:
      "We dig into your goals, users, and constraints to define a clear problem statement and success metrics.",
    icon: "magnifying-glass",
  },
  {
    order: 2,
    title: "Design",
    description:
      "We translate strategy into UX flows, interface designs, and technical approach that align with your brand.",
    icon: "palette",
  },
  {
    order: 3,
    title: "Development",
    description:
      "Our engineers build in small, reviewable increments with clean, testable code and transparent progress.",
    icon: "laptop-code",
  },
  {
    order: 4,
    title: "QA & Testing",
    description:
      "We validate functionality, performance, and accessibility across devices before anything goes near production.",
    icon: "flask-vial",
  },
  {
    order: 5,
    title: "Deployment",
    description:
      "We coordinate releases, monitoring, and rollback plans so going live feels controlled—not chaotic.",
    icon: "rocket",
  },
  {
    order: 6,
    title: "Support",
    description:
      "Post-launch, we stay close with fixes, enhancements, and roadmap guidance as your product grows.",
    icon: "gear",
  },
];
