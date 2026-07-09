"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Scroll-in reveal via IntersectionObserver (issue #170).
 * Replaces per-instance GSAP ScrollTrigger for lower main-thread cost.
 */
export function Reveal({
  className,
  children,
  /** Animate child elements matching selector with a stagger. */
  staggerSelector,
  /** Delay between staggered children in ms (default 80). */
  staggerDelay = 80,
}: {
  className?: string;
  children: ReactNode;
  staggerSelector?: string;
  staggerDelay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.transition = "";
      if (staggerSelector) {
        el.querySelectorAll(staggerSelector).forEach((c) => {
          const h = c as HTMLElement;
          h.style.opacity = "";
          h.style.transform = "";
          h.style.transition = "";
        });
      }
      return;
    }

    if (visibleRef.current) return;

    const childrenEls = staggerSelector
      ? Array.from(el.querySelectorAll(staggerSelector))
      : [];
    const shouldStagger = childrenEls.length > 0;

    if (shouldStagger) {
      childrenEls.forEach((c) => {
        const h = c as HTMLElement;
        h.style.opacity = "0";
        h.style.transform = "translateY(18px)";
      });
    } else {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
    }
  }, [reducedMotion, staggerSelector]);

  useEffect(() => {
    if (reducedMotion) {
      visibleRef.current = true;
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        visibleRef.current = true;
        io.disconnect();

        const childrenEls = staggerSelector
          ? Array.from(el.querySelectorAll(staggerSelector))
          : [];
        const shouldStagger = childrenEls.length > 0;

        if (shouldStagger) {
          const delaySec = staggerDelay / 1000;
          childrenEls.forEach((c, i) => {
            const h = c as HTMLElement;
            const d = `${i * delaySec}s`;
            h.style.transition = `opacity 0.7s ease ${d}, transform 0.7s ease ${d}`;
            h.style.opacity = "1";
            h.style.transform = "translateY(0)";
          });
        } else {
          el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion, staggerSelector, staggerDelay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
