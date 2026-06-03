"use client";

import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { TechIcon, techBrandColors } from "@/components/technologies/TechIcon";
import { servicesPageConfig } from "@/config/servicesPage";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "services-technologies-heading";

export function ServicesTechnologiesSectionClient({
  technologies,
}: {
  technologies: string[];
}) {
  if (technologies.length === 0) return null;
  const { technologiesWeMaster } = servicesPageConfig;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-background border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Gradient orbs for depth */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/[0.03] blur-3xl translate-y-1/2 translate-x-1/4"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/3 left-0 w-64 h-64 rounded-full bg-primary/[0.04] blur-3xl -translate-x-1/4"
        aria-hidden
      />

      <Container size="xl" className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={technologiesWeMaster.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={technologiesWeMaster.title}
              titleHighlight={technologiesWeMaster.titleHighlight}
              description={technologiesWeMaster.description}
              headingId={HEADING_ID}
            />
          </div>

          <div
            className={cn(
              "grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
              "sm:gap-6"
            )}
          >
            {technologies.map((tech) => (
              <div
                key={tech}
                data-reveal
                className={cn(
                  "group flex flex-col items-center rounded-2xl border border-border/80 bg-surface/80 p-5 sm:p-6 text-center",
                  "shadow-md shadow-black/[0.03] ring-1 ring-black/[0.02]",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12),0_0_0_1px_var(--tech-glow),0_0_32px_-8px_var(--tech-glow)]",
                  "dark:shadow-black/20 dark:ring-white/[0.04] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4),0_0_0_1px_var(--tech-glow),0_0_32px_-8px_var(--tech-glow)]",
                  "focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
                )}
                style={
                  {
                    "--tech-color": techBrandColors[tech] ?? "currentColor",
                    "--tech-glow":
                      "color-mix(in srgb, var(--tech-color) 18%, transparent)",
                  } as React.CSSProperties
                }
              >
                <div className="mb-4 flex items-center justify-center">
                  <TechIcon tech={tech} />
                </div>
                <p className="text-sm font-medium text-foreground-muted transition-all duration-300 group-hover:text-foreground group-hover:tracking-wide">
                  {tech}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
