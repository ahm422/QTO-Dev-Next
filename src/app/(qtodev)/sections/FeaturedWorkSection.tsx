"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { featuredWorkConfig } from "@/config/featuredWork";
import { featuredWorkItems } from "@/data/featuredWork";
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

/** Format project label for background strip (e.g. "ShopVerse/Learn", "PropWise Realty/G") */
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

  // Section height: N viewports so scrolling through it drives the carousel
  const sectionHeightVh = items.length * 100;

  // Update strip width on mount and resize
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const ro = new ResizeObserver(() => setStripWidth(strip.offsetWidth));
    ro.observe(strip);
    setStripWidth(strip.offsetWidth);
    return () => ro.disconnect();
  }, [items.length]);

  // Scroll-driven: progress 0..1 and activeIndex from scroll position within section
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

  // One full copy of the strip width to scroll through
  const stripScrollWidth = stripWidth > 0 ? stripWidth / 2 : 0;
  const translateX = -scrollProgress * stripScrollWidth;

  return (
    <div
      ref={sectionRef}
      className="relative w-full bg-zinc-950 text-white"
      style={{ height: `${sectionHeightVh}vh` }}
      aria-label="Featured work"
    >
      {/* Sticky viewport: content stays fixed while user scrolls through the section */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col">
        {/* Background: semi-transparent project names strip — moves horizontally with scroll */}
        <div
          className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div
            ref={stripRef}
            className={cn(
              "flex gap-8 md:gap-16 whitespace-nowrap text-zinc-500/40 uppercase tracking-widest text-2xl md:text-4xl lg:text-5xl font-medium pl-4",
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

        {/* Full-width layout: left details + image takes whole width (img2 design) */}
        <div className="relative z-10 flex-1 flex flex-col justify-center min-h-0">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured projects"
            className="flex flex-col h-full"
          >
            {/* Main: left column (details) + right column (image full width) */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,400px)_1fr] gap-8 lg:gap-12 items-stretch flex-1 min-h-0 px-4 sm:px-6 lg:px-8">
              {/* Left: index, title, category — img2 style */}
              <div className="order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex flex-col gap-2">
                  <span
                    className="text-zinc-500 text-sm font-medium tabular-nums"
                    aria-hidden
                  >
                    {activeItem.caseNumber}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                    {activeItem.title}
                  </h2>
                  <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                    {activeItem.category}
                  </p>
                </div>
              </div>

              {/* Right: image constrained to fit within section boundary */}
              <div className="order-1 lg:order-2 relative w-full max-w-4xl max-h-[45vh] sm:max-h-[50vh] lg:max-h-[55vh] aspect-[3/4] lg:aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 justify-self-center lg:justify-self-end self-center">
                <Image
                  src={activeItem.image}
                  alt=""
                  fill
                  className={cn(
                    "object-cover",
                    reducedMotion ? "" : "transition-opacity duration-300"
                  )}
                  sizes="100vw"
                  priority={activeIndex === 0}
                />
              </div>
            </div>

            {/* Footer: bottom-left label, bottom-right CTAs, nav — contained for alignment */}
            <Container className="shrink-0 pt-4 mt-auto">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4 border-t border-zinc-800">
                <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                  {featuredWorkConfig.footerLabel}
                </span>

                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                  <Link
                    href={`/projects/${activeItem.slug}`}
                    className="text-sm font-medium text-white hover:text-zinc-300 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                    aria-label={`View project: ${activeItem.title}`}
                  >
                    {featuredWorkConfig.viewProjectLabel}
                  </Link>
                  <Link
                    href={featuredWorkConfig.contactHref}
                    className="text-sm font-medium text-white hover:text-zinc-300 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                    aria-label="Let's talk"
                  >
                    {featuredWorkConfig.letsTalkLabel}
                  </Link>

                  <div className="flex items-center gap-2" role="group" aria-label="Carousel navigation">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                      aria-label="Previous project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-zinc-500 text-sm tabular-nums min-w-[3ch]">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={goNext}
                      className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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
