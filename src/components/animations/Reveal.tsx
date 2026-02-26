"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/components/theme/cn";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

export function Reveal({
  className,
  children,
  /** Animate child elements matching selector with a stagger. */
  staggerSelector,
}: {
  className?: string;
  children: ReactNode;
  staggerSelector?: string;
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reducedMotion) {
        gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
        return;
      }

      const childrenEls = staggerSelector
        ? Array.from(el.querySelectorAll(staggerSelector))
        : [];

      // Avoid invisible content if selector doesn't match anything.
      const shouldStagger = childrenEls.length > 0;
      if (shouldStagger) {
        gsap.set(childrenEls, { opacity: 0, y: 18 });
      } else {
        gsap.set(el, { opacity: 0, y: 24 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      if (shouldStagger) {
        tl.to(childrenEls, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
        });
      } else {
        tl.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    },
    { dependencies: [reducedMotion, staggerSelector] }
  );

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}

