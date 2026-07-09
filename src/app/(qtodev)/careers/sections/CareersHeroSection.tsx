import Link from "next/link";
import { PageHero } from "@/components/hero/PageHero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { careerPortalHomeUrl } from "@/config/careersPortal";
import { getPageBackground } from "@/config/pageBackgrounds";
import { careersPageConfig } from "@/config/careersPage";

type CareersPageConfigType = typeof careersPageConfig;

const HEADING_ID = "careers-hero-heading";

export function CareersHeroSection({ config }: { config?: CareersPageConfigType }) {
  const { hero } = config ?? careersPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/careers")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
    >
      <div className="mt-10 flex flex-col gap-4 sm:flex-row animation-delay-300 animate-hero-content-fade animation-fill-backwards">
        <Link
          href={hero.primaryCtaHref}
          className={cn(
            "group inline-flex items-center justify-center gap-3 rounded-xl px-7 py-3.5 text-lg font-semibold transition-all duration-300",
            "bg-white text-black hover:bg-white/95",
            "shadow-xl shadow-black/15 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-bg"
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
          href={hero.secondaryCtaHref ?? "#"}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/90 px-6 py-3 text-base font-semibold text-white",
            "transition-all duration-300 hover:bg-white/10",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-bg"
          )}
        >
          {hero.secondaryCtaText}
        </Link>
      </div>
      <p className="mt-9 max-w-lg text-sm leading-relaxed text-white/80 animation-delay-300 animate-hero-content-fade animation-fill-backwards">
        Official applications and job listings are hosted on the{" "}
        <a
          href={careerPortalHomeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline-offset-4 hover:text-white hover:underline"
        >
          QTO House career portal
        </a>
        .
      </p>
    </PageHero>
  );
}
