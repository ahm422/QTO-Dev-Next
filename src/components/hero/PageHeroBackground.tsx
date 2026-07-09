"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PARALLAX_FACTOR = 0.25;

export function PageHeroBackground({
  backgroundImage,
  imageClassName,
  showOverlay = true,
}: {
  backgroundImage: string;
  imageClassName?: string;
  showOverlay?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const update = () => {
      const el = wrapperRef.current;
      if (el) {
        const y = window.scrollY * PARALLAX_FACTOR;
        el.style.transform = `scale(1.08) translateY(${y}px)`;
      }
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        ref={wrapperRef}
        className="absolute inset-0 will-change-transform"
        style={reducedMotion ? { transform: "scale(1.08)" } : undefined}
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          quality={75}
          sizes="100vw"
          className={cn("object-cover", imageClassName)}
        />
      </div>
      {showOverlay && <div className="absolute inset-0 page-hero-image-bg" aria-hidden />}
    </div>
  );
}
