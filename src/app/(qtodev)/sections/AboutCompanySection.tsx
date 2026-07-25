"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Text } from "@/components/ui/shared/Text";
import { aboutCompanyConfig } from "@/config/aboutCompany";
type AboutCompanyConfigType = typeof aboutCompanyConfig;
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { Reveal } from "@/components/animations/Reveal";
import { InteractiveImage } from "@/components/animations/InteractiveImage";
import { TiltCard } from "@/components/animations/TiltCard";
import { staticImageUrl } from "@/config/staticImages";

const IMAGE_PRIMARY = staticImageUrl("/images/it-team-2.JPG");
const IMAGE_OVERLAP = staticImageUrl("/images/ITTeam.JPG");
const IMAGE_ALT_PRIMARY = "QTO DEV IT team at QTO House";
const IMAGE_ALT_OVERLAP = "QTO DEV team at QTO House event";

export function AboutCompanySection({ config }: { readonly config?: AboutCompanyConfigType }) {
  const {
    subtitle,
    title,
    titleHighlight,
    description,
    tags,
    exploreMoreHref,
  } = config ?? aboutCompanyConfig;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-t border-primary-foreground/10 py-24 md:py-32",
        "bg-gradient-to-br from-primary via-[#ea8620] to-[#c96f1a]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
      )}
      aria-labelledby="about-company-heading"
    >
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/15 blur-3xl"
        aria-hidden
      />
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
        <div
          className="mb-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent md:mb-14"
          aria-hidden
        />

        <Reveal staggerSelector="[data-reveal]">
          <div
            data-reveal
            className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center"
          >
            {/* Left column: copy */}
            <div className="order-1 text-primary-foreground">
              <div className="[&_h2]:text-white [&_h2_.bg-clip-text]:from-white [&_h2_.bg-clip-text]:via-white/95 [&_h2_.bg-clip-text]:to-cta-gold [&_div[aria-hidden]]:from-white/25 [&_div[aria-hidden]]:via-white/80 [&_div[aria-hidden]]:to-white/25">
                <SectionHeader
                  subtitle={subtitle}
                  subtitlePill
                  subtitleClassName="text-white/90 font-semibold tracking-widest border-white/20 bg-white/10 ring-white/15"
                  title={title}
                  titleHighlight={titleHighlight}
                  centered={false}
                  showAccentBar
                  headingId="about-company-heading"
                />
              </div>
              <Text
                size="base"
                color="default"
                className="text-primary-foreground/90 mb-6 max-w-xl mt-4"
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
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-3 mb-8">
                  {tags.map((tag) => (
                    <span
                      key={tag.label}
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
              ) : null}
            </div>

            {/* Right column: image collage */}
            <div className="order-2 flex justify-center lg:justify-end">
              <TiltCard className="relative w-full max-w-[420px] lg:max-w-[480px]" maxTilt={8}>
                <div className="relative aspect-[4/3] w-full">
                  <div className="absolute inset-0 overflow-hidden rounded-2xl bg-surface-muted shadow-xl ring-1 ring-black/10 ring-inset">
                    <InteractiveImage
                      src={IMAGE_PRIMARY}
                      alt={IMAGE_ALT_PRIMARY}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      tilt={false}
                      className="h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.03) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
                      }}
                    />
                  </div>
                  <div className="absolute -right-2 -bottom-2 md:-right-4 md:-bottom-4 w-[58%] aspect-[4/3] rounded-2xl overflow-hidden bg-surface-muted z-10 shadow-2xl ring-2 ring-white/90 ring-offset-2 ring-offset-primary">
                    <Image
                      src={IMAGE_OVERLAP}
                      alt={IMAGE_ALT_OVERLAP}
                      fill
                      sizes="(max-width: 1024px) 60vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
