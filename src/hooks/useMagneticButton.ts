"use client";

import { useEffect, useRef, type RefObject } from "react";

const LG_QUERY = "(min-width: 1024px)";
const SPRING = 0.18;

/**
 * Subtle cursor-pull on hover for CTA buttons (desktop only).
 * Disabled when `enabled` is false (reduced motion).
 */
export function useMagneticButton(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  strength = 0.35
): void {
  const strengthRef = useRef(strength);
  strengthRef.current = strength;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const mq = window.matchMedia(LG_QUERY);
    let hovering = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;

    const apply = () => {
      el.style.transform = `translate3d(${currentX.toFixed(2)}px,${currentY.toFixed(2)}px,0)`;
    };

    const reset = () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.transform = "";
      el.style.willChange = "";
    };

    const tick = () => {
      currentX += (targetX - currentX) * SPRING;
      currentY += (targetY - currentY) * SPRING;
      apply();

      const settled =
        Math.abs(targetX - currentX) < 0.05 && Math.abs(targetY - currentY) < 0.05;

      if (hovering || !settled) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        el.style.willChange = "";
      }
    };

    const ensureLoop = () => {
      if (rafId == null) {
        el.style.willChange = "transform";
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerEnter = () => {
      if (!mq.matches) return;
      hovering = true;
      ensureLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!hovering || !mq.matches) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      targetX = dx * strengthRef.current;
      targetY = dy * strengthRef.current;
      ensureLoop();
    };

    const onPointerLeave = () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
      ensureLoop();
    };

    const onMqChange = () => {
      if (!mq.matches) reset();
    };

    el.addEventListener("pointerenter", onPointerEnter, { passive: true });
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave);
    mq.addEventListener("change", onMqChange);

    return () => {
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      mq.removeEventListener("change", onMqChange);
      reset();
    };
  }, [ref, enabled, strength]);
}
