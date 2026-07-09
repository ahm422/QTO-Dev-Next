import { slugify } from "../helpers";

/** Maps display names to simple-icons slug keys (see TechIcon.tsx). */
const TECH_ICON_KEYS: Record<string, string> = {
  "Next.js": "nextdotjs",
  React: "react",
  TypeScript: "typescript",
  "Node.js": "nodedotjs",
  "Tailwind CSS": "tailwindcss",
  Vercel: "vercel",
  PostgreSQL: "postgresql",
  MongoDB: "mongodb",
  Docker: "docker",
  Prisma: "prisma",
  Redis: "redis",
  GraphQL: "graphql",
  Stripe: "stripe",
  AWS: "amazonaws",
  Django: "django",
  Cloudflare: "cloudflare",
  D1: "cloudflare-d1",
  R2: "cloudflare-r2",
  Jenkins: "jenkins",
  Zod: "zod",
  Garage: "garage",
  Coolify: "coolify",
};

export function getTechIconKey(name: string): string {
  return TECH_ICON_KEYS[name] ?? slugify(name);
}
