import { ProjectsHeroSection } from "./sections/ProjectsHeroSection";
import { ProjectsFilterAndGrid } from "./sections/ProjectsFilterAndGrid";
import { ProjectsPaginationSection } from "./sections/ProjectsPaginationSection";
import { ProjectsValueSection } from "./sections/ProjectsValueSection";
import { CTA } from "@/components/common/CTA";
import { projectsPageConfig } from "@/config/projectsPage";

interface ProjectsPageProps {
  searchParams?: Promise<{
    category?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { cta } = projectsPageConfig;
  const sp = searchParams ? await searchParams : undefined;
  return (
    <>
      <ProjectsHeroSection />
      <ProjectsFilterAndGrid activeCategory={sp?.category} />
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
