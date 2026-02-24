"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Card } from "@/components/ui/shared/Card";
import { awardsCertificationsConfig } from "@/config/awardsCertifications";
import { awardsCertifications } from "@/data/awardsCertifications";
import { cn } from "@/components/theme/cn";

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

const CARD_WIDTH = 260;
const MARQUEE_DURATION = 40;

export function AwardsCertificationsSection() {
  const reducedMotion = useReducedMotion();

  /* Duplicate items for seamless infinite loop (marquee scrolls 0 → -50%) */
  const duplicatedItems = [...awardsCertifications, ...awardsCertifications];

  return (
    <section
      className="py-16 bg-surface"
      aria-labelledby="awards-certifications-heading"
    >
      <Container>
        <SectionHeader
          subtitle={awardsCertificationsConfig.subtitle}
          title={awardsCertificationsConfig.title}
          titleHighlight={awardsCertificationsConfig.titleHighlight}
          description={awardsCertificationsConfig.description}
          headingId="awards-certifications-heading"
        />

        <div
          className={cn(
            "mt-12",
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
                "flex gap-6 py-2 shrink-0",
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
                <Card
                  key={`${item.id}-dup-${index}`}
                  className="shrink-0 p-6 flex items-center justify-center text-center min-h-[100px] hover:shadow-lg transition-shadow"
                  style={{ minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH }}
                >
                  <span className="font-medium text-foreground">{item.name}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
