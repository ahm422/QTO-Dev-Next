"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { servicesPageConfig } from "@/config/servicesPage";
import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { BenefitCard } from "@/components/why-choose-us/BenefitCard";
import { cn } from "@/components/theme/cn";

type ServicesPageConfigType = typeof servicesPageConfig;

const HEADING_ID = "services-why-choose-us-heading";

const DEFAULT_CHECKLIST = [
  "Agile delivery with transparent milestones",
  "Senior engineers on every project",
  "Post-launch support and maintenance",
  "Security-first architecture",
  "Dedicated single point of contact",
];

export function ServicesWhyChooseUsSectionClient({
  items,
  config,
}: {
  items: WhyChooseUsItem[];
  config?: ServicesPageConfigType;
}) {
  if (items.length === 0) return null;

  const cfg = config ?? servicesPageConfig;
  const whyChooseUsCfg = cfg.whyChooseUs;
  const checklist = whyChooseUsCfg.checklist ?? DEFAULT_CHECKLIST;

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-primary/[0.05] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
            <div className="flex flex-col gap-6" data-reveal>
              <SectionHeader
                subtitle={whyChooseUsCfg.subtitle}
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={whyChooseUsCfg.title}
                titleHighlight={whyChooseUsCfg.titleHighlight}
                description={whyChooseUsCfg.body}
                headingId={HEADING_ID}
                centered={false}
              />
              <Link
                href={whyChooseUsCfg.ctaHref}
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20",
                  "hover:bg-primary-hover hover:shadow-primary/25 transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                {whyChooseUsCfg.ctaLabel}
                <AppIcon name="arrow-right" size="sm" className="shrink-0" />
              </Link>

              <ul className="mt-2 flex flex-col gap-3" aria-label="Key benefits">
                {checklist.map((point) => (
                  <li
                    key={point}
                    data-reveal
                    className="flex items-start gap-3 text-sm text-foreground-muted"
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                      aria-hidden
                    >
                      <AppIcon name="check" size="sm" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 list-none p-0 m-0"
              aria-label="Why choose us benefits"
            >
              {items.map((item, index) => (
                <li key={item.id} data-reveal>
                  <BenefitCard item={item} index={index} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
