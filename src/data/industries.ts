import type { IndustryItem } from "@/types/industry";

/**
 * Industries we serve for the homepage carousel (issue #28).
 */
export const industriesItems: IndustryItem[] = [
  {
    id: "fintech",
    title: "FinTech",
    number: "01.",
    description:
      "Payments, wallets, lending, dashboards, compliance ready systems.",
    icon: "building",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    number: "02.",
    description:
      "Patient portals, EHR integration, telemedicine, and health analytics.",
    icon: "heart",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    number: "03.",
    description:
      "Marketplaces, checkout flows, inventory, and omnichannel retail.",
    icon: "cart",
  },
  {
    id: "travel",
    title: "Travel",
    number: "04.",
    description:
      "Booking engines, loyalty programs, and travel management platforms.",
    icon: "plane",
  },
  {
    id: "saas",
    title: "SaaS",
    number: "05.",
    description:
      "Subscriptions, dashboards, and scalable multi-tenant products.",
    icon: "monitor",
  },
  {
    id: "logistics",
    title: "Logistics",
    number: "06.",
    description:
      "Fleet, warehousing, last-mile delivery, and supply chain visibility.",
    icon: "rocket",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    number: "07.",
    description:
      "Listings, CRM, virtual tours, and property management systems.",
    icon: "globe",
  },
  {
    id: "education",
    title: "Education",
    number: "08.",
    description:
      "LMS, assessments, and learning analytics for institutions.",
    icon: "chart",
  },
];
