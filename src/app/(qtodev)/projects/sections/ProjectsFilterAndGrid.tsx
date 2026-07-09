import { Suspense } from "react";
import { findPublishedProjects } from "@/lib/cms/projects";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { ProjectsFilterAndGridClient } from "./ProjectsFilterAndGridClient";

interface ProjectsFilterAndGridProps {
  config?: ProjectsPageConfigType;
  initialCategory?: string;
}

export async function ProjectsFilterAndGrid({
  config,
  initialCategory,
}: ProjectsFilterAndGridProps) {
  const projects = await findPublishedProjects();
  return (
    <Suspense fallback={null}>
      <ProjectsFilterAndGridClient
        projects={projects}
        config={config}
        initialCategory={initialCategory}
      />
    </Suspense>
  );
}
