"use client";

import { WebDevelopmentServiceData } from "@/content/services/web-development";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Reveal } from "@/components/animations/Reveal";
import { TechIcon, techBrandColors } from "@/components/technologies/TechIcon";

interface TechStackStripProps {
  service: WebDevelopmentServiceData;
  blurDataURL: string;
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
                className="group flex flex-col items-center rounded-2xl border border-border/80 bg-surface/80 p-5 text-center shadow-md shadow-black/[0.03] ring-1 ring-black/[0.02] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12),0_0_0_1px_var(--tech-glow),0_0_32px_-8px_var(--tech-glow)] dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4),0_0_0_1px_var(--tech-glow),0_0_32px_-8px_var(--tech-glow)] hover:ring-[var(--tech-glow)] focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background"
                style={
                  {
                    "--tech-color": techBrandColors[tech] ?? "currentColor",
                    "--tech-glow":
                      "color-mix(in srgb, var(--tech-color) 18%, transparent)",
                  } as React.CSSProperties
                }
              >
                <div className="mb-3 flex items-center justify-center">
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
