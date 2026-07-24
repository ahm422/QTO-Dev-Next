"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";
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
import { homepageSectionPadding } from "@/components/theme/sectionClasses";
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

function PortfolioCard({
  item,
  useTilt,
  motionAnimate,
}: {
  readonly item: PortfolioCase;
  readonly useTilt: boolean;
  readonly motionAnimate: boolean;
}) {
  const href = `/projects/${item.slug}`;

  const cardInner = (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface text-left",
        "shadow-lg shadow-black/[0.06] dark:shadow-black/25",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.1]"
      )}
    >
      <span
        className={cn(
          "absolute top-0 left-0 right-0 z-20 h-1 rounded-t-2xl bg-gradient-to-r from-primary via-cta-gold to-primary opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100"
        )}
        aria-hidden
      />

      <div className="relative w-full overflow-hidden bg-muted aspect-[16/10]">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-gradient-to-br text-3xl font-bold text-white",
              gradientClasses[item.gradient]
            )}
            aria-hidden
          >
            <span>{item.initial}</span>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 opacity-80 transition-opacity duration-300 group-hover:opacity-95"
          aria-hidden
        />

        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <span className="inline-flex rounded-lg border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
            Case {item.caseNumber}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 z-10 sm:bottom-4 sm:left-4">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/25 sm:text-xs">
            {item.industry}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col border-t border-border/60 bg-gradient-to-b from-surface to-surface-muted/50 p-4 sm:p-5">
        <h3 className="font-heading text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
          {item.companyName}
        </h3>

        <span
          className={cn(
            "mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-primary",
            "transition-all duration-300 group-hover:gap-3"
          )}
        >
          View case
          <AppIcon
            name="arrow-right"
            size="sm"
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </div>
  );

  const linkClassName = cn(
    "block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  );

  const wrapped = (
    <Link href={href} className={linkClassName} aria-label={`View project: ${item.companyName}`}>
      {cardInner}
    </Link>
  );

  const withMotion = motionAnimate ? (
    <motion.div
      className="h-full"
      initial={{ scale: 1 }}
      whileInView={{ scale: 1.02 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {useTilt ? (
        <TiltCard className="h-full" maxTilt={5}>
          {wrapped}
        </TiltCard>
      ) : (
        wrapped
      )}
    </motion.div>
  ) : useTilt ? (
    <TiltCard className="h-full" maxTilt={5}>
      {wrapped}
    </TiltCard>
  ) : (
    wrapped
  );

  return withMotion;
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
  const framerReduced = useFramerReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const useTilt = motionEnabled && isDesktop;
  const motionAnimate = motionEnabled && !framerReduced;

  if (cases.length === 0) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border",
        homepageSectionPadding,
        "bg-gradient-to-b from-background via-surface-muted/50 to-background"
      )}
      aria-labelledby={SECTION_HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[480px] h-[340px] rounded-full bg-primary/[0.06] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[420px] h-[300px] rounded-full bg-primary/[0.05] blur-3xl translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="flex flex-col items-center text-center">
            <div data-reveal className="max-w-2xl">
              <SectionHeader
                subtitle={cfg.subtitle}
                subtitleClassName="text-primary font-semibold tracking-[0.2em]"
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
                  "mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold",
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                aria-label="View all featured work"
              >
                {cfg.viewAllLabel.replace(/\s*-\s*$/, "")}
                <AppIcon name="arrow-right" size="sm" className="shrink-0" />
              </Link>
            </MagneticButton>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {cases.map((item) => (
              <div key={item.caseNumber} data-reveal className="min-h-0">
                <PortfolioCard item={item} useTilt={useTilt} motionAnimate={motionAnimate} />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
