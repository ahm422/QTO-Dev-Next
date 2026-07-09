import { PageHero } from "@/components/hero/PageHero";
import { getPageBackground } from "@/config/pageBackgrounds";
import { projectsPageConfig } from "@/config/projectsPage";

type ProjectsPageConfigType = typeof projectsPageConfig;

const HEADING_ID = "projects-hero-heading";

export function ProjectsHeroSection({ config }: { config?: ProjectsPageConfigType }) {
  const { hero } = config ?? projectsPageConfig;

  return (
    <PageHero
      backgroundImage={getPageBackground("/projects")}
      badge={hero.badge}
      title={hero.heading}
      description={hero.subhead}
      headingId={HEADING_ID}
      imageClassName="projects-hero-media"
    />
  );
}
