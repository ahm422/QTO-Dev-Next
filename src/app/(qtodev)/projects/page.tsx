import { ProjectsHeroSection } from "./sections/ProjectsHeroSection";
import { ProjectsFilterAndGrid } from "./sections/ProjectsFilterAndGrid";
import { ProjectsValueSection } from "./sections/ProjectsValueSection";
import { CTA } from "@/components/common/CTA";
import { projectsPageConfig } from "@/config/projectsPage";
import { findPageSection } from "@/lib/cms/pageContent";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Projects | QTO Dev",
  description:
    "Browse QTO Dev case studies — selected web, product, and design work for modern businesses.",
  url: "/projects",
});

interface ProjectsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const cmsConfig = (await findPageSection("projects.page")) as typeof projectsPageConfig | null;
  const cfg = cmsConfig ?? projectsPageConfig;
  const { cta } = cfg;

  return (
    <>
      <ProjectsHeroSection config={cmsConfig ?? undefined} />
      <ProjectsFilterAndGrid
        config={cmsConfig ?? undefined}
        initialCategory={params.category}
      />
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
