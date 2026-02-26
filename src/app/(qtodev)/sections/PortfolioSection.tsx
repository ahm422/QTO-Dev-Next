"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { portfolioConfig } from "@/config/portfolio";
import { portfolioCases } from "@/data/portfolio";
import type { PortfolioCase, PortfolioGradientKey } from "@/types/portfolio";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";

const SECTION_HEADING_ID = "portfolio-heading";

const gradientClasses: Record<PortfolioGradientKey, string> = {
  "blue-purple": "from-primary to-cta-gold",
  grey: "from-black to-primary",
  dark: "from-black to-black/70",
  orange: "from-primary to-black",
  green: "from-cta-gold to-primary",
  red: "from-cta-gold to-black",
};

function PortfolioCard({
  item,
  isLink,
}: {
  item: PortfolioCase;
  isLink: boolean;
}) {
  const content = (
    <>
      <div className="absolute right-4 top-4">
        <span
          className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
          aria-hidden
        >
          Case {item.caseNumber}
        </span>
      </div>
      <div className="flex flex-col items-center pt-8 pb-6">
        <div
          className={cn(
            "flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg text-2xl font-bold text-white ring-2 ring-white/10",
            gradientClasses[item.gradient]
          )}
        >
          <span aria-hidden>{item.initial}</span>
        </div>
        <h3 className="mt-5 text-center font-heading text-xl font-semibold text-foreground">
          {item.companyName}
        </h3>
        <span className="mt-2 inline-flex rounded-full bg-surface-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          {item.industry}
        </span>
      </div>
      {isLink && (
        <div className="flex justify-center border-t border-border pt-4 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            View case
            <AppIcon name="arrow-right" size="sm" className="shrink-0" />
          </span>
        </div>
      )}
    </>
  );

  const href = item.slug ? `/projects/${item.slug}` : undefined;

  if (href) {
    return (
      <Link
        href={href}
        className="group relative block rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`View project: ${item.companyName}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border bg-surface p-6 text-left shadow-sm transition-all duration-300 hover:shadow-md">
      {content}
    </div>
  );
}

export function PortfolioSection() {
  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={SECTION_HEADING_ID}
    >
      {/* Soft gradient for depth */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end sm:gap-8">
            <div data-reveal className="flex-1 min-w-0">
              <SectionHeader
                subtitle={portfolioConfig.subtitle}
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={portfolioConfig.title}
                titleHighlight={portfolioConfig.titleHighlight}
                description={portfolioConfig.description}
                headingId={SECTION_HEADING_ID}
                centered={false}
              />
            </div>
            <Link
              data-reveal
              href={portfolioConfig.viewAllHref}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground",
                "transition-all duration-200 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label="View all portfolio projects"
            >
              {portfolioConfig.viewAllLabel}
              <AppIcon name="arrow-right" size="sm" className="shrink-0" />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {portfolioCases.map((item) => (
              <div key={item.caseNumber} data-reveal>
                <PortfolioCard
                  item={item}
                  isLink={Boolean(item.slug)}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
