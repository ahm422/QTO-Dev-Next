import { PageHero } from "@/components/hero/PageHero";
import { getPageBackground } from "@/config/pageBackgrounds";
import { servicesPageConfig } from "@/config/servicesPage";

type ServicesPageConfigType = typeof servicesPageConfig;

const HEADING_ID = "services-hero-heading";

export function ServicesHeroSection({ config }: { config?: ServicesPageConfigType }) {
  const { hero } = config ?? servicesPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/services")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
    />
  );
}
