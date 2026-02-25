"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { testimonialsConfig } from "@/config/testimonials";
import { testimonialsItems } from "@/data/testimonials";
import { cn } from "@/components/theme/cn";
import type { TestimonialItem } from "@/types/testimonials";

const HEADING_ID = "testimonials-heading";

function goPrev(index: number, total: number) {
  return index <= 0 ? total - 1 : index - 1;
}

function goNext(index: number, total: number) {
  return index >= total - 1 ? 0 : index + 1;
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = testimonialsItems;
  const activeItem: TestimonialItem | undefined = items[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => goPrev(i, items.length));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => goNext(i, items.length));
  }, [items.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlePrev, handleNext]);

  if (items.length === 0) return null;

  return (
    <section
      className="relative py-16 md:py-20 bg-[#FBF6EA] dark:bg-[#1a1914] overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      <Container className="relative">
        <SectionHeader
          subtitle={testimonialsConfig.subtitle}
          subtitleClassName="text-primary"
          title={testimonialsConfig.title}
          titleHighlight={testimonialsConfig.titleHighlight}
          headingId={HEADING_ID}
        />

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-stretch"
        >
          {/* Left column: quote, author, carousel controls */}
          <div className="flex flex-col">
            <div className="flex-1">
              <span
                className="text-6xl md:text-7xl font-serif text-primary/40 leading-none block mb-4"
                aria-hidden
              >
                "
              </span>
              <blockquote
                className="text-lg md:text-xl text-foreground dark:text-[#f5f0e6] leading-relaxed mb-6"
                aria-live="polite"
                aria-atomic="true"
              >
                {activeItem?.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                {activeItem?.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-muted">
                    <Image
                      src={activeItem.avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                    aria-hidden
                  >
                    <span className="text-primary font-semibold text-lg">
                      {activeItem?.authorName?.charAt(0) ?? "?"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-foreground dark:text-[#f5f0e6]">
                    {activeItem?.authorName}
                  </p>
                  <p className="text-sm text-foreground-muted dark:text-[#f5f0e6]/80">
                    {activeItem?.authorTitle}, {activeItem?.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Carousel controls: dots + prev/next */}
            <div
              className="flex items-center gap-3 mt-8 pt-6 border-t border-border dark:border-white/10"
              role="group"
              aria-label="Carousel navigation"
            >
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Previous testimonial"
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
                      "w-2.5 h-2.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      i === activeIndex
                        ? "bg-primary"
                        : "bg-foreground-muted/40 hover:bg-foreground-muted/60"
                    )}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Next testimonial"
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
          </div>

          {/* Right column: media block with play button */}
          <div className="relative rounded-2xl overflow-hidden bg-surface-muted dark:bg-white/5 border border-border dark:border-white/10 aspect-[4/3] min-h-[240px]">
            {activeItem?.thumbnailUrl ? (
              <Image
                src={activeItem.thumbnailUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-foreground-muted text-sm">
                Media placeholder
              </div>
            )}
            {/* Centered golden play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center shadow-lg transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                aria-hidden
              >
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Optional caption: author + company */}
            {activeItem && (
              <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                <p className="text-sm text-white/90 font-medium">
                  {activeItem.authorName} — {activeItem.company}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
