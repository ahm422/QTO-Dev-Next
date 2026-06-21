import { ProjectsHeroSection } from "./sections/ProjectsHeroSection";
import { ProjectsFilterAndGrid } from "./sections/ProjectsFilterAndGrid";
import { ProjectsPaginationSection } from "./sections/ProjectsPaginationSection";
import { ProjectsValueSection } from "./sections/ProjectsValueSection";
import { CTA } from "@/components/common/CTA";
import { projectsPageConfig } from "@/config/projectsPage";
import { findPageSection } from "@/lib/cms/pageContent";

interface ProjectsPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const [cmsConfig, sp] = await Promise.all([
    findPageSection("projects.page") as Promise<typeof projectsPageConfig | null>,
    searchParams,
  ]);
  const cfg = cmsConfig ?? projectsPageConfig;
  const { cta } = cfg;
  return (
    <>
      <ProjectsHeroSection config={cmsConfig ?? undefined} />
      <ProjectsFilterAndGrid activeCategory={sp?.category} />
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
