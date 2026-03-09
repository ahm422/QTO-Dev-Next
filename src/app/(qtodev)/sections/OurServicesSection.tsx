"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ourServicesConfig } from "@/config/ourServices";
import { services } from "@/data/services";
import type { Service } from "@/types/service";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "our-services-heading";

function getLearnMoreHref(service: Service): string {
  return service.learnMoreHref ?? `/services/${service.slug}`;
}

export function OurServicesSection() {
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
        className="pointer-events-none absolute top-0 right-0 w-[480px] h-[320px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[280px] rounded-full bg-primary/[0.03] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={ourServicesConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={ourServicesConfig.title}
              titleHighlight={ourServicesConfig.titleHighlight}
              description={ourServicesConfig.description}
              headingId={HEADING_ID}
            />
          </div>

          <div
            data-reveal
            className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,1.25fr] lg:gap-14"
          >
            {/* Service category grid: 2×3 */}
            <div
              aria-label="Service categories"
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={getLearnMoreHref(service)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border-2 p-5 sm:p-6 flex flex-col items-center justify-center text-center",
                    "min-h-[130px] sm:min-h-[150px] transition-all duration-200",
                    "bg-surface border-border/60 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
                  )}
                >
                  {service.image && (
                    <div
                      className="pointer-events-none absolute inset-0 -z-10"
                      aria-hidden
                    >
                      <Image
                        src={service.image}
                        alt={service.imageAlt ?? ""}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-surface/95 via-surface/92 to-surface/90 group-hover:from-surface/90 group-hover:via-surface/85 group-hover:to-surface/85 transition-colors duration-300" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <span
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                        "bg-surface-muted text-foreground-muted group-hover:text-primary group-hover:bg-primary/15"
                      )}
                    >
                      <AppIcon
                        name={service.icon as AppIconName}
                        size="lg"
                        className="shrink-0"
                      />
                    </span>
                    <span className="font-semibold text-foreground text-sm sm:text-base leading-tight">
                      {service.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div
            data-reveal
            className="mt-10 flex justify-center"
          >
            <Link
              href="/services"
              className={cn(
                "group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm sm:text-base font-semibold",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
              )}
            >
              {ourServicesConfig.exploreMoreLabel}
              <span className="inline-flex items-center justify-center rounded-full bg-primary-foreground/15 p-1">
                <AppIcon
                  name="arrow-right"
                  size="sm"
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
