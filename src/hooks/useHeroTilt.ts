"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface HeroPointerNorm {
  readonly x: number;
  readonly y: number;
}

interface HeroTiltAngles {
  rotateX: number;
  rotateY: number;
  translateX: number;
  translateY: number;
}

interface RectCache {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Idle / unhovered pose — flat. */
const IDLE: HeroTiltAngles = {
  rotateX: 0,
  rotateY: 0,
  translateX: 0,
  translateY: 0,
};

const MAX_DELTA = 12;
const MAX_SHIFT = 10;
/** Follow feel — snappy but still smooth (~2–3 frames at 60fps). */
const FOLLOW_TAU = 0.055;
/** Slightly softer return to flat on leave. */
const REST_TAU = 0.09;

const LG_QUERY = "(min-width: 1024px)";
const SETTLE_ROT = 0.03;
const SETTLE_SHIFT = 0.08;

function mapPointerToTarget(nx: number, ny: number): HeroTiltAngles {
  const x = Math.max(-1, Math.min(1, nx));
  const y = Math.max(-1, Math.min(1, ny));
  return {
    rotateX: -y * MAX_DELTA,
    rotateY: x * MAX_DELTA,
    translateX: x * MAX_SHIFT,
    translateY: y * MAX_SHIFT,
  };
}

function applyTransform(el: HTMLElement, a: HeroTiltAngles) {
  // Single composite style write — keep values short for less GC churn
  el.style.transform = `translate3d(${a.translateX.toFixed(2)}px,${a.translateY.toFixed(2)}px,0) rotateX(${a.rotateX.toFixed(2)}deg) rotateY(${a.rotateY.toFixed(2)}deg)`;
  el.style.setProperty("--hero-parallax-x", (a.rotateY / MAX_DELTA).toFixed(3));
  el.style.setProperty("--hero-parallax-y", (-a.rotateX / MAX_DELTA).toFixed(3));
}

function nearlyEqual(a: HeroTiltAngles, b: HeroTiltAngles): boolean {
  return (
    Math.abs(a.rotateX - b.rotateX) < SETTLE_ROT &&
    Math.abs(a.rotateY - b.rotateY) < SETTLE_ROT &&
    Math.abs(a.translateX - b.translateX) < SETTLE_SHIFT &&
    Math.abs(a.translateY - b.translateY) < SETTLE_SHIFT
  );
}

function cacheRect(el: HTMLElement): RectCache {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

/**
 * Flat until hover. While hovered: spring-smoothed 3D follow via a single rAF loop.
 * Rect is cached (refresh on enter / resize / scroll) to avoid layout thrash.
 * Desktop (`lg+`) only.
 */
export function useHeroTilt(
  hitRef: RefObject<HTMLElement | null>,
  tiltRef: RefObject<HTMLElement | null>,
  enabled: boolean
): void {
  const currentRef = useRef<HeroTiltAngles>({ ...IDLE });
  const targetRef = useRef<HeroTiltAngles>({ ...IDLE });
  const enabledRef = useRef(enabled);
  const hoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const rectRef = useRef<RectCache | null>(null);
  const lgMqRef = useRef<MediaQueryList | null>(null);

  enabledRef.current = enabled;

  useEffect(() => {
    const tiltEl = tiltRef.current;
    const hitEl = hitRef.current;

    const stopLoop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTsRef.current = 0;
    };

    const resetIdle = () => {
      hoveringRef.current = false;
      currentRef.current = { ...IDLE };
      targetRef.current = { ...IDLE };
      stopLoop();
      if (tiltEl) {
        applyTransform(tiltEl, IDLE);
        tiltEl.style.willChange = "";
      }
    };

    if (!enabled || !tiltEl || !hitEl) {
      resetIdle();
      return;
    }

    lgMqRef.current = window.matchMedia(LG_QUERY);
    tiltEl.style.transformStyle = "preserve-3d";
    applyTransform(tiltEl, IDLE);

    const isLg = () => lgMqRef.current?.matches ?? false;

    const refreshRect = () => {
      rectRef.current = cacheRect(hitEl);
    };

    const ensureLoop = () => {
      if (rafRef.current != null) return;
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    const tick = (ts: number) => {
      if (!enabledRef.current) {
        rafRef.current = null;
        return;
      }

      const prev = lastTsRef.current;
      lastTsRef.current = ts;
      const dt = prev === 0 ? 1 / 60 : Math.min(0.045, (ts - prev) / 1000);
      const tau = hoveringRef.current ? FOLLOW_TAU : REST_TAU;
      const alpha = 1 - Math.exp(-dt / tau);

      const tgt = targetRef.current;
      const cur = currentRef.current;
      const next: HeroTiltAngles = {
        rotateX: cur.rotateX + (tgt.rotateX - cur.rotateX) * alpha,
        rotateY: cur.rotateY + (tgt.rotateY - cur.rotateY) * alpha,
        translateX: cur.translateX + (tgt.translateX - cur.translateX) * alpha,
        translateY: cur.translateY + (tgt.translateY - cur.translateY) * alpha,
      };

      const settled = nearlyEqual(next, tgt);
      const applied = settled ? tgt : next;
      currentRef.current = applied;
      applyTransform(tiltEl, applied);

      // Keep looping while hovering or still returning to idle
      if (hoveringRef.current || !settled) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      rafRef.current = null;
      tiltEl.style.willChange = "";
    };

    const setTargetFromEvent = (e: PointerEvent) => {
      let rect = rectRef.current;
      if (!rect || rect.width === 0) {
        refreshRect();
        rect = rectRef.current;
      }
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRef.current = mapPointerToTarget(nx, ny);
    };

    const onPointerEnter = (e: PointerEvent) => {
      if (!isLg()) return;
      hoveringRef.current = true;
      refreshRect();
      tiltEl.style.willChange = "transform";
      setTargetFromEvent(e);
      ensureLoop();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!hoveringRef.current || !isLg()) return;
      setTargetFromEvent(e);
      ensureLoop();
    };

    const onPointerLeave = () => {
      hoveringRef.current = false;
      targetRef.current = { ...IDLE };
      ensureLoop();
    };

    const onViewportChange = () => {
      if (hoveringRef.current) refreshRect();
      if (!isLg() && (hoveringRef.current || !nearlyEqual(currentRef.current, IDLE))) {
        resetIdle();
      }
    };

    hitEl.addEventListener("pointerenter", onPointerEnter, { passive: true });
    hitEl.addEventListener("pointermove", onPointerMove, { passive: true });
    hitEl.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onViewportChange, { passive: true });
    window.addEventListener("scroll", onViewportChange, {
      passive: true,
      capture: true,
    });

    return () => {
      hitEl.removeEventListener("pointerenter", onPointerEnter);
      hitEl.removeEventListener("pointermove", onPointerMove);
      hitEl.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
      resetIdle();
    };
  }, [enabled, hitRef, tiltRef]);
}
