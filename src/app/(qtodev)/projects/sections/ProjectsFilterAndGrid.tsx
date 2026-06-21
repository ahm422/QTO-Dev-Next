import { findPublishedProjects } from "@/lib/cms/projects";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { ProjectsFilterSection } from "./ProjectsFilterSection";
import { ProjectsGridSection } from "./ProjectsGridSection";
import type { Project } from "@/types/project";

const allLabel = projectsPageConfig.filter.allLabel;

function getCategories(projectsList: Project[]): string[] {
  const uniques = [...new Set(projectsList.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

export async function ProjectsFilterAndGrid({
  activeCategory,
  config,
}: {
  activeCategory?: string;
  config?: ProjectsPageConfigType;
}) {
  const cfg = config ?? projectsPageConfig;
  const projects = await findPublishedProjects();
  const categories = getCategories(projects);
  const normalizedActive =
    activeCategory && categories.includes(activeCategory) ? activeCategory : allLabel;
  const filteredProjects =
    normalizedActive === allLabel
      ? projects
      : projects.filter((p) => p.category === normalizedActive);

  return (
    <>
      <ProjectsFilterSection
        categories={categories}
        activeCategory={normalizedActive}
      />
      <ProjectsGridSection projects={filteredProjects} />
    </>
  );
}
