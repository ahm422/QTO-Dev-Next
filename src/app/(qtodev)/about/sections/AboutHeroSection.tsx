import Link from "next/link";
import { PageHero } from "@/components/hero/PageHero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { getPageBackground } from "@/config/pageBackgrounds";
import { aboutPageConfig } from "@/config/aboutPage";

type AboutPageConfigType = typeof aboutPageConfig;

const HEADING_ID = "about-hero-heading";

export function AboutHeroSection({ config }: { config?: AboutPageConfigType }) {
  const { hero } = config ?? aboutPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/about")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
      minHeight="min-h-[70vh] flex items-center"
      showScrollIndicator
    >
      <Link
        href={hero.ctaHref}
        className={cn(
          "group mt-8 inline-flex items-center gap-3 rounded-xl px-7 py-3.5 text-lg font-semibold transition-all duration-300",
          "bg-white text-black hover:bg-white/95",
          "shadow-xl shadow-black/15 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/20",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-bg"
        )}
      >
        {hero.ctaText}
        <AppIcon
          name="arrow-right"
          size="sm"
          className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </PageHero>
  );
}
