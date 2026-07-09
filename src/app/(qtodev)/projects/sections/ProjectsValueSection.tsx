import { findPublishedWorkValues } from "@/lib/cms/workValues";
import { projectsPageConfig } from "@/config/projectsPage";
type ProjectsPageConfigType = typeof projectsPageConfig;
import { ProjectsValueSectionClient } from "./ProjectsValueSectionClient";

export async function ProjectsValueSection({ config }: { config?: ProjectsPageConfigType }) {
  const items = await findPublishedWorkValues();
  return <ProjectsValueSectionClient items={items} config={config} />;
}
