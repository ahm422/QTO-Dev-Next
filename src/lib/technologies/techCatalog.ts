export interface TechCatalogEntry {
  name: string
  iconKey: string
  brandColor: string
}

export const TECH_CATALOG: TechCatalogEntry[] = [
  { name: "Next.js",      iconKey: "nextdotjs",   brandColor: "#000000" },
  { name: "React",        iconKey: "react",        brandColor: "#61DAFB" },
  { name: "TypeScript",   iconKey: "typescript",   brandColor: "#3178C6" },
  { name: "Node.js",      iconKey: "nodedotjs",    brandColor: "#339933" },
  { name: "Tailwind CSS", iconKey: "tailwindcss",  brandColor: "#06B6D4" },
  { name: "Vercel",       iconKey: "vercel",       brandColor: "#000000" },
  { name: "PostgreSQL",   iconKey: "postgresql",   brandColor: "#4169E1" },
  { name: "MongoDB",      iconKey: "mongodb",      brandColor: "#47A248" },
  { name: "Docker",       iconKey: "docker",       brandColor: "#2496ED" },
  { name: "AWS",          iconKey: "amazonaws",    brandColor: "#FF9900" },
  { name: "Prisma",       iconKey: "prisma",       brandColor: "#2D3748" },
  { name: "Redis",        iconKey: "redis",        brandColor: "#DC382D" },
  { name: "GraphQL",      iconKey: "graphql",      brandColor: "#E10098" },
  { name: "Stripe",       iconKey: "stripe",       brandColor: "#635BFF" },
]

export const catalogByKey: Record<string, TechCatalogEntry> = Object.fromEntries(
  TECH_CATALOG.map((e) => [e.iconKey, e])
)

export const catalogByName: Record<string, TechCatalogEntry> = Object.fromEntries(
  TECH_CATALOG.map((e) => [e.name, e])
)
