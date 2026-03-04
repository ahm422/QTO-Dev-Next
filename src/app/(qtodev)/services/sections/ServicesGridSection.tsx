"use client";

import Link from "next/link";
import Image from "next/image";
import { services } from "@/data/services";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";
import { servicesPageConfig } from "@/config/servicesPage";

const HEADING_ID = "services-grid-heading";

export function ServicesGridSection() {
  const { grid } = servicesPageConfig;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[520px] h-[360px] rounded-full bg-primary/[0.05] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[420px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={grid.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={grid.title}
              titleHighlight={grid.titleHighlight}
              description={grid.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {services.map((service) => (
              <div key={service.id} data-reveal>
                <Card
                  className={cn(
                    "group relative p-8 md:p-9 h-full flex flex-col rounded-2xl overflow-hidden",
                    "border-t-4 border-t-primary",
                    "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10",
                    "transition-all duration-300 hover:-translate-y-1",
                    "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-muted focus-within:outline-none"
                  )}
                >
                  {/* Background image with gradient overlay */}
                  {service.image && (
                    <div
                      className="pointer-events-none absolute inset-0 -z-10"
                      aria-hidden
                    >
                      <Image
                        src={service.image}
                        alt={service.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-surface/95 via-surface/92 to-surface/90 group-hover:from-surface/90 group-hover:via-surface/85 group-hover:to-surface/85 transition-colors duration-300" />
                    </div>
                  )}
                  {/* Subtle corner gradient on hover */}
                  <div
                    className="pointer-events-none absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden
                  />
                  <div className="relative">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6",
                        "transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary/15"
                      )}
                    >
                      <AppIcon
                        name={service.icon as AppIconName}
                        size="xl"
                        className="shrink-0"
                      />
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 font-heading tracking-tight text-foreground">
                      {service.title}
                    </h2>
                    <p className="text-foreground-muted mb-6 flex-1 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mb-8">
                      <h3 className="font-semibold mb-4 text-foreground">Key Features</h3>
                      <ul className="space-y-3">
                        {service.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-foreground-muted"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/services/${service.slug}`}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 w-full rounded-xl",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      )}
                    >
                      <Button
                        variant="default"
                        size="default"
                        className="w-full inline-flex items-center justify-center gap-2 group/btn shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      >
                        {grid.learnMoreLabel}
                        <AppIcon
                          name="arrow-right"
                          size="sm"
                          className="shrink-0 ml-1 opacity-80 group-hover/btn:translate-x-0.5 transition-transform"
                        />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
