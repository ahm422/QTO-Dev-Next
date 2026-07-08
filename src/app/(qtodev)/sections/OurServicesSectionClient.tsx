"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ourServicesConfig } from "@/config/ourServices";
type OurServicesConfigType = typeof ourServicesConfig;
import type { Service } from "@/types/service";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";

const HEADING_ID = "our-services-heading";

export function OurServicesSectionClient({
  services,
  config,
}: {
  readonly services: Service[];
  readonly config?: OurServicesConfigType;
}) {
  const cfg = config ?? ourServicesConfig;
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
              subtitle={cfg.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              subtitlePill
              title={cfg.title}
              titleHighlight={cfg.titleHighlight}
              description={cfg.description}
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
                <ServiceCard
                  key={service.id}
                  service={service}
                  variant="compact"
                  learnMoreLabel="Learn more"
                />
              ))}
            </div>
          </div>

          <div data-reveal className="mt-10 flex justify-center">
            <Link
              href="/services"
              className={cn(
                "group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm sm:text-base font-semibold",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
              )}
            >
              {cfg.exploreMoreLabel}
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
