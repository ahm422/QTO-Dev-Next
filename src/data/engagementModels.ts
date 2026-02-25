import type { EngagementModel } from "@/types/engagementModel";

/**
 * Engagement model items for the homepage Engagement Models section (issue #30).
 */
export const engagementModelItems: EngagementModel[] = [
  {
    optionNumber: "OPTION 1",
    title: "Fixed Price",
    description: "Best for well-defined projects with clear scope.",
    features: [
      "Defined scope & timeline",
      "Milestone-based payments",
      "Change request process",
      "Ideal for MVPs",
    ],
    isPopular: false,
    getStartedHref: "/contact?model=fixed-price",
  },
  {
    optionNumber: "OPTION 2",
    title: "Hourly",
    description: "Flexible engagement for evolving requirements.",
    features: [
      "Pay for hours worked",
      "Weekly time reports",
      "Scale up or down anytime",
      "Ideal for ongoing work",
    ],
    isPopular: false,
    getStartedHref: "/contact?model=hourly",
  },
  {
    optionNumber: "OPTION 3",
    title: "Dedicated Team",
    description: "Your own engineering team, fully managed.",
    features: [
      "Handpicked team members",
      "Full-time commitment",
      "Direct communication",
      "Ideal for long-term projects",
    ],
    isPopular: true,
    getStartedHref: "/contact?model=dedicated-team",
  },
  {
    optionNumber: "OPTION 4",
    title: "Retainer",
    description: "Reserved capacity for continuous development.",
    features: [
      "Monthly hour blocks",
      "Priority scheduling",
      "Rollover unused hours",
      "Ideal for partnerships",
    ],
    isPopular: false,
    getStartedHref: "/contact?model=retainer",
  },
];
