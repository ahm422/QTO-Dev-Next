"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { industriesConfig } from "@/config/industries";
import { industriesItems } from "@/data/industries";
import { cn } from "@/components/theme/cn";
import type { IndustryItem, IndustryIconKey } from "@/types/industry";

const HEADING_ID = "industries-heading";
const CARD_WIDTH = 280;
const CARD_GAP = 16;

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function goPrev(index: number, total: number) {
  return index <= 0 ? total - 1 : index - 1;
}

function goNext(index: number, total: number) {
  return index >= total - 1 ? 0 : index + 1;
}

/** Gold-outline inline SVG icons for industries */
function IndustryIcon({ icon, className }: { icon: IndustryIconKey; className?: string }) {
  const size = 48;
  const stroke = 1.5;
  const common = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: stroke, "aria-hidden": true };
  const cls = cn("text-primary shrink-0", className);

  switch (icon) {
    case "building":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "cart":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "plane":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    case "monitor":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path strokeLinecap="round" d="M8 21h8M12 17v4" />
        </svg>
      );
    case "rocket":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.63v-4a2 2 0 011.34-1.89L15.59 14.37zM12 2L9.19 8.63 2 12l7.19 3.37L12 22l2.81-6.37L22 12l-7.19-3.37L12 2z" />
        </svg>
      );
    case "globe":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    case "chart":
      return (
        <svg className={cls} viewBox="0 0 24 24" {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    default:
      return null;
  }
}

function IndustryCard({
  item,
  isActive,
}: {
  item: IndustryItem;
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-shrink-0 rounded-xl p-5 flex flex-col transition-all duration-300",
        "min-h-[200px]",
        "text-white",
        isActive
          ? "bg-[#1a1a1a] scale-105 shadow-lg z-10 shadow-black/20 dark:shadow-black/40"
          : "bg-[#6b7280] dark:bg-[#3f3f3f] scale-100"
      )}
      style={{ width: CARD_WIDTH }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="font-semibold text-white text-lg">{item.title}</span>
        <span className="text-white/80 text-sm tabular-nums">{item.number}</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center my-2">
        <IndustryIcon icon={item.icon} className="text-primary" />
      </div>
      <p className="text-white/90 text-sm mt-auto leading-snug">
        — {item.description}
      </p>
    </div>
  );
}

export function IndustriesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const items = industriesItems;
  const activeItem = items[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => goPrev(i, items.length));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => goNext(i, items.length));
  }, [items.length]);

  // Measure container width for centering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth));
    ro.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Auto-advance (respect reduced motion and pause)
  useEffect(() => {
    if (reducedMotion || isPaused || items.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => goNext(i, items.length));
    }, industriesConfig.autoScrollIntervalMs);
    return () => clearInterval(id);
  }, [reducedMotion, isPaused, items.length]);

  // Keyboard: only when focus is inside carousel region
  useEffect(() => {
    const el = carouselRef.current;
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
  const centerOffset = activeIndex * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
  const minTx = containerWidth / 2 - trackWidth + CARD_WIDTH / 2;
  const maxTx = containerWidth / 2 - CARD_WIDTH / 2;
  const translateX =
    containerWidth > 0
      ? Math.max(minTx, Math.min(maxTx, containerWidth / 2 - centerOffset))
      : 0;

  return (
    <section
      className="relative py-16 md:py-20 bg-[#FBF6EA] dark:bg-[#1a1914] overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      <Container className="relative">
        <SectionHeader
          subtitle={industriesConfig.subtitle}
          subtitleClassName="text-foreground-muted"
          title={industriesConfig.title}
          titleHighlight={industriesConfig.titleHighlight}
          headingId={HEADING_ID}
        />

        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={industriesConfig.carouselAriaLabel}
          tabIndex={0}
          className="mt-12"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div ref={containerRef} className="overflow-hidden w-full">
            <div
              className="flex gap-4 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${containerWidth ? translateX : 0}px)`,
              }}
            >
              {items.map((item, i) => (
                <IndustryCard
                  key={item.id}
                  item={item}
                  isActive={i === activeIndex}
                />
              ))}
            </div>
          </div>

          {/* Prev / Dots / Next */}
          <div
            className="flex items-center justify-between mt-8 px-2"
            role="group"
            aria-label="Carousel navigation"
          >
            <button
              type="button"
              onClick={handlePrev}
              className="text-foreground-muted hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EA] dark:focus-visible:ring-offset-[#1a1914]"
              aria-label="Previous industry"
            >
              {industriesConfig.prevLabel}
            </button>

            <div className="flex items-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EA] dark:focus-visible:ring-offset-[#1a1914]",
                    i === activeIndex
                      ? "bg-primary"
                      : "border border-foreground-muted/50 dark:border-white/40 bg-transparent hover:border-foreground-muted dark:hover:border-white/70"
                  )}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="text-foreground-muted hover:text-foreground dark:text-white/70 dark:hover:text-white text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF6EA] dark:focus-visible:ring-offset-[#1a1914]"
              aria-label="Next industry"
            >
              {industriesConfig.nextLabel}
            </button>
          </div>
        </div>

        {/* Live region for active card (optional a11y) */}
        <div aria-live="polite" aria-atomic className="sr-only">
          {activeItem?.title}: {activeItem?.description}
        </div>
      </Container>
    </section>
  );
}
