import { ProjectsHeroSection } from "./sections/ProjectsHeroSection";
import { ProjectsFilterAndGrid } from "./sections/ProjectsFilterAndGrid";
import { ProjectsPaginationSection } from "./sections/ProjectsPaginationSection";
import { ProjectsValueSection } from "./sections/ProjectsValueSection";
import { CTA } from "@/components/common/CTA";
import { projectsPageConfig } from "@/config/projectsPage";
import { findPageSection } from "@/lib/cms/pageContent";

export default async function ProjectsPage() {
  const cmsConfig = await findPageSection("projects.page") as typeof projectsPageConfig | null;
  const cfg = cmsConfig ?? projectsPageConfig;
  const { cta } = cfg;
  return (
    <>
      <ProjectsHeroSection config={cmsConfig ?? undefined} />
      <ProjectsFilterAndGrid config={cmsConfig ?? undefined} />
      <ProjectsPaginationSection />
      <ProjectsValueSection config={cmsConfig ?? undefined} />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
