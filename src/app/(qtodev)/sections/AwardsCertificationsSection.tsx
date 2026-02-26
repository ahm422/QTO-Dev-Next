"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { awardsCertificationsConfig } from "@/config/awardsCertifications";
import { awardsCertifications } from "@/data/awardsCertifications";
import type { AwardCertification } from "@/types/awardCertification";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

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

const CARD_MIN_WIDTH = 320;
const CARD_MIN_HEIGHT = 160;
const MARQUEE_DURATION = 50;

function AwardCard({ item }: { item: AwardCertification }) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-xl border border-border bg-surface p-8",
        "shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300",
        "flex flex-col items-center justify-center text-center gap-4",
        "min-h-[var(--card-min-height)]"
      )}
      style={{
        minWidth: CARD_MIN_WIDTH,
        maxWidth: CARD_MIN_WIDTH,
        ["--card-min-height" as string]: `${CARD_MIN_HEIGHT}px`,
      }}
    >
      {item.logoUrl ? (
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.logoUrl}
            alt=""
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>
      ) : (
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center",
            "bg-primary/10 text-primary"
          )}
          aria-hidden
        >
          <AppIcon name="shield-halved" size="lg" />
        </div>
      )}
      <span className="font-semibold text-foreground text-lg leading-tight">
        {item.name}
      </span>
    </div>
  );
}

export function AwardsCertificationsSection() {
  const reducedMotion = useReducedMotion();

  const duplicatedItems = [...awardsCertifications, ...awardsCertifications];

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-surface-muted border-y border-border"
      )}
      aria-labelledby="awards-certifications-heading"
    >
      {/* Subtle top gradient fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface to-transparent z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent z-10"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal-block]">
          <div data-reveal-block className="mb-14 md:mb-16">
            <SectionHeader
              subtitle={awardsCertificationsConfig.subtitle}
              subtitleClassName="text-primary font-semibold tracking-widest"
              title={awardsCertificationsConfig.title}
              titleHighlight={awardsCertificationsConfig.titleHighlight}
              description={awardsCertificationsConfig.description}
              headingId="awards-certifications-heading"
              centered
            />
          </div>
        </Reveal>

        <div
          className={cn(
            "relative -mx-4 md:-mx-6",
            reducedMotion ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden"
          )}
          aria-hidden="false"
        >
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Awards and certifications"
            className="flex w-full"
          >
            <div
              className={cn(
                "flex gap-8 py-4 shrink-0",
                !reducedMotion && "collaborations-marquee-track"
              )}
              style={{
                width: "max-content",
                ["--marquee-duration" as string]: reducedMotion
                  ? "0s"
                  : `${MARQUEE_DURATION}s`,
              }}
            >
              {duplicatedItems.map((item, index) => (
                <AwardCard key={`${item.id}-dup-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
