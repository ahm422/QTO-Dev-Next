import { findErpSolutionsContent } from "@/lib/cms/about";
import { ErpProductSectionClient } from "./ErpProductSectionClient";

export async function ErpProductSection() {
  const content = await findErpSolutionsContent();
  return <ErpProductSectionClient content={content} />;
}
