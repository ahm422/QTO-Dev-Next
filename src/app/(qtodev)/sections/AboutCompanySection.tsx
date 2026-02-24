import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Heading } from "@/components/ui/shared/Heading";
import { Text } from "@/components/ui/shared/Text";
import { aboutCompanyConfig } from "@/config/aboutCompany";
import { aboutData } from "@/data/about";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import type { AppIconName } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";

/** Format stat value for display (e.g. 20500 → "20.5 k", 200 → "200") */
function formatStat(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} k`;
  }
  return String(value);
}

const IMAGE_ALT_OFFICE = "Office collaboration scene";
const IMAGE_ALT_MEETING = "Team meeting or workshop";

export function AboutCompanySection() {
  const { subtitle, title, description, tags, exploreMoreLabel, exploreMoreHref, statLabels } =
    aboutCompanyConfig;
  const { projects, clients, team } = aboutData.company;
  const statValues = [projects, clients, team];

  return (
    <section
      className={cn(
        "relative py-16 md:py-20 bg-primary border-t border-b border-primary-foreground/10 overflow-hidden"
      )}
      aria-labelledby="about-company-heading"
    >
      {/* Optional decorative wavy corners */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-32 h-32 opacity-20"
        aria-hidden
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary-foreground/30">
          <path
            fill="currentColor"
            d="M0 50 Q25 20 50 50 T100 50 V0 H0 Z"
          />
        </svg>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-40 h-40 opacity-20"
        aria-hidden
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary-foreground/30">
          <path
            fill="currentColor"
            d="M100 50 Q75 80 50 50 T0 50 V100 H100 Z"
          />
        </svg>
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left column: imagery + CTA — order second on mobile so content appears first */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md aspect-[4/3]">
              {/* Larger card (background) */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg bg-surface-muted">
                <Image
                  src="/images/about-company/office-collab.svg"
                  alt={IMAGE_ALT_OFFICE}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {/* Smaller overlapping card (bottom-right) */}
              <div className="absolute -right-4 -bottom-4 w-[60%] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-primary bg-surface-muted z-10">
                <Image
                  src="/images/about-company/meeting-workshop.svg"
                  alt={IMAGE_ALT_MEETING}
                  fill
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {/* Circular Explore More CTA (top-right of larger card) */}
              <Link
                href={exploreMoreHref}
                className={cn(
                  "absolute top-4 right-4 z-20 w-16 h-16 rounded-full bg-black text-white",
                  "flex items-center justify-center",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
                  "hover:opacity-90 transition-opacity"
                )}
                aria-label="Explore more"
              >
                <svg
                  viewBox="0 0 64 64"
                  className="w-full h-full"
                  aria-hidden
                >
                  <defs>
                    <path
                      id="about-company-cta-circle"
                      d="M 32 8 A 24 24 0 1 1 31.99 8"
                      fill="none"
                    />
                  </defs>
                  <text className="text-[5px] fill-white font-semibold uppercase">
                    <textPath href="#about-company-cta-circle" startOffset="0">
                      {exploreMoreLabel}
                    </textPath>
                  </text>
                  <path
                    d="M28 34 L32 38 L36 34"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right column: label, heading, body, tags, stats */}
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
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {statLabels.map((label, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                    {formatStat(statValues[i] ?? 0)}
                  </div>
                  <p className="text-sm text-primary-foreground/80 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
