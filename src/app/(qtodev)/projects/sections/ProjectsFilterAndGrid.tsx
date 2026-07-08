import { findPublishedProjects } from "@/lib/cms/projects";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { ProjectsGridSection } from "./ProjectsGridSection";

export async function ProjectsFilterAndGrid({
  config,
}: {
  config?: ProjectsPageConfigType;
}) {
  const projects = await findPublishedProjects();
  return <ProjectsGridSection projects={projects} config={config} />;
}
