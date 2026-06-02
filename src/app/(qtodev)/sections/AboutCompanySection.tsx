"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";
import { aboutCompanyConfig } from "@/config/aboutCompany";
import { PEXELS_TECH_IMAGES, PEXELS_ALT_TECH } from "@/config/pexelsImages";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";

const IMAGE_OFFICE = PEXELS_TECH_IMAGES[0];
const IMAGE_MEETING = PEXELS_TECH_IMAGES[1];
const IMAGE_ALT_OFFICE = PEXELS_ALT_TECH[0];
const IMAGE_ALT_MEETING = PEXELS_ALT_TECH[1];

export function AboutCompanySection() {
  const { subtitle, title, description, tags, exploreMoreHref } = aboutCompanyConfig;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-t border-primary-foreground/10 py-24 md:py-32",
        "bg-gradient-to-br from-primary via-[#ea8620] to-[#c96f1a]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      )}
      aria-labelledby="about-company-heading"
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/15 blur-3xl"
        aria-hidden
      />
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div
            data-reveal
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
          {/* Left column: imagery — no Explore More button on the image */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[420px] lg:max-w-[480px] aspect-[4/3]">
              {/* Larger card (background) — elevated with shadow */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-surface-muted shadow-xl ring-1 ring-black/10 ring-inset">
                <Image
                  src={IMAGE_OFFICE}
                  alt={IMAGE_ALT_OFFICE}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Subtle gradient overlay so CTA and card edges read well */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
                  }}
                />
              </div>
              {/* Smaller overlapping card (bottom-right) — framed */}
              <div className="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 w-[58%] aspect-[4/3] rounded-2xl overflow-hidden bg-surface-muted z-10 shadow-2xl ring-2 ring-white/90 ring-offset-2 ring-offset-primary">
                <Image
                  src={IMAGE_MEETING}
                  alt={IMAGE_ALT_MEETING}
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right column: label, heading, body, CTA, tags */}
          <div className="order-1 lg:order-2 text-primary-foreground">
            <p
              className="text-xs uppercase tracking-widest text-primary-foreground/80 mb-3 flex items-center gap-3"
              aria-hidden
            >
              <span className="inline-block w-6 h-px bg-primary-foreground/50" />
              {subtitle}
              <span className="inline-block w-6 h-px bg-primary-foreground/50" />
            </p>
            <Heading
              level={2}
              id="about-company-heading"
              className="text-white mb-4 text-3xl md:text-4xl lg:text-5xl"
            >
              {title}
            </Heading>
            <Text
              size="base"
              color="default"
              className="text-primary-foreground/90 mb-6 max-w-xl"
            >
              {description}
            </Text>
            <div className="mb-8">
              <Link
                href={exploreMoreHref}
                className={cn(
                  "group/about-cta inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full",
                  "bg-white text-primary font-semibold text-sm shadow-md",
                  "hover:bg-black hover:text-white hover:shadow-lg",
                  "active:scale-[0.98]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
                  "transition-[color,background-color,box-shadow,transform] duration-200"
                )}
              >
                About QTO DEV
                <AppIcon
                  name="arrow-right"
                  size="sm"
                  className="opacity-0 -translate-x-1 transition-all duration-200 group-hover/about-cta:opacity-100 group-hover/about-cta:translate-x-0"
                  aria-hidden
                />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                    "bg-white/15 border border-primary-foreground/20 text-primary-foreground"
                  )}
                >
                  <AppIcon name={tag.icon as AppIconName} size="sm" className="text-sm" />
                  <span className="text-sm font-medium">{tag.label}</span>
                </span>
              ))}
            </div>
          </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
