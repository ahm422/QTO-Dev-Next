import { PageHero } from "@/components/hero/PageHero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { contactPageConfig } from "@/config/contactPage";
import { getPageBackground } from "@/config/pageBackgrounds";

type ContactPageConfigType = typeof contactPageConfig;

const HEADING_ID = "contact-hero-heading";

const scrollCtaClassName = cn(
  "mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/90 px-6 py-3 text-base font-semibold text-white",
  "transition-all duration-300 hover:bg-white/10",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-bg"
);

export function ContactHeroSection({ config }: { config?: ContactPageConfigType }) {
  const { hero } = config ?? contactPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/contact")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
    >
      <a href="#contact-form" className={scrollCtaClassName}>
        Send a message
        <AppIcon name="arrow-right" size="sm" className="shrink-0" />
      </a>
    </PageHero>
  );
}
