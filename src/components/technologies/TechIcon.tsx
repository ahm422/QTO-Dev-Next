"use client";

import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiTailwindcss,
  SiVercel,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiPrisma,
  SiRedis,
  SiGraphql,
  SiStripe,
} from "@icons-pack/react-simple-icons";
import { AppIcon } from "@/components/ui/shared/AppIcon";

export const techIconMap: Record<
  string,
  React.ComponentType<{ size?: number; color?: string; title?: string }>
> = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  "Node.js": SiNodedotjs,
  "Tailwind CSS": SiTailwindcss,
  Vercel: SiVercel,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Docker: SiDocker,
  Prisma: SiPrisma,
  Redis: SiRedis,
  GraphQL: SiGraphql,
  Stripe: SiStripe,
};

/** Brand colors for hover state — set --tech-color on a .group parent to use. */
export const techBrandColors: Record<string, string> = {
  "Next.js": "#000000",
  React: "#61DAFB",
  TypeScript: "#3178C6",
  "Node.js": "#339933",
  "Tailwind CSS": "#06B6D4",
  Vercel: "#000000",
  PostgreSQL: "#4169E1",
  MongoDB: "#47A248",
  Docker: "#2496ED",
  AWS: "#FF9900",
  Prisma: "#2D3748",
  Redis: "#DC382D",
  GraphQL: "#E10098",
  Stripe: "#635BFF",
};

const iconWrapperBase =
  "flex h-14 w-14 items-center justify-center rounded-2xl p-2.5 ring-1 transition-all duration-300 ease-out [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-8 [&_svg]:max-w-8 " +
  "bg-surface-muted/90 ring-border/80 dark:bg-white/10 dark:ring-white/10 " +
  "group-hover:scale-110 group-hover:bg-surface-muted group-hover:dark:bg-white/20 group-hover:ring-[var(--tech-glow,theme(colors.border))] " +
  "group-hover:shadow-[0_0_28px_-6px_var(--tech-color)] " +
  "text-foreground group-hover:text-[var(--tech-color,currentColor)]";

export function TechIcon({ tech }: { tech: string }) {
  if (tech === "AWS") {
    return (
      <div className={iconWrapperBase} aria-hidden>
        <AppIcon name="cloud" size="lg" />
      </div>
    );
  }
  const Icon = techIconMap[tech];
  if (!Icon) {
    return (
      <div
        className={`${iconWrapperBase} text-2xl font-bold text-foreground-muted`}
        aria-hidden
      >
        {tech.charAt(0)}
      </div>
    );
  }
  return (
    <div className={iconWrapperBase} aria-hidden>
      <Icon size={28} color="currentColor" title={tech} />
    </div>
  );
}
