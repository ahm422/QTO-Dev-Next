"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ourServicesConfig } from "@/config/ourServices";
import type { Service } from "@/types/service";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "our-services-heading";

function getLearnMoreHref(service: Service): string {
  return service.learnMoreHref ?? `/services/${service.slug}`;
}

export function OurServicesSectionClient({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <section
        className={cn(
          "relative overflow-hidden py-24 md:py-32",
          "bg-surface-muted border-y border-border"
        )}
        aria-labelledby={HEADING_ID}
      >
        <Container>
          <p className="text-center text-foreground-muted">
            Services will appear here once published in the CMS.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
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
            <div
              aria-label="Service categories"
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={getLearnMoreHref(service)}
                  className={cn(
                    "group relative flex min-h-[130px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-border/60 bg-surface p-5 text-center sm:min-h-[150px] sm:p-6",
                    "shadow-sm shadow-black/[0.03] transition-all duration-300",
                    "hover:-translate-y-1 hover:border-primary/45 hover:shadow-lg hover:shadow-primary/[0.08]",
                    "ring-0 ring-transparent hover:ring-1 hover:ring-primary/15",
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
                        "mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                        "bg-surface-muted text-foreground-muted shadow-inner",
                        "group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-primary/10"
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
