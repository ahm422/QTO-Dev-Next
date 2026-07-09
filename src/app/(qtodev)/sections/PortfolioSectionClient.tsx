"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { portfolioConfig } from "@/config/portfolio";
type PortfolioConfigType = typeof portfolioConfig;
import type { PortfolioCase, PortfolioGradientKey } from "@/types/portfolio";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { TiltCard } from "@/components/animations/TiltCard";
import { cn } from "@/components/theme/cn";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SECTION_HEADING_ID = "featured-work-heading";

const gradientClasses: Record<PortfolioGradientKey, string> = {
  "blue-purple": "from-primary to-cta-gold",
  grey: "from-black to-primary",
  dark: "from-black to-black/70",
  orange: "from-primary to-black",
  green: "from-cta-gold to-primary",
  red: "from-cta-gold to-black",
};

function getBentoClass(index: number, total: number): string {
  if (index === 0) return "lg:col-span-2";
  if (total >= 4 && index === 3) return "lg:col-span-2";
  return "";
}

function getAspectClass(index: number): string {
  if (index === 0 || index === 3) return "aspect-[21/10]";
  return "aspect-[16/10]";
}

function PortfolioCard({
  item,
  isLink,
  index,
  useTilt,
}: {
  readonly item: PortfolioCase;
  readonly isLink: boolean;
  readonly index: number;
  readonly useTilt: boolean;
}) {
  const cardContent = (
    <>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          getAspectClass(index)
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
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
            className="inline-flex rounded-lg bg-black/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
            aria-hidden
          >
            Case {item.caseNumber}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
            {item.industry}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 text-center">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          {item.companyName}
        </h3>
        {isLink ? (
          <div className="mt-4 flex justify-center border-t border-border pt-4 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              View case
              <AppIcon name="arrow-right" size="sm" className="shrink-0" />
            </span>
          </div>
        ) : null}
      </div>
    </>
  );

  const href = item.slug ? `/projects/${item.slug}` : undefined;
  const cardClassName = cn(
    "group relative block h-full overflow-hidden rounded-3xl border border-border bg-surface text-left",
    "shadow-md shadow-black/[0.04] transition-all duration-300",
    "hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.08]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  );

  const inner = href ? (
    <Link
      href={href}
      className={cardClassName}
      aria-label={`View project: ${item.companyName}`}
    >
      {cardContent}
    </Link>
  ) : (
    <div className={cardClassName}>{cardContent}</div>
  );

  if (useTilt) {
    return (
      <TiltCard className="h-full" maxTilt={5}>
        {inner}
      </TiltCard>
    );
  }

  return inner;
}

export function PortfolioSectionClient({
  cases,
  config,
}: {
  readonly cases: PortfolioCase[];
  readonly config?: PortfolioConfigType;
}) {
  const cfg = config ?? portfolioConfig;
  const motionEnabled = useMotionEnabled();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const useTilt = motionEnabled && isDesktop;

  if (cases.length === 0) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border py-24 md:py-32",
        "bg-gradient-to-b from-background via-surface-muted/40 to-background"
      )}
      aria-labelledby={SECTION_HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="flex flex-col items-center text-center">
            <div data-reveal className="max-w-2xl">
              <SectionHeader
                subtitle={cfg.subtitle}
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={cfg.title}
                titleHighlight={cfg.titleHighlight}
                {...(cfg.description ? { description: cfg.description } : {})}
                headingId={SECTION_HEADING_ID}
                centered={true}
              />
            </div>
            <MagneticButton asChild strength={0.3}>
              <Link
                data-reveal
                href={cfg.viewAllHref}
                className={cn(
                  "mt-8 inline-flex items-center gap-2 rounded-full border-2 border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground",
                  "shadow-md shadow-primary/25 transition-all duration-300",
                  "hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/35",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                aria-label="View all featured work"
              >
                {cfg.viewAllLabel}
                <AppIcon name="arrow-right" size="sm" className="shrink-0" />
              </Link>
            </MagneticButton>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {cases.map((item, index) => (
              <div
                key={item.caseNumber}
                data-reveal
                className={getBentoClass(index, cases.length)}
              >
                <PortfolioCard
                  item={item}
                  isLink={Boolean(item.slug)}
                  index={index}
                  useTilt={useTilt}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
