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
import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { AppIcon } from "@/components/ui/shared/AppIcon";

interface TechStackStripProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
}

const techIconMap: Record<string, React.ComponentType<{ size?: number; color?: string; title?: string }>> = {
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

function TechIcon({ tech }: { tech: string }) {
  if (tech === "AWS") {
    return (
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-primary/80 ring-1 ring-black/[0.03]"
        aria-hidden
      >
        <AppIcon name="cloud" size="lg" />
      </div>
    );
  }
  const Icon = techIconMap[tech];
  if (!Icon) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-2xl font-bold text-foreground-muted ring-1 ring-black/[0.03]">
        {tech.charAt(0)}
      </div>
    );
  }
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted/80 p-2 ring-1 ring-black/[0.03] [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-7 [&_svg]:max-w-7"
      aria-hidden
    >
      <Icon size={28} color="default" title={tech} />
    </div>
  );
}

export function TechStackStrip({ service }: TechStackStripProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24 bg-background" aria-labelledby="tech-stack-heading">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/[0.04] blur-3xl"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal>
            <SectionHeader
              subtitle="Technologies"
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title="Technologies we master"
              description="Selected for performance, developer velocity, and long-term maintainability."
              headingId="tech-stack-heading"
              centered={false}
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {service.technologies.map((tech) => (
              <div
                key={tech}
                data-reveal
                className="flex flex-col items-center rounded-xl border border-border bg-surface p-4 text-center shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:ring-primary/10 focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                <div className="mb-3 flex items-center justify-center">
                  <TechIcon tech={tech} />
                </div>
                <p className="text-xs font-medium text-foreground-muted">{tech}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
