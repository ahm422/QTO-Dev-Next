import { findPageSection } from "@/lib/cms/pageContent";
import { findPortfolioProjects } from "@/lib/cms/projects";
import { PortfolioSectionClient } from "./PortfolioSectionClient";

export async function PortfolioSection() {
  const [cases, sectionConfig] = await Promise.all([
    findPortfolioProjects(6),
    findPageSection("homepage.portfolio"),
  ]);
  const displayCases = cases.slice(0, cases.length >= 6 ? 6 : 3);
  return <PortfolioSectionClient cases={displayCases} config={sectionConfig as any} />;
}
