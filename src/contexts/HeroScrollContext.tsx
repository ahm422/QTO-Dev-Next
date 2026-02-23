"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useLayoutEffect,
  type ReactNode,
  type RefObject,
} from "react";

type HeroScrollContextValue = {
  sentinelRef: RefObject<HTMLDivElement | null>;
  ready: boolean;
};

const HeroScrollContext = createContext<HeroScrollContextValue | null>(null);

export function HeroScrollProvider({ children }: { children: ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => setReady(true), []);
  return (
    <HeroScrollContext.Provider value={{ sentinelRef, ready }}>
      {/* Zero-height sentinel at document top so ScrollTrigger "top top" = scroll 0 */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden />
      {children}
    </HeroScrollContext.Provider>
  );
}

export function useHeroScrollSentinel() {
  return useContext(HeroScrollContext);
}
