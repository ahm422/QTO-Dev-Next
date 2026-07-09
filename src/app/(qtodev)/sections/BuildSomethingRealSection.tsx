/** @deprecated Removed from homepage in #291; retained for optional reuse on other routes. */
"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { buildSomethingRealConfig } from "@/config/buildSomethingReal";
type BuildSomethingRealConfigType = typeof buildSomethingRealConfig;
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "build-something-real-heading";

export function BuildSomethingRealSection({ config }: { config?: BuildSomethingRealConfigType }) {
  const cfg = config ?? buildSomethingRealConfig;

  return (
    <section
      id="build-something-real"
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-gradient-to-b from-surface via-surface-muted/40 to-surface",
        "border-y border-border/80"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Subtle orbs */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="h-[400px] w-[600px] rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          {/* Panel: warm light gradient in light mode, dark gradient in dark mode */}
          <div
            data-reveal
            className={cn(
              "relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-10 md:px-16 md:py-20",
              "bg-gradient-to-b from-surface-muted via-primary/[0.12] to-surface-muted",
              "border border-border/80 shadow-xl shadow-black/[0.06]",
              "text-foreground [&_p]:text-foreground-muted",
              "ring-1 ring-primary/[0.06]",
              "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent dark:before:via-white/25",
              "dark:bg-gradient-to-b dark:from-black dark:via-primary/[0.14] dark:to-black",
              "dark:border-white/10 dark:shadow-2xl dark:shadow-black/40 dark:ring-primary/15",
              "dark:text-white dark:[&_p]:text-white/85"
            )}
          >
            {/* Pre-header and headline */}
            <div
              className="mb-10 md:mb-12 [&_h2]:font-heading [&_h2]:text-foreground dark:[&_h2]:text-white"
              data-reveal
            >
              <SectionHeader
                subtitle={`• ${cfg.subtitle} •`}
                subtitleClassName="text-foreground-muted font-semibold tracking-wider dark:text-white/80"
                title={cfg.title}
                titleHighlight={cfg.titleHighlight}
                description={cfg.description}
                centered={true}
                showAccentBar={false}
                headingId={HEADING_ID}
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5" data-reveal>
              <Link
                href={cfg.primaryCtaHref}
                className={cn(
                  "inline-flex items-center justify-center gap-3 rounded-xl px-8 py-4 text-base font-semibold",
                  "bg-primary text-primary-foreground hover:bg-primary-hover",
                  "hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "transition-all duration-200",
                  "dark:bg-white dark:text-black dark:hover:bg-white/95 dark:hover:shadow-white/10 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
                )}
              >
                <span>{cfg.primaryCtaLabel}</span>
                <span className="h-5 w-px bg-primary-foreground/30 dark:bg-black/20" aria-hidden />
                <span className="inline-flex items-center gap-2">
                  <span className="text-sm font-medium opacity-90">{cfg.primaryCtaSuffix}</span>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary-foreground/80 dark:bg-primary" aria-hidden />
                </span>
              </Link>
              <Link
                href={cfg.secondaryCtaHref}
                className={cn(
                  "group inline-flex items-center justify-center gap-2 rounded-xl border px-8 py-4 text-base font-semibold",
                  "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/60 hover:-translate-y-0.5",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "transition-all duration-200",
                  "dark:border-white/30 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/40 dark:focus-visible:ring-white dark:focus-visible:ring-offset-black"
                )}
              >
                <span>{cfg.secondaryCtaLabel}</span>
                <AppIcon name="arrow-right" size="sm" className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>

            {/* Benefits */}
            <div
              className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-foreground-muted dark:text-white/85"
              data-reveal
            >
              {cfg.benefits.map((benefit, i) => (
                <span key={i} className="inline-flex items-center gap-6 sm:gap-8">
                  {i > 0 && (
                    <span className="hidden h-4 w-px bg-border dark:bg-white/25 sm:inline-block" aria-hidden />
                  )}
                  <span className="font-medium">{benefit}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
