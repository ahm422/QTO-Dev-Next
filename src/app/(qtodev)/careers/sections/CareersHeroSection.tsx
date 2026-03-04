"use client";

import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { careersPageConfig } from "@/config/careersPage";

const HEADING_ID = "careers-hero-heading";

export function CareersHeroSection() {
  const { hero } = careersPageConfig;

  return (
    <section
      className="relative py-24 md:py-32 lg:py-36 bg-primary text-primary-foreground overflow-hidden"
      aria-labelledby={HEADING_ID}
    >
      {/* Decorative background headline */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        aria-hidden
      >
        <p
          className="font-heading text-center font-bold uppercase tracking-wide text-primary-foreground/6 select-none whitespace-nowrap px-4"
          style={{
            fontSize: "clamp(4rem, 18vw, 14rem)",
            lineHeight: 1,
          }}
        >
          Careers
        </p>
      </div>

      {/* Rich gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(ellipse 70% 50% at 80% 80%, rgba(255,255,255,0.06) 0%, transparent 45%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 60%)",
        }}
      />

      <Container className="relative z-20">
        <div className="max-w-2xl">
          <Heading
            id={HEADING_ID}
            level={1}
            className="text-primary-foreground mb-6 font-heading tracking-tight"
          >
            {hero.heading}
          </Heading>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed max-w-xl">
            {hero.subhead}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={hero.primaryCtaHref}
              className={cn(
                "group inline-flex items-center gap-3 font-semibold rounded-xl transition-all duration-300",
                "px-7 py-3.5 text-lg",
                "bg-primary-foreground text-primary hover:bg-primary-foreground/95",
                "shadow-xl shadow-black/15 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              )}
            >
              {hero.primaryCtaText}
              <AppIcon
                name="arrow-right"
                size="sm"
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={hero.secondaryCtaHref}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/80 text-primary-foreground px-6 py-3 text-base font-semibold",
                "hover:bg-primary-foreground/10 transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              )}
            >
              {hero.secondaryCtaText}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

