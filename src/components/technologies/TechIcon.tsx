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
import { catalogByKey, catalogByName } from "@/lib/technologies/techCatalog";

type SiIcon = React.ComponentType<{ size?: number; color?: string; title?: string }>;

const SI_ICON_MAP: Record<string, SiIcon> = {
  nextdotjs:   SiNextdotjs,
  react:       SiReact,
  typescript:  SiTypescript,
  nodedotjs:   SiNodedotjs,
  tailwindcss: SiTailwindcss,
  vercel:      SiVercel,
  postgresql:  SiPostgresql,
  mongodb:     SiMongodb,
  docker:      SiDocker,
  prisma:      SiPrisma,
  redis:       SiRedis,
  graphql:     SiGraphql,
  stripe:      SiStripe,
};

export const techBrandColors: Record<string, string> = Object.fromEntries(
  Object.values(catalogByName).map((e) => [e.name, e.brandColor])
);

const iconWrapperBase =
  "flex h-14 w-14 items-center justify-center rounded-2xl p-2.5 ring-1 transition-all duration-300 ease-out [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-8 [&_svg]:max-w-8 " +
  "bg-surface-muted/90 ring-border/80 dark:bg-white/10 dark:ring-white/10 " +
  "group-hover:scale-110 group-hover:bg-surface-muted group-hover:dark:bg-white/20 group-hover:ring-[var(--tech-glow,theme(colors.border))] " +
  "group-hover:shadow-[0_0_28px_-6px_var(--tech-color)] " +
  "text-foreground group-hover:text-[var(--tech-color,currentColor)]";

export function TechIcon({ tech, iconKey }: { tech: string; iconKey?: string }) {
  const entry = iconKey ? catalogByKey[iconKey] : catalogByName[tech];

  if (entry?.iconKey === "amazonaws" || tech === "AWS") {
    return (
      <div className={iconWrapperBase} aria-hidden>
        <AppIcon name="cloud" size="lg" />
      </div>
    );
  }

  const Icon = entry ? SI_ICON_MAP[entry.iconKey] : undefined;

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

export { SI_ICON_MAP };
