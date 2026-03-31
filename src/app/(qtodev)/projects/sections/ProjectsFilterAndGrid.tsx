import { projects } from "@/data/projects";
import { projectsPageConfig } from "@/config/projectsPage";
import { ProjectsFilterSection } from "./ProjectsFilterSection";
import { ProjectsGridSection } from "./ProjectsGridSection";
import type { Project } from "@/types/project";

const allLabel = projectsPageConfig.filter.allLabel;

function getCategories(projectsList: Project[]): string[] {
  const uniques = [...new Set(projectsList.map((p) => p.category))].sort();
  return [allLabel, ...uniques];
}

export function ProjectsFilterAndGrid({ activeCategory }: { activeCategory?: string }) {
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
