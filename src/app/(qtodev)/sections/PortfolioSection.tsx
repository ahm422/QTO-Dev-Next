"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { portfolioConfig } from "@/config/portfolio";
import { portfolioCases } from "@/data/portfolio";
import type { PortfolioCase, PortfolioGradientKey } from "@/types/portfolio";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";

const SECTION_HEADING_ID = "featured-work-heading";

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
  const cardContent = (
    <>
      {/* Image or gradient placeholder — aspect 16/10 */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br text-2xl font-bold text-white ring-2 ring-white/10",
              gradientClasses[item.gradient]
            )}
            aria-hidden
          >
            <span>{item.initial}</span>
          </div>
        )}
        <div className="absolute right-4 top-4 z-10">
          <span
            className="inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            aria-hidden
          >
            Case {item.caseNumber}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 text-center">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          {item.companyName}
        </h3>
        <span className="mt-2 inline-flex rounded-full bg-surface-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground-muted">
          {item.industry}
        </span>
        {isLink && (
          <div className="mt-4 flex justify-center border-t border-border pt-4 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              View case
              <AppIcon name="arrow-right" size="sm" className="shrink-0" />
            </span>
          </div>
        )}
      </div>
    </>
  );

  const href = item.slug ? `/projects/${item.slug}` : undefined;
  const cardClassName = cn(
    "group relative block overflow-hidden rounded-3xl border border-border bg-surface text-left",
    "shadow-md shadow-black/[0.04] transition-all duration-300",
    "hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.08]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cardClassName}
        aria-label={`View project: ${item.companyName}`}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}

export function PortfolioSection() {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border py-24 md:py-32",
        "bg-gradient-to-b from-background via-surface-muted/40 to-background"
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
          <div className="flex flex-col items-center text-center">
            <div data-reveal className="max-w-2xl">
              <SectionHeader
                subtitle={portfolioConfig.subtitle}
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={portfolioConfig.title}
                titleHighlight={portfolioConfig.titleHighlight}
                description={portfolioConfig.description}
                headingId={SECTION_HEADING_ID}
                centered={true}
              />
            </div>
            <Link
              data-reveal
              href={portfolioConfig.viewAllHref}
              className={cn(
                "mt-8 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground",
                "shadow-md shadow-primary/25 transition-all duration-300",
                "hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/35",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label="View all featured work"
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
