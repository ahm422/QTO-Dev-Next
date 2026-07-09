import { PageHero } from "@/components/hero/PageHero";
import { AppIcon } from "@/components/ui/shared/AppIcon";
import { cn } from "@/components/theme/cn";
import { getPageBackground } from "@/config/pageBackgrounds";
import { projectsPageConfig } from "@/config/projectsPage";

type ProjectsPageConfigType = typeof projectsPageConfig;

const HEADING_ID = "projects-hero-heading";

const scrollCtaClassName = cn(
  "mt-8 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/90 px-6 py-3 text-base font-semibold text-white",
  "transition-all duration-300 hover:bg-white/10",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-hero-bg"
);

export function ProjectsHeroSection({ config }: { config?: ProjectsPageConfigType }) {
  const { hero } = config ?? projectsPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/projects")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
    >
      <a href="#projects-grid" className={scrollCtaClassName}>
        View projects
        <AppIcon name="arrow-right" size="sm" className="shrink-0" />
      </a>
    </PageHero>
  );
}
