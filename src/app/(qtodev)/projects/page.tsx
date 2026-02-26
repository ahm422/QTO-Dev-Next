import { ProjectsHeroSection } from "./sections/ProjectsHeroSection";
import { ProjectsFilterAndGrid } from "./sections/ProjectsFilterAndGrid";
import { ProjectsPaginationSection } from "./sections/ProjectsPaginationSection";
import { ProjectsValueSection } from "./sections/ProjectsValueSection";
import { CTA } from "@/components/common/CTA";
import { projectsPageConfig } from "@/config/projectsPage";

export default function ProjectsPage() {
  const { cta } = projectsPageConfig;
  return (
    <>
      <ProjectsHeroSection />
      <ProjectsFilterAndGrid />
      <ProjectsPaginationSection />
      <ProjectsValueSection />
      <CTA
        title={cta.title}
        description={cta.description}
        primaryButtonText={cta.primaryButtonText}
        primaryButtonHref={cta.primaryButtonHref}
      />
    </>
  );
}
