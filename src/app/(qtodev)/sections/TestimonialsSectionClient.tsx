"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { testimonialsConfig } from "@/config/testimonials";
type TestimonialsConfigType = typeof testimonialsConfig;
import type { TestimonialItem } from "@/types/testimonials";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const HEADING_ID = "testimonials-heading";

function goPrev(index: number, total: number) {
  return index <= 0 ? total - 1 : index - 1;
}

function goNext(index: number, total: number) {
  return index >= total - 1 ? 0 : index + 1;
}

function isImagePosterUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function TestimonialMedia({ item }: { item: TestimonialItem }) {
  const { mediaType, mediaUrl, mediaAlt } = item;

  if (mediaType === "image" && mediaUrl) {
    return (
      <Image
        src={mediaUrl}
        alt={mediaAlt ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    );
  }

  if (mediaType === "video" && mediaUrl) {
    const poster = isImagePosterUrl(mediaAlt) ? mediaAlt : undefined;
    return (
      <video
        src={mediaUrl}
        controls
        playsInline
        poster={poster}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-foreground-muted">
      <svg
        className="h-10 w-10 opacity-40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-sm">No media</span>
    </div>
  );
}

function QuoteIcon() {
  return (
    <svg
      className="w-12 h-12 md:w-14 md:h-14 text-primary/30 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

export function TestimonialsSectionClient({ items , config}: { items: TestimonialItem[] ; config?: TestimonialsConfigType}) {
  const cfg = config ?? testimonialsConfig;
  if (items.length === 0) return null;
  const [activeIndex, setActiveIndex] = useState(0);
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
      className={cn(
        "relative overflow-hidden py-24 md:py-32",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[420px] h-[320px] rounded-full bg-primary/[0.05] dark:bg-primary/[0.07] blur-3xl -translate-y-1/2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[380px] h-[260px] rounded-full bg-primary/[0.04] dark:bg-primary/[0.06] blur-3xl translate-y-1/2"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
            <SectionHeader
              subtitle={cfg.subtitle}
              subtitleClassName="text-primary font-semibold tracking-[0.2em]"
              subtitlePill
              title={cfg.title}
              titleHighlight={cfg.titleHighlight}
              headingId={HEADING_ID}
            />
          </div>

          <div
            data-reveal
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 items-stretch"
          >
            {/* Left: quote card + author + controls */}
            <div className="flex flex-col lg:min-h-[360px]">
              <div
                className={cn(
                  "relative flex-1 rounded-2xl border border-border bg-background p-6 md:p-8",
                  "shadow-sm transition-shadow duration-300 hover:shadow-md",
                  "flex flex-col"
                )}
              >
                {/* Accent bar */}
                <div
                  className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-primary/70"
                  aria-hidden
                />
                <div className="pl-5 flex flex-col flex-1">
                  <div className="flex gap-4 mb-5">
                    <QuoteIcon />
                    <blockquote
                      key={activeIndex}
                      className="text-lg md:text-xl text-foreground leading-relaxed flex-1"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {activeItem?.quote}
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    {activeItem?.avatar ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <Image
                          src={activeItem.avatar}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                        aria-hidden
                      >
                        <span className="text-primary font-bold text-xl">
                          {activeItem?.authorName?.charAt(0) ?? "?"}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {activeItem?.authorName}
                      </p>
                      <p className="text-sm text-foreground-muted truncate">
                        {activeItem?.authorTitle} · {activeItem?.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carousel controls */}
              <div
                className="flex items-center justify-between gap-4 mt-6"
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
                        "h-2.5 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        i === activeIndex
                          ? "w-8 bg-primary"
                          : "w-2.5 bg-foreground-muted/35 hover:bg-foreground-muted/55"
                      )}
                      aria-label={`Go to testimonial ${i + 1}`}
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

            {/* Right: testimonial media */}
            <div
              className={cn(
                "relative rounded-2xl overflow-hidden aspect-[4/3] min-h-[260px]",
                "bg-surface-muted dark:bg-white/5 border border-border",
                "shadow-md hover:shadow-lg transition-shadow duration-300"
              )}
            >
              {activeItem && <TestimonialMedia item={activeItem} />}
              {activeItem &&
                (activeItem.mediaType === "image" || activeItem.mediaType === "video") &&
                activeItem.mediaUrl && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-5 py-4 pointer-events-none">
                    <p className="text-sm font-medium text-white/95">
                      {activeItem.authorName} — {activeItem.company}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
