import { findPortfolioProjects } from "@/lib/cms/projects";
import { PortfolioSectionClient } from "./PortfolioSectionClient";

export async function PortfolioSection() {
  const cases = await findPortfolioProjects(6);
  return <PortfolioSectionClient cases={cases} />;
}
