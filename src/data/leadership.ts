import { staticImageUrl } from "@/config/staticImages";

export interface LeadershipMember {
  id: string;
  name: string;
  designation: string;
  imageUrl?: string;
  bio?: string;
  linkedIn?: string;
}

export const leadershipTeam: LeadershipMember[] = [
  {
    id: "ceo",
    name: "Muhammad Ahmad Mustafa",
    designation: "Chief Executive Officer",
    imageUrl: staticImageUrl("/images/optimized/ceo-portrait-800.webp"),
    bio: "Provides strategic direction for QTO Development and builds long-term partnerships with key clients.",
  },
  {
    id: "frontend-lead",
    name: "Muhammad Adeel",
    designation: "Frontend Lead",
    imageUrl: staticImageUrl("/images/Frontend1.JPG"),
    bio: "Leads frontend engineering, ensuring modern, performant, and accessible user interfaces.",
  },
  {
    id: "backend-lead",
    name: "Danish Irfan",
    designation: "Backend Lead",
    imageUrl: staticImageUrl("/images/Backend1.JPG"),
    bio: "Oversees backend systems, APIs, and data integrations to keep platforms robust and scalable.",
  },
  {
    id: "it-team",
    name: "QTO Dev IT Team",
    designation: "Core Engineering Team",
    imageUrl: staticImageUrl("/images/it-team-2.JPG"),
    bio: "The broader IT team collaborating across frontend, backend, and operations to deliver reliable digital solutions.",
  },
];
