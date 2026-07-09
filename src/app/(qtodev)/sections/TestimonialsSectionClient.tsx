"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { testimonialsConfig } from "@/config/testimonials";
type TestimonialsConfigType = typeof testimonialsConfig;
import type { TestimonialItem } from "@/types/testimonials";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";
import { TiltCard } from "@/components/animations/TiltCard";
import { useMotionEnabled } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const HEADING_ID = "testimonials-heading";
const STAR_COUNT = 5;

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

function QuoteAccent() {
  return (
    <svg
      className="pointer-events-none absolute -top-2 left-4 w-24 h-24 md:w-28 md:h-28 text-primary opacity-10"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

function StarRating({ animate: shouldAnimate }: { animate: boolean }) {
  return (
    <div className="flex items-center gap-1 mb-4" aria-label="5 out of 5 stars">
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <motion.span
          key={i}
          initial={shouldAnimate ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            shouldAnimate
              ? { delay: i * 0.06, duration: 0.25, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0 }
          }
          className="text-primary"
          aria-hidden
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </motion.span>
      ))}
    </div>
  );
}

function TestimonialQuoteCard({
  item,
  useTilt,
  motionAnimate,
}: {
  item: TestimonialItem;
  useTilt: boolean;
  motionAnimate: boolean;
}) {
  const inner = (
    <div
      className={cn(
        "relative flex-1 rounded-2xl border border-border bg-background p-6 md:p-8",
        "shadow-sm transition-shadow duration-300 hover:shadow-md",
        "flex flex-col overflow-hidden"
      )}
    >
      <QuoteAccent />
      <div
        className="absolute left-0 top-8 bottom-8 w-1 rounded-full bg-primary/70"
        aria-hidden
      />
      <div className="relative pl-5 flex flex-col flex-1">
        <StarRating animate={motionAnimate} />
        <blockquote className="text-lg md:text-xl text-foreground leading-relaxed flex-1">
          {item.quote}
        </blockquote>
        <div className="flex items-center gap-4 pt-6 mt-4 border-t border-border">
          {item.avatar ? (
            <div className="relative shrink-0">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,var(--theme-primary,#f48b22),var(--cta-gold,#d4a017),var(--theme-primary,#f48b22))]",
                  motionAnimate && "animate-spin [animation-duration:4s]"
                )}
                aria-hidden
              />
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-background">
                <Image
                  src={item.avatar}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            </div>
          ) : (
            <div
              className="relative shrink-0"
              aria-hidden
            >
              <div
                className={cn(
                  "absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,var(--theme-primary,#f48b22),var(--cta-gold,#d4a017),var(--theme-primary,#f48b22))]",
                  motionAnimate && "animate-spin [animation-duration:4s]"
                )}
              />
              <div className="relative w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-background">
                <span className="text-primary font-bold text-xl">
                  {item.authorName?.charAt(0) ?? "?"}
                </span>
              </div>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{item.authorName}</p>
            <p className="text-sm text-foreground-muted truncate">
              {item.authorTitle} · {item.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (useTilt) {
    return (
      <TiltCard className="h-full" maxTilt={5}>
        {inner}
      </TiltCard>
    );
  }

  return inner;
}

export function TestimonialsSectionClient({
  items,
  config,
}: {
  items: TestimonialItem[];
  config?: TestimonialsConfigType;
}) {
  const cfg = config ?? testimonialsConfig;
  const motionEnabled = useMotionEnabled();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const useTilt = motionEnabled && isDesktop;

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
            <div className="flex flex-col lg:min-h-[360px]">
              <div className="relative flex-1 min-h-[280px]">
                {items.length > 1 &&
                  items.map((item, i) => {
                    if (i === activeIndex) return null;
                    const offset = ((i - activeIndex + items.length) % items.length) - 1;
                    return (
                      <div
                        key={`stack-${item.id}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          transform: `translateY(${Math.abs(offset) * 8}px) scale(${0.96 - Math.abs(offset) * 0.02})`,
                          opacity: 0.35,
                          zIndex: 0,
                        }}
                        aria-hidden
                      >
                        <div className="h-full rounded-2xl border border-border/60 bg-background/60 blur-[1px]" />
                      </div>
                    );
                  })}

                <div className="relative z-10 h-full" aria-live="polite" aria-atomic="true">
                  <AnimatePresence mode="wait">
                    {activeItem && (
                      <motion.div
                        key={activeIndex}
                        initial={motionEnabled ? { opacity: 0, y: 12 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={motionEnabled ? { opacity: 0, y: -8 } : undefined}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full flex flex-col"
                      >
                        <TestimonialQuoteCard
                          item={activeItem}
                          useTilt={useTilt}
                          motionAnimate={motionEnabled}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              className={cn(
                "relative rounded-2xl overflow-hidden aspect-[4/3] min-h-[260px]",
                "bg-surface-muted dark:bg-white/5 border border-border",
                "shadow-md hover:shadow-lg transition-shadow duration-300"
              )}
            >
              <AnimatePresence mode="wait">
                {activeItem && (
                  <motion.div
                    key={`media-${activeIndex}`}
                    initial={motionEnabled ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={motionEnabled ? { opacity: 0 } : undefined}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    <TestimonialMedia item={activeItem} />
                    {(activeItem.mediaType === "image" || activeItem.mediaType === "video") &&
                      activeItem.mediaUrl && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-5 py-4 pointer-events-none">
                          <p className="text-sm font-medium text-white/95">
                            {activeItem.authorName} — {activeItem.company}
                          </p>
                        </div>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
