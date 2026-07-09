import { PageHero } from "@/components/hero/PageHero";
import { getPageBackground } from "@/config/pageBackgrounds";
import { blogsPageConfig } from "@/config/blogsPage";

type BlogsPageConfigType = typeof blogsPageConfig;

const HEADING_ID = "blogs-hero-heading";

export function BlogsHeroSection({ config }: { config?: BlogsPageConfigType }) {
  const { hero } = config ?? blogsPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/blogs")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
    />
  );
}
