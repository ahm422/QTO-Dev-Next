"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { cn } from "@/components/theme/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function getStaggerTargets(
  el: HTMLElement,
  staggerSelector?: string
): HTMLElement[] {
  if (!staggerSelector) return [];

  // `> *` is not valid for querySelectorAll — use direct children instead.
  if (staggerSelector === "> *") {
    return Array.from(el.children) as HTMLElement[];
  }

  try {
    return Array.from(el.querySelectorAll(staggerSelector)) as HTMLElement[];
  } catch {
    return Array.from(el.children) as HTMLElement[];
  }
}

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
        getStaggerTargets(el, staggerSelector).forEach((c) => {
          c.style.opacity = "";
          c.style.transform = "";
          c.style.transition = "";
        });
      }
      return;
    }

    if (visibleRef.current) return;

    const childrenEls = getStaggerTargets(el, staggerSelector);
    const shouldStagger = childrenEls.length > 0;

    if (shouldStagger) {
      childrenEls.forEach((c) => {
        c.style.opacity = "0";
        c.style.transform = "translateY(18px)";
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

        const childrenEls = getStaggerTargets(el, staggerSelector);
        const shouldStagger = childrenEls.length > 0;

        if (shouldStagger) {
          const delaySec = staggerDelay / 1000;
          childrenEls.forEach((c, i) => {
            const d = `${i * delaySec}s`;
            c.style.transition = `opacity 0.7s ease ${d}, transform 0.7s ease ${d}`;
            c.style.opacity = "1";
            c.style.transform = "translateY(0)";
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
