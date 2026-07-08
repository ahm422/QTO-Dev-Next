import { findErpSolutionsContent } from "@/lib/cms/about";
import { ErpSolutionsSectionClient } from "./ErpSolutionsSectionClient";

export async function ErpSolutionsSection() {
  const content = await findErpSolutionsContent();
  return <ErpSolutionsSectionClient content={content} />;
}
