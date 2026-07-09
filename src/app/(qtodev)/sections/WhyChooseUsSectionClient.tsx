"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { whyChooseUsConfig } from "@/config/whyChooseUs";
type WhyChooseUsConfigType = typeof whyChooseUsConfig;
import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "why-choose-us-heading";

const DEFAULT_ICONS: AppIconName[] = ["rocket", "shield-halved", "bolt", "bullseye", "chart-line"];

function getItemIcon(item: WhyChooseUsItem, index: number): AppIconName {
  return item.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length]!;
}

function BenefitCard({ item, index }: { item: WhyChooseUsItem; index: number }) {
  const icon = getItemIcon(item, index);

  return (
    <article
      className={cn(
        "group relative rounded-2xl p-[1px] transition-shadow duration-300",
        "bg-border hover:bg-gradient-to-br hover:from-primary hover:to-cta-gold",
        "hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col gap-4 rounded-[calc(1rem-1px)] p-5 sm:p-6",
          "bg-background border border-border/80",
          "transition-colors duration-300 group-hover:border-transparent"
        )}
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            "bg-primary/10 text-primary border border-primary/15",
            "transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-105"
          )}
          aria-hidden
        >
          <AppIcon name={icon} size="md" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function WhyChooseUsSectionClient({
  items,
  config,
}: {
  items: WhyChooseUsItem[];
  config?: WhyChooseUsConfigType;
}) {
  const cfg = config ?? whyChooseUsConfig;

  if (items.length === 0) return null;

  const checklist = cfg.checklist ?? whyChooseUsConfig.checklist;

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
                subtitle="WHY CHOOSE US"
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={cfg.heading}
                titleHighlight="Choose"
                description={cfg.body}
                headingId={HEADING_ID}
                centered={false}
              />
              <Link
                href={cfg.ctaHref}
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20",
                  "hover:bg-primary-hover hover:shadow-primary/25 transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                {cfg.ctaLabel}
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
