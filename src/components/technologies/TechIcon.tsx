"use client";

import {
  SiNextdotjs, SiNextdotjsHex,
  SiReact, SiReactHex,
  SiTypescript, SiTypescriptHex,
  SiNodedotjs, SiNodedotjsHex,
  SiTailwindcss, SiTailwindcssHex,
  SiVercel, SiVercelHex,
  SiPostgresql, SiPostgresqlHex,
  SiMongodb, SiMongodbHex,
  SiDocker, SiDockerHex,
  SiPrisma, SiPrismaHex,
  SiRedis, SiRedisHex,
  SiGraphql, SiGraphqlHex,
  SiStripe, SiStripeHex,
  SiDjango, SiDjangoHex,
  SiCloudflare, SiCloudflareHex,
  SiJenkins, SiJenkinsHex,
  SiZod, SiZodHex,
} from "@icons-pack/react-simple-icons";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { catalogByKey, catalogByName } from "@/lib/technologies/techCatalog";
import { CUSTOM_TECH_ICONS } from "@/components/technologies/CustomTechIcons";

type SiIcon = React.ComponentType<{ size?: number; color?: string; title?: string }>;

/**
 * Curated, statically-imported subset of `@icons-pack/react-simple-icons` matching
 * `TECH_CATALOG` (see prisma/seed/data/techIconKeys.ts, the source of truth for seeded
 * Technology rows). Explicit imports (vs. `import * as SimpleIcons`) let the bundler
 * tree-shake the other ~3,200 icons out of the Worker bundle — see issue #408.
 * Any iconKey outside this set falls back to the letter-avatar below, same as it always
 * has for icon keys unresolvable via simple-icons.
 */
const SIMPLE_ICONS: Record<string, SiIcon> = {
  nextdotjs: SiNextdotjs,
  react: SiReact,
  typescript: SiTypescript,
  nodedotjs: SiNodedotjs,
  tailwindcss: SiTailwindcss,
  vercel: SiVercel,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  docker: SiDocker,
  prisma: SiPrisma,
  redis: SiRedis,
  graphql: SiGraphql,
  stripe: SiStripe,
  django: SiDjango,
  cloudflare: SiCloudflare,
  jenkins: SiJenkins,
  zod: SiZod,
};

const SIMPLE_ICON_HEX: Record<string, string> = {
  nextdotjs: SiNextdotjsHex,
  react: SiReactHex,
  typescript: SiTypescriptHex,
  nodedotjs: SiNodedotjsHex,
  tailwindcss: SiTailwindcssHex,
  vercel: SiVercelHex,
  postgresql: SiPostgresqlHex,
  mongodb: SiMongodbHex,
  docker: SiDockerHex,
  prisma: SiPrismaHex,
  redis: SiRedisHex,
  graphql: SiGraphqlHex,
  stripe: SiStripeHex,
  django: SiDjangoHex,
  cloudflare: SiCloudflareHex,
  jenkins: SiJenkinsHex,
  zod: SiZodHex,
};

export function resolveSimpleIcon(iconKey: string): SiIcon | undefined {
  return SIMPLE_ICONS[iconKey];
}

export function resolveSimpleIconColor(iconKey: string): string | undefined {
  return SIMPLE_ICON_HEX[iconKey];
}

/** Brand color from techCatalog first, then simple-icons hex. */
export function resolveTechColor(tech: string, iconKey?: string): string {
  const entry = iconKey ? catalogByKey[iconKey] : catalogByName[tech];
  if (entry?.brandColor) return entry.brandColor;
  const resolvedKey = entry?.iconKey ?? iconKey;
  if (resolvedKey) {
    const hex = resolveSimpleIconColor(resolvedKey);
    if (hex) return hex;
  }
  return "currentColor";
}

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
  const resolvedKey = entry?.iconKey ?? iconKey;

  if (resolvedKey === "amazonaws" || tech === "AWS") {
    return (
      <div className={iconWrapperBase} aria-hidden>
        <AppIcon name="cloud" size="lg" />
      </div>
    );
  }

  if (resolvedKey && CUSTOM_TECH_ICONS[resolvedKey]) {
    const CustomIcon = CUSTOM_TECH_ICONS[resolvedKey]!;
    return (
      <div className={iconWrapperBase} aria-hidden>
        <CustomIcon title={tech} />
      </div>
    );
  }

  const Icon = resolvedKey ? resolveSimpleIcon(resolvedKey) : undefined;

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
