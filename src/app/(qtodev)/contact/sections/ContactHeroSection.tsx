import { PageHero } from "@/components/hero/PageHero";
import { contactPageConfig } from "@/config/contactPage";
import { getPageBackground } from "@/config/pageBackgrounds";

type ContactPageConfigType = typeof contactPageConfig;

const HEADING_ID = "contact-hero-heading";

export function ContactHeroSection({ config }: { config?: ContactPageConfigType }) {
  const { hero } = config ?? contactPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/contact")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
    />
  );
}
