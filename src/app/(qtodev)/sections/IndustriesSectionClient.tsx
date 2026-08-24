"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { AppIcon, type AppIconName } from "@/components/ui/shared/AppIcon";
import { industriesConfig } from "@/config/industries";
type IndustriesConfigType = typeof industriesConfig;
import type { IndustryItem, IndustryIconKey } from "@/types/industry";
import { cn } from "@/components/theme/cn";
import { homepageSectionPadding } from "@/components/theme/sectionClasses";
import { Reveal } from "@/components/animations/Reveal";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { RichText } from "@/components/common/RichText";
import { stripHtml } from "@/lib/sanitize-html";

const HEADING_ID = "industries-heading";
const CARD_WIDTH = 300;
const CARD_GAP = 24;
const DRAG_CLICK_THRESHOLD_PX = 5;
const VELOCITY_THRESHOLD = 300;

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const INSTANT = { duration: 0 };

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

function getTrackWidth(itemCount: number) {
  return itemCount * CARD_WIDTH + (itemCount - 1) * CARD_GAP;
}

function translateXForIndex(
  index: number,
  containerWidth: number,
  itemCount: number
): number {
  if (containerWidth <= 0 || itemCount === 0) return 0;
  const trackWidth = getTrackWidth(itemCount);
  const activeCardCenter = index * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
  const maxTranslateX = containerWidth / 2 - CARD_WIDTH / 2;
  const minTranslateX = containerWidth - trackWidth;
  return Math.max(
    minTranslateX,
    Math.min(maxTranslateX, containerWidth / 2 - activeCardCenter)
  );
}

function indexFromOffset(
  currentX: number,
  velocityX: number,
  containerWidth: number,
  itemCount: number
): number {
  if (itemCount <= 1) return 0;

  let nearest = 0;
  let minDist = Infinity;

  for (let i = 0; i < itemCount; i++) {
    const target = translateXForIndex(i, containerWidth, itemCount);
    const dist = Math.abs(currentX - target);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }

  if (Math.abs(velocityX) > VELOCITY_THRESHOLD) {
    if (velocityX < 0) {
      return Math.min(itemCount - 1, nearest + 1);
    }
    return Math.max(0, nearest - 1);
  }

  return nearest;
}

