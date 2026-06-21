"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { servicesPageConfig } from "@/config/servicesPage";
type ServicesPageConfigType = typeof servicesPageConfig;
import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "services-why-choose-us-heading";

export function ServicesWhyChooseUsSectionClient({ items, config }: { items: WhyChooseUsItem[]; config?: ServicesPageConfigType }) {
  if (items.length === 0) return null;
  const cfg = config ?? servicesPageConfig;
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const currentItem = items[currentIndex];
  const whyChooseUsCfg = cfg.whyChooseUs;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target && !el.contains(e.target as Node)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[450px] h-[340px] rounded-full bg-primary/[0.06] blur-3xl translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 right-0 w-[320px] h-[280px] rounded-full bg-primary/[0.04] blur-3xl -translate-y-1/2 translate-x-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center"
            data-reveal
          >
            {/* Left: heading, body, CTA */}
            <div className="flex flex-col gap-7" data-reveal>
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
                  "group/cta inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground",
                  "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
                  "hover:-translate-y-0.5 transition-all duration-300",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                {whyChooseUsCfg.ctaLabel}
                <AppIcon
                  name="arrow-right"
                  size="sm"
                  className="shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1"
                />
              </Link>
            </div>

            {/* Right: carousel card */}
            <div
              ref={carouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Why choose us for services"
              tabIndex={0}
              data-reveal
              className={cn(
                "relative overflow-hidden rounded-2xl h-[360px] sm:h-[380px] md:h-[420px] flex flex-col",
                "bg-gradient-to-br from-primary via-primary to-primary/90",
                "border border-primary/30 shadow-2xl shadow-primary/25",
                "ring-2 ring-white/10 ring-inset",
                "p-6 sm:p-8 md:p-10",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "transition-shadow duration-300 hover:shadow-primary/30"
              )}
            >
              {/* Top accent bar */}
              <div
                className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                aria-hidden
              />
              {/* Corner glows */}
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-black/10 blur-2xl"
                aria-hidden
              />

              <span
                className="relative inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-sm backdrop-blur-sm"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/95 animate-pulse" />
                {whyChooseUsCfg.cardLabel}
              </span>

              {currentItem && (
                <div className="relative mt-6 flex flex-1 flex-col min-h-0 overflow-hidden">
                  <div className="h-px w-14 bg-white/40 mb-5 shrink-0" aria-hidden />
                  <h3 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl shrink-0 tracking-tight">
                    {currentItem.title}
                  </h3>
                  <p className="mt-4 flex-1 min-h-0 overflow-y-auto scrollbar-none text-base leading-relaxed text-white/95 sm:text-lg max-w-xl pr-1">
                    {currentItem.description}
                  </p>
                </div>
              )}

              <div
                className="relative mt-8 flex items-center justify-between gap-4 pt-6 border-t border-white/20"
                role="group"
                aria-label="Carousel navigation"
              >
                <div className="flex items-center gap-2">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
                        i === currentIndex
                          ? "w-8 bg-white shadow-md"
                          : "w-2.5 bg-white/50 hover:bg-white/70 hover:w-4"
                      )}
                      aria-label={`Go to benefit ${i + 1}`}
                      aria-current={i === currentIndex ? "true" : undefined}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white shadow-sm",
                      "hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    )}
                    aria-label="Previous benefit"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span
                    className="min-w-[3ch] text-center font-heading text-sm font-medium tabular-nums text-white/95"
                    aria-live="polite"
                  >
                    {currentIndex + 1} / {items.length}
                  </span>
                  <button
                    type="button"
                    onClick={goNext}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white shadow-sm",
                      "hover:bg-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    )}
                    aria-label="Next benefit"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
