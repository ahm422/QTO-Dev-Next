"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { featuredWorkConfig } from "@/config/featuredWork";
import type { FeaturedWorkItem } from "@/types/featuredWork";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

const SLIDE_TRANSITION_MS = 300;

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

/** Format project label for background strip */
function getBackgroundLabel(item: FeaturedWorkItem, index: number): string {
  const initial = item.title.charAt(0);
  const short = item.title.split(" ")[0] ?? item.title;
  if (index % 2 === 0) return `/${short}`;
  return `${item.title}/${initial}`;
}

export function FeaturedWorkSectionClient({ items }: { items: FeaturedWorkItem[] }) {
  if (items.length === 0) return null;
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stripWidth, setStripWidth] = useState(0);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const activeItem = items[activeIndex];
  const displayItem = items[displayIndex];

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const ro = new ResizeObserver(() => setStripWidth(strip.offsetWidth));
    ro.observe(strip);
    setStripWidth(strip.offsetWidth);
    return () => ro.disconnect();
  }, [items.length]);

  // When activeIndex changes, run fade-out then update displayIndex then fade-in (skip if reduced motion)
  useEffect(() => {
    if (activeIndex === displayIndex) return;
    if (reducedMotion) {
      setDisplayIndex(activeIndex);
      return;
    }
    setIsTransitioning(true);
  }, [activeIndex, displayIndex, reducedMotion]);

  useEffect(() => {
    if (!isTransitioning) return;
    const t = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setIsTransitioning(false);
    }, SLIDE_TRANSITION_MS);
    return () => clearTimeout(t);
  }, [isTransitioning, activeIndex]);

  // Background strip: drive by displayIndex so it moves with the slide (no scroll)
  const stripProgress = items.length <= 1 ? 0 : displayIndex / Math.max(1, items.length - 1);
  const stripScrollWidth = stripWidth > 0 ? stripWidth / 2 : 0;
  const stripTranslateX = -stripProgress * stripScrollWidth;

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (items.length === 0) return null;

  const contentOpacity = reducedMotion ? 1 : isTransitioning ? 0 : 1;

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black text-white"
      aria-label="Featured work"
    >
      {/* Soft gradient accents */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(244,139,34,0.05) 0%, transparent 50%), radial-gradient(ellipse 50% 30% at 80% 80%, rgba(244,139,34,0.04) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 flex min-h-screen w-full flex-col overflow-hidden">
        {/* Background strip: position driven by active slide index (no scroll) */}
        <div
          className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div
            ref={stripRef}
            className={cn(
              "flex gap-10 md:gap-20 whitespace-nowrap pl-6 md:pl-10 font-heading text-white/20 uppercase tracking-[0.2em] text-2xl md:text-4xl lg:text-5xl font-semibold",
              !reducedMotion && "transition-transform duration-500 ease-out"
            )}
            style={{
              transform: stripWidth > 0 ? `translateX(${stripTranslateX}px)` : undefined,
            }}
          >
            {[...items, ...items].map((item, index) => (
              <span key={`${item.id}-bg-${index}`}>
                {getBackgroundLabel(item, index % items.length)}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex min-h-screen flex-1 flex-col justify-center">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured projects"
            className="flex flex-col h-full"
          >
            <div
              className={cn(
                "grid grid-cols-1 lg:grid-cols-[minmax(300px,420px)_1fr] gap-10 lg:gap-16 items-stretch flex-1 min-h-0 px-4 sm:px-6 lg:px-10 transition-opacity",
                reducedMotion ? "" : "duration-300 ease-out"
              )}
              style={{ opacity: contentOpacity }}
            >
              {/* Left: project name and short description */}
              <div className="order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-primary/60" aria-hidden />
                    <span
                      className="font-heading text-sm font-semibold tabular-nums text-white/70"
                      aria-hidden
                    >
                      {displayItem.caseNumber}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
                    {displayItem.title}
                  </h2>
                  <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80">
                    {displayItem.category}
                  </span>
                  {displayItem.description && (
                    <p className="mt-2 text-sm md:text-base text-white/70 leading-relaxed max-w-lg">
                      {displayItem.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: image */}
              <div className="order-1 lg:order-2 relative w-full max-w-4xl max-h-[42vh] sm:max-h-[48vh] lg:max-h-[56vh] aspect-[3/4] lg:aspect-[4/3] justify-self-center self-center overflow-hidden rounded-3xl bg-black/80 shadow-2xl ring-2 ring-white/10 lg:shadow-[0_28px_90px_-16px_rgba(244,139,34,0.22),0_0_0_1px_rgba(255,255,255,0.06)] lg:ring-primary/20">
                <Image
                  src={displayItem.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={displayIndex === 0}
                />
              </div>
            </div>

            {/* Footer */}
            <Container className="shrink-0 pt-6 mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 py-6 border-t border-white/10">
                <span className="text-white/50 text-xs font-medium uppercase tracking-widest">
                  {featuredWorkConfig.footerLabel}
                </span>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <Link
                    href={`/projects/${displayItem.slug}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white",
                      "hover:border-primary hover:bg-primary/20 hover:text-white transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    )}
                    aria-label={`View project: ${displayItem.title}`}
                  >
                    {featuredWorkConfig.viewProjectLabel}
                    <AppIcon name="arrow-right" size="sm" className="shrink-0" />
                  </Link>
                  <Link
                    href={featuredWorkConfig.contactHref}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground",
                      "hover:bg-primary-hover transition-colors duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    )}
                    aria-label="Let's talk"
                  >
                    {featuredWorkConfig.letsTalkLabel}
                  </Link>

                  <div className="flex items-center gap-1" role="group" aria-label="Carousel navigation">
                    <button
                      type="button"
                      onClick={goPrev}
                      className={cn(
                        "p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      )}
                      aria-label="Previous project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="mx-2 min-w-[4ch] text-center font-heading text-sm tabular-nums text-white/60">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={goNext}
                      className={cn(
                        "p-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      )}
                      aria-label="Next project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
