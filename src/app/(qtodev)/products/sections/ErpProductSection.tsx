import { findProductBySlug } from "@/lib/cms/products";
import { ErpProductSectionClient } from "./ErpProductSectionClient";

export async function ErpProductSection() {
  const product = await findProductBySlug("erp-solutions");
  return <ErpProductSectionClient product={product} />;
}