function IndustryCard({
  item,
  isFocused,
  motionEnabled,
}: {
  item: IndustryItem;
  isFocused: boolean;
  motionEnabled: boolean;
}) {
  return (
    <div
      data-focused={isFocused ? "true" : undefined}
      className="flex-shrink-0 h-full"
      style={{ width: CARD_WIDTH }}
    >
      <div
        className={cn(
          "group relative flex h-full min-h-[240px] flex-col rounded-2xl p-6 text-white",
          "bg-gradient-to-br from-black/90 via-[#0c0c0c] to-black/80 dark:from-white/[0.12] dark:via-white/[0.08] dark:to-white/[0.05]",
          "border shadow-lg",
          isFocused
            ? "border-primary/50 shadow-xl shadow-primary/20 ring-1 ring-primary/30"
            : "border-white/10 shadow-lg"
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
            <motion.div
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300",
                isFocused
                  ? "bg-primary/25 text-primary shadow-lg shadow-primary/20"
                  : "bg-white/10 text-primary/90 opacity-80"
              )}
              animate={
                motionEnabled && isFocused
                  ? { scale: 1.1 }
                  : { scale: isFocused ? 1.05 : 1 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <AppIcon
                name={industryIconMap[item.icon]}
                size="lg"
                className="text-primary"
              />
            </motion.div>
          </div>
          <p
            className={cn(
              "text-sm mt-auto leading-relaxed transition-colors duration-300",
              isFocused ? "text-white/90" : "text-white/70"
            )}
          >
            — <RichText html={item.description} as="span" />
          </p>
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

export function IndustriesSectionClient({
  items,
  config,
}: {
  items: IndustryItem[];
  config?: IndustriesConfigType;
}) {
  const cfg = config ?? industriesConfig;
  const motionEnabled = useMotionEnabled();
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const dragMovedRef = useRef(false);
  const x = useMotionValue(0);

  const itemCount = items.length;
  const trackWidth = getTrackWidth(itemCount);
  const maxTranslateX = containerWidth / 2 - CARD_WIDTH / 2;
  const minTranslateX = containerWidth - trackWidth;
  const canDrag = itemCount > 1 && containerWidth > 0;
  const cardTransition = reducedMotion ? INSTANT : SPRING;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.offsetWidth);
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    updateWidth();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (containerWidth <= 0 || itemCount === 0) return;
    const target = translateXForIndex(activeIndex, containerWidth, itemCount);
    if (reducedMotion) {
      x.set(target);
    } else {
      animate(x, target, SPRING);
    }
  }, [activeIndex, containerWidth, itemCount, reducedMotion, x]);

  useEffect(() => {
    if (reducedMotion || isPaused || isDragging || itemCount <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => goNext(i, itemCount));
    }, cfg.autoScrollIntervalMs);
    return () => clearInterval(id);
  }, [
    reducedMotion,
    isPaused,
    isDragging,
    itemCount,
    cfg.autoScrollIntervalMs,
  ]);

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => goPrev(i, itemCount));
  }, [itemCount]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => goNext(i, itemCount));
  }, [itemCount]);

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

  const handleDragStart = useCallback(() => {
    dragMovedRef.current = false;
    setIsDragging(true);
    setIsPaused(true);
  }, []);

  const handleDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (Math.abs(info.offset.x) > DRAG_CLICK_THRESHOLD_PX) {
        dragMovedRef.current = true;
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { velocity: { x: number } }) => {
      setIsDragging(false);
      if (containerWidth <= 0) return;
      const nearest = indexFromOffset(
        x.get(),
        info.velocity.x,
        containerWidth,
        itemCount
      );
      setActiveIndex(nearest);
      const target = translateXForIndex(nearest, containerWidth, itemCount);
      if (reducedMotion) {
        x.set(target);
      } else {
        animate(x, target, SPRING);
      }
    },
    [containerWidth, itemCount, reducedMotion, x]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (dragMovedRef.current) return;
      if (index !== activeIndex) setActiveIndex(index);
    },
    [activeIndex]
  );

  if (itemCount === 0) return null;

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        homepageSectionPadding,
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
            className="text-center max-w-2xl mx-auto mb-8 md:mb-10"
          >
            <SectionHeader
              subtitle={cfg.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              title={cfg.title}
              titleHighlight={cfg.titleHighlight}
              headingId={HEADING_ID}
            />
          </div>
        </Reveal>
      </Container>

      <div
        ref={regionRef}
        className="w-full overflow-hidden touch-pan-y"
        role="region"
        aria-roledescription="carousel"
        aria-label={cfg.carouselAriaLabel}
        tabIndex={0}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div ref={containerRef} className="relative w-full overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-6 md:w-10 bg-gradient-to-r from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-6 md:w-10 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
          <motion.div
            className={cn(
              "flex py-4 select-none",
              canDrag && "cursor-grab active:cursor-grabbing"
            )}
            style={{ x, gap: CARD_GAP }}
            drag={canDrag ? "x" : false}
            dragConstraints={
              canDrag
                ? { left: minTranslateX, right: maxTranslateX }
                : undefined
            }
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {items.map((item, i) => {
              const isFocused = i === activeIndex;
              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "flex-shrink-0",
                    isFocused ? "z-10" : "z-0"
                  )}
                  style={{ width: CARD_WIDTH }}
                  animate={{
                    scale: isFocused ? 1.05 : 0.94,
                    opacity: isFocused ? 1 : 0.75,
                    filter: isFocused ? "blur(0px)" : "blur(1px)",
                  }}
                  transition={cardTransition}
                  onClick={() => handleCardClick(i)}
                >
                  <IndustryCard item={item} isFocused={isFocused} motionEnabled={motionEnabled} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <Container className="relative">
          <div
            className="flex items-center justify-center gap-4 mt-8 px-2"
            role="group"
            aria-label="Carousel navigation"
          >
            <button
              type="button"
              onClick={handlePrev}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "text-foreground-muted/80 hover:text-foreground hover:bg-background",
                "border border-border/70 shadow-sm transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={cfg.prevLabel}
            >
              <svg
                className="w-4 h-4"
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
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                "text-foreground-muted/80 hover:text-foreground hover:bg-background",
                "border border-border/70 shadow-sm transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              )}
              aria-label={cfg.nextLabel}
            >
              <svg
                className="w-4 h-4"
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
          {items[activeIndex]?.title}: {stripHtml(items[activeIndex]?.description ?? "")}
        </div>
      </div>
    </section>
  );
}
