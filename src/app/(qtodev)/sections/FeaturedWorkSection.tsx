"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { featuredWorkConfig } from "@/config/featuredWork";
import { featuredWorkItems } from "@/data/featuredWork";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

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
function getBackgroundLabel(item: (typeof featuredWorkItems)[0], index: number): string {
  const initial = item.title.charAt(0);
  const short = item.title.split(" ")[0] ?? item.title;
  if (index % 2 === 0) return `/${short}`;
  return `${item.title}/${initial}`;
}

export function FeaturedWorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stripWidth, setStripWidth] = useState(0);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const items = featuredWorkItems;
  const activeItem = items[activeIndex];

  const sectionHeightVh = items.length * 100;

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const ro = new ResizeObserver(() => setStripWidth(strip.offsetWidth));
    ro.observe(strip);
    setStripWidth(strip.offsetWidth);
    return () => ro.disconnect();
  }, [items.length]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const scrollable = sectionHeight - window.innerHeight;
      if (scrollable <= 0) {
        setScrollProgress(0);
        setActiveIndex(0);
        return;
      }
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollable));
      setScrollProgress(progress);
      const index = Math.min(
        Math.floor(progress * items.length),
        items.length - 1
      );
      setActiveIndex(index);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollToSlide = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const scrollable = Math.max(0, sectionHeight - window.innerHeight);
      const progress = items.length <= 1 ? 0 : index / (items.length - 1);
      const targetScroll = sectionTop + progress * scrollable;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    },
    [items.length]
  );

  const goPrev = useCallback(() => {
    const next = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(next);
    scrollToSlide(next);
  }, [items.length, activeIndex, scrollToSlide]);

  const goNext = useCallback(() => {
    const next = activeIndex >= items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(next);
    scrollToSlide(next);
  }, [items.length, activeIndex, scrollToSlide]);

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

  const stripScrollWidth = stripWidth > 0 ? stripWidth / 2 : 0;
  const translateX = -scrollProgress * stripScrollWidth;

  return (
    <div
      ref={sectionRef}
      className="relative w-full bg-black text-white"
      style={{ height: `${sectionHeightVh}vh` }}
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

      <div className="sticky top-0 left-0 z-10 w-full h-screen overflow-hidden flex flex-col">
        {/* Background strip */}
        <div
          className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div
            ref={stripRef}
            className={cn(
              "flex gap-10 md:gap-20 whitespace-nowrap pl-6 md:pl-10 font-heading text-white/20 uppercase tracking-[0.2em] text-2xl md:text-4xl lg:text-5xl font-semibold",
              !reducedMotion && "transition-transform duration-100"
            )}
            style={{
              transform: stripWidth > 0 ? `translateX(${translateX}px)` : undefined,
            }}
          >
            {[...items, ...items].map((item, index) => (
              <span key={`${item.id}-bg-${index}`}>
                {getBackgroundLabel(item, index % items.length)}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured projects"
            className="flex flex-col h-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,420px)_1fr] gap-10 lg:gap-16 items-stretch flex-1 min-h-0 px-4 sm:px-6 lg:px-10">
              {/* Left: details */}
              <div className="order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-primary/60" aria-hidden />
                    <span
                      className="font-heading text-sm font-semibold tabular-nums text-white/70"
                      aria-hidden
                    >
                      {activeItem.caseNumber}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl leading-tight">
                    {activeItem.title}
                  </h2>
                  <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80">
                    {activeItem.category}
                  </span>
                </div>
              </div>

              {/* Right: image */}
              <div className="order-1 lg:order-2 relative w-full max-w-4xl max-h-[42vh] sm:max-h-[48vh] lg:max-h-[56vh] aspect-[3/4] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-black/80 justify-self-center lg:justify-self-end self-center shadow-2xl ring-2 ring-white/10">
                <Image
                  src={activeItem.image}
                  alt=""
                  fill
                  className={cn(
                    "object-cover",
                    reducedMotion ? "" : "transition-opacity duration-300"
                  )}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={activeIndex === 0}
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
                    href={`/projects/${activeItem.slug}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white",
                      "hover:border-primary hover:bg-primary/20 hover:text-white transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    )}
                    aria-label={`View project: ${activeItem.title}`}
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
