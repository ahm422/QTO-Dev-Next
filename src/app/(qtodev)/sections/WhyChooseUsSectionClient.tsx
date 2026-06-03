"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { whyChooseUsConfig } from "@/config/whyChooseUs";
import type { WhyChooseUsItem } from "@/types/whyChooseUs";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "why-choose-us-heading";

export function WhyChooseUsSectionClient({ items }: { items: WhyChooseUsItem[] }) {
  if (items.length === 0) return null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const currentItem = items[currentIndex];

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
        "relative overflow-hidden py-24 md:py-32",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient for depth */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-primary/[0.05] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center"
            data-reveal
          >
            {/* Left: heading, body, CTA */}
            <div className="flex flex-col gap-6" data-reveal>
              <SectionHeader
                subtitle="WHY CHOOSE US"
                subtitleClassName="text-primary font-semibold tracking-widest"
                subtitlePill
                title={whyChooseUsConfig.heading}
                titleHighlight="Choose"
                description={whyChooseUsConfig.body}
                headingId={HEADING_ID}
                centered={false}
              />
              <Link
                href={whyChooseUsConfig.ctaHref}
                className={cn(
                  "inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20",
                  "hover:bg-primary-hover hover:shadow-primary/25 transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
              >
                {whyChooseUsConfig.ctaLabel}
                <AppIcon name="arrow-right" size="sm" className="shrink-0" />
              </Link>
            </div>

            {/* Right: carousel card */}
            <div
              ref={carouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Why choose us benefits"
              tabIndex={0}
              data-reveal
              className={cn(
                "relative overflow-hidden rounded-2xl h-[360px] sm:h-[380px] md:h-[400px] flex flex-col",
                "bg-gradient-to-br from-primary via-primary to-primary/90",
                "border border-primary/30 shadow-2xl shadow-primary/20",
                "ring-2 ring-white/10 ring-inset",
                "p-6 sm:p-8 md:p-9",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
            >
              {/* Top accent bar */}
              <div
                className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                aria-hidden
              />
              {/* Corner glow */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-black/10 blur-2xl"
                aria-hidden
              />

              <span
                className="relative inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-sm"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                {whyChooseUsConfig.cardLabel}
              </span>

              {currentItem && (
                <div className="relative mt-6 flex flex-1 flex-col min-h-0 overflow-hidden">
                  <div className="h-px w-12 bg-white/30 mb-5 shrink-0" aria-hidden />
                  <h3 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl shrink-0">
                    {currentItem.title}
                  </h3>
                  <p className="mt-4 flex-1 min-h-0 overflow-y-auto scrollbar-none text-base leading-relaxed text-white/95 sm:text-lg max-w-xl pr-1">
                    {currentItem.description}
                  </p>
                </div>
              )}

              <div
                className="relative mt-8 flex items-center justify-between gap-4 pt-6 border-t border-white/15"
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
                        "h-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
                        i === currentIndex
                          ? "w-8 bg-white shadow-sm"
                          : "w-2 bg-white/50 hover:bg-white/70"
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
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white shadow-sm",
                      "hover:bg-white/25 hover:border-white/35 transition-all duration-200",
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
                    className="min-w-[3ch] text-center font-heading text-sm font-medium tabular-nums text-white/90"
                    aria-live="polite"
                  >
                    {currentIndex + 1} / {items.length}
                  </span>
                  <button
                    type="button"
                    onClick={goNext}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-white shadow-sm",
                      "hover:bg-white/25 hover:border-white/35 transition-all duration-200",
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
