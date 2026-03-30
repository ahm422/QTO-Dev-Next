"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { industriesConfig } from "@/config/industries";
import { industriesItems } from "@/data/industries";
import { cn } from "@/components/theme/cn";
import type { IndustryItem, IndustryIconKey } from "@/types/industry";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "industries-heading";
const CARD_WIDTH = 300;
const CARD_GAP = 24;

const industryIconMap: Record<IndustryIconKey, AppIconName> = {
  building: "building",
  heart: "heart",
  cart: "cart-shopping",
  plane: "plane",
  monitor: "laptop-code",
  rocket: "rocket",
  globe: "globe",
  chart: "chart-line",
};

function IndustryCard({
  item,
  isFocused,
}: {
  item: IndustryItem;
  isFocused: boolean;
}) {
  return (
    <div
      data-focused={isFocused ? "true" : undefined}
      className={cn(
        "flex-shrink-0 transition-all duration-500 ease-out",
        isFocused ? "z-10 scale-[1.02]" : "scale-[0.96]"
      )}
      style={{ width: CARD_WIDTH }}
    >
      {/* Blur wrapper: only unfocused cards get blurred so the focused one is always sharp */}
      <div
        className="h-full min-h-[240px] rounded-2xl transition-all duration-500 ease-out"
        style={!isFocused ? { filter: "blur(6px)" } : undefined}
      >
        <div
          className={cn(
            "group relative flex h-full min-h-[240px] flex-col rounded-2xl p-6 text-white",
            "bg-gradient-to-br from-black/90 via-[#0c0c0c] to-black/80 dark:from-white/[0.12] dark:via-white/[0.08] dark:to-white/[0.05]",
            "border shadow-lg transition-all duration-500 ease-out",
            isFocused
              ? "border-primary/50 shadow-xl shadow-primary/15 opacity-100"
              : "border-white/10 opacity-50 hover:opacity-60"
          )}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent via-transparent to-black/20 dark:to-black/40 pointer-events-none" />
          <div className="relative flex flex-col flex-1 min-w-0 z-0">
            <div className="flex justify-between items-start gap-3 mb-4">
              <span className="font-heading font-bold text-white text-xl tracking-tight">
                {item.title}
              </span>
              <span className="text-white/50 text-sm font-medium tabular-nums shrink-0">
                {item.number}
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center my-3">
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-2xl transition-colors duration-300",
                  isFocused
                    ? "bg-primary/25 text-primary"
                    : "bg-white/10 text-primary/90"
                )}
              >
                <AppIcon
                  name={industryIconMap[item.icon]}
                  size="lg"
                  className="text-primary"
                />
              </div>
            </div>
            <p
              className={cn(
                "text-sm mt-auto leading-relaxed transition-colors duration-300",
                isFocused ? "text-white/90" : "text-white/70"
              )}
            >
              — {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function goNext(index: number, total: number) {
  return index >= total - 1 ? 0 : index + 1;
}

function goPrev(index: number, total: number) {
  return index <= 0 ? total - 1 : index - 1;
}

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const items = industriesItems;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Measure viewport width for centering the focused card (use carousel region)
  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.offsetWidth);
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    updateWidth();
    return () => ro.disconnect();
  }, []);

  // Auto-advance: focus stays on current card for a few seconds, then next
  useEffect(() => {
    if (reducedMotion || isPaused || items.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => goNext(i, items.length));
    }, industriesConfig.autoScrollIntervalMs);
    return () => clearInterval(id);
  }, [reducedMotion, isPaused, items.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => goPrev(i, items.length));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => goNext(i, items.length));
  }, [items.length]);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target && !el.contains(e.target as Node)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  if (items.length === 0) return null;

  const trackWidth = items.length * CARD_WIDTH + (items.length - 1) * CARD_GAP;
  const activeCardCenter =
    activeIndex * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
  // Center the active card: allow positive translateX so first card can be centered
  const maxTranslateX = containerWidth / 2 - CARD_WIDTH / 2;
  const minTranslateX = containerWidth - trackWidth;
  const translateX =
    containerWidth > 0
      ? Math.max(
          minTranslateX,
          Math.min(maxTranslateX, containerWidth / 2 - activeCardCenter)
        )
      : 0;

  return (
    <section
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      <div
        className="pointer-events-none absolute top-0 left-1/4 w-[480px] h-[340px] rounded-full bg-primary/[0.06] dark:bg-primary/[0.08] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-primary/[0.05] dark:bg-primary/[0.07] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            data-reveal
            className="text-center max-w-2xl mx-auto mb-12 md:mb-14"
          >
            <SectionHeader
              subtitle={industriesConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              title={industriesConfig.title}
              titleHighlight={industriesConfig.titleHighlight}
              headingId={HEADING_ID}
            />
          </div>
        </Reveal>
      </Container>

      {/* Full-width carousel */}
      <div
        ref={regionRef}
        className="w-full overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label={industriesConfig.carouselAriaLabel}
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div ref={containerRef} className="w-full overflow-hidden">
          <div
            className="flex py-4 transition-transform duration-500 ease-out"
            style={{
              gap: CARD_GAP,
              transform: `translateX(${translateX}px)`,
            }}
          >
            {items.map((item, i) => (
              <IndustryCard
                key={item.id}
                item={item}
                isFocused={i === activeIndex}
              />
            ))}
          </div>
        </div>

        <Container className="relative">
          <div
            className="flex items-center justify-between mt-8 px-2"
            role="group"
            aria-label="Carousel navigation"
          >
              <button
                type="button"
                onClick={handlePrev}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  "text-foreground-muted hover:text-foreground hover:bg-background",
                  "border border-border shadow-sm transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                aria-label="Previous industry"
              >
                <svg
                  className="w-5 h-5"
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

              <div className="flex items-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      i === activeIndex
                        ? "w-8 bg-primary"
                        : "w-2.5 bg-foreground-muted/35 hover:bg-foreground-muted/55"
                    )}
                    aria-label={`Go to industry ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  "text-foreground-muted hover:text-foreground hover:bg-background",
                  "border border-border shadow-sm transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                aria-label="Next industry"
              >
                <svg
                  className="w-5 h-5"
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
        </Container>

        <div aria-live="polite" aria-atomic className="sr-only">
          {items[activeIndex]?.title}: {items[activeIndex]?.description}
        </div>
      </div>
    </section>
  );
}
