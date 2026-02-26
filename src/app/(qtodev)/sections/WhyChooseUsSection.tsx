"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";
import { whyChooseUsConfig } from "@/config/whyChooseUs";
import { whyChooseUsItems } from "@/data/whyChooseUs";

const HEADING_ID = "why-choose-us-heading";

export function WhyChooseUsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const items = whyChooseUsItems;
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
      className="py-16 md:py-20 bg-[#FDF8ED] dark:bg-[#0f0f0f]"
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column: heading, body, CTA */}
          <div className="flex flex-col gap-4">
            <Heading level={2} className="text-foreground" id={HEADING_ID}>
              {whyChooseUsConfig.heading}
            </Heading>
            <Text size="lg" color="muted" className="max-w-xl">
              {whyChooseUsConfig.body}
            </Text>
            <Link
              href={whyChooseUsConfig.ctaHref}
              className="inline-flex items-center gap-2 w-fit font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDF8ED] dark:focus-visible:ring-offset-[#0f0f0f]"
            >
              {whyChooseUsConfig.ctaLabel}
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Right column: carousel card */}
          <div
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Why choose us benefits"
            tabIndex={0}
            className="rounded-2xl bg-primary text-white p-6 sm:p-8 shadow-lg min-h-[240px] flex flex-col border border-black/10 dark:border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDF8ED] dark:focus-visible:ring-offset-[#0f0f0f]"
          >
            <span
              className="text-white/80 text-xs font-medium uppercase tracking-wider mb-3 block"
              aria-hidden
            >
              {whyChooseUsConfig.cardLabel}
            </span>
            {currentItem && (
              <>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">
                  {currentItem.title}
                </h3>
                <p className="text-white/90 text-sm sm:text-base flex-1">
                  {currentItem.description}
                </p>
              </>
            )}
            <div
              className="flex items-center gap-2 mt-6"
              role="group"
              aria-label="Carousel navigation"
            >
              <button
                type="button"
                onClick={goPrev}
                className="w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                aria-label="Previous benefit"
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
              <button
                type="button"
                onClick={goNext}
                className="w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                aria-label="Next benefit"
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
              <span className="text-white/70 text-sm tabular-nums ml-2" aria-live="polite">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
