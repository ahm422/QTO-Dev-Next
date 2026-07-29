import Link from "next/link";
import { PageHero } from "@/components/hero/PageHero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { getPageBackground } from "@/config/pageBackgrounds";
import { productsPageConfig } from "@/config/productsPage";

type HeroConfig = (typeof productsPageConfig)["hero"];

const HEADING_ID = "products-hero-heading";

export function ProductsHeroSection({
  hero: heroOverride,
}: {
  hero?: Partial<HeroConfig> & { ctaHref?: string | null };
}) {
  const hero = { ...productsPageConfig.hero, ...heroOverride };
  const showCta = Boolean(hero.ctaHref);

  return (
    <PageHero
      backgroundImage={getPageBackground("/products")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
      minHeight="min-h-[70vh] flex items-center"
      showScrollIndicator
    >
      <div className="mt-8 inline-flex max-w-2xl flex-col gap-4 rounded-3xl border border-white/15 bg-white/8 p-4 backdrop-blur-md sm:p-5">
        {showCta && (
          <Link
            href={hero.ctaHref!}
            className={cn(
              "group inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-3.5 text-lg font-semibold transition-all duration-300 sm:justify-start",
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
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-white/82">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden />
            CMS-driven publishing
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 py-1.5">
            <AppIcon name="layers" size="xs" className="shrink-0" />
            Ordered product sections
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-3 py-1.5">
            <AppIcon name="link" size="xs" className="shrink-0" />
            Deep-link ready anchors
          </span>
        </div>
      </div>
    </PageHero>
  );
}
