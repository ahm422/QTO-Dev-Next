import { PageHero } from "@/components/hero/PageHero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { getPageBackground } from "@/config/pageBackgrounds";

const HEADING_ID = "requirements-hero-heading";

const scrollCtaClassName = cn(
  "mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/90 px-6 py-3 text-base font-semibold text-white",
  "transition-all duration-300 hover:bg-white/10",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-bg"
);

interface RequirementsHeroProps {
  badge: string;
  title: string;
  description: string;
}

export function RequirementsHero({ badge, title, description }: RequirementsHeroProps) {
  return (
    <PageHero
      backgroundImage={getPageBackground("/requirements")}
      badge={badge}
      title={title}
      description={description}
      headingId={HEADING_ID}
    >
      <a href="#requirements-form" className={scrollCtaClassName}>
        Start your brief
        <AppIcon name="arrow-right" size="sm" className="shrink-0" />
      </a>
    </PageHero>
  );
}
