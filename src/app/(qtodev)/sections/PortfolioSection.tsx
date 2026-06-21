import { findPageSection } from "@/lib/cms/pageContent";
import { findPortfolioProjects } from "@/lib/cms/projects";
import { PortfolioSectionClient } from "./PortfolioSectionClient";

export async function PortfolioSection() {
  const [cases, sectionConfig] = await Promise.all([
    findPortfolioProjects(6),
    findPageSection("homepage.portfolio"),
  ]);
  return <PortfolioSectionClient cases={cases} config={sectionConfig as any} />;
}
