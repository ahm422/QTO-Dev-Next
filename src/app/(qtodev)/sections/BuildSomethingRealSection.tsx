"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { buildSomethingRealConfig } from "@/config/buildSomethingReal";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "build-something-real-heading";

export function BuildSomethingRealSection() {
  const cfg = buildSomethingRealConfig;

  return (
    <section
      id="build-something-real"
      className={cn(
        "py-16 md:py-20",
        "bg-surface-muted/30 dark:bg-background"
      )}
      aria-labelledby={HEADING_ID}
    >
      <Container>
        {/* Dark panel: gradient from darker edges to warm golden/amber center; border + shadow for visibility in both themes */}
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-8 md:px-12 md:py-16",
            "bg-gradient-to-b from-[#1a1a1a] via-[#252220] to-[#1a1a1a]",
            "dark:from-[#1a1a1a] dark:via-amber-950/50 dark:to-[#1a1a1a]",
            "border border-gray-700 dark:border-white/10",
            "shadow-xl dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
            "text-white [&_p]:text-gray-200"
          )}
        >
          {/* Pre-header and headline via SectionHeader (subtitle light gray, title white, highlight primary) */}
          <div className="mb-8 md:mb-10 [&_h2]:text-white">
            <SectionHeader
              subtitle={`• ${cfg.subtitle} •`}
              subtitleClassName="text-gray-200"
              title={cfg.title}
              titleHighlight={cfg.titleHighlight}
              description={cfg.description}
              centered={true}
              headingId={HEADING_ID}
            />
          </div>

          {/* CTAs: primary (white bg, dark text) + secondary (dark gray bg, white text) */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href={cfg.primaryCtaHref}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900",
                "hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              )}
            >
              <span>{cfg.primaryCtaLabel}</span>
              <span className="h-4 w-px bg-gray-300" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <span>{cfg.primaryCtaSuffix}</span>
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
              </span>
            </Link>
            <Link
              href={cfg.secondaryCtaHref}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg bg-gray-700 px-6 py-3 text-base font-semibold text-white",
                "hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              )}
            >
              <span>{cfg.secondaryCtaLabel}</span>
              <AppIcon name="arrow-right" size="sm" aria-hidden />
            </Link>
          </div>

          {/* Benefits row: three items with vertical dividers */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-200">
            {cfg.benefits.map((benefit, i) => (
              <span key={i} className="inline-flex items-center gap-4">
                {i > 0 && (
                  <span
                    className="hidden h-4 w-px bg-gray-400 sm:inline-block"
                    aria-hidden
                  />
                )}
                <span>{benefit}</span>
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
