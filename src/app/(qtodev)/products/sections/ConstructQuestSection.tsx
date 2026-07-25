import { findProductBySlug } from "@/lib/cms/products";
import { ConstructQuestSectionClient } from "./ConstructQuestSectionClient";

export async function ConstructQuestSection() {
  const product = await findProductBySlug("construct-quest");
  return <ConstructQuestSectionClient product={product} />;
}
