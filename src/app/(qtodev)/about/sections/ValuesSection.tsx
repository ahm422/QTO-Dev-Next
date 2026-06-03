import { findAboutPageContent } from "@/lib/cms/about";
import { ValuesSectionClient } from "./ValuesSectionClient";

export async function ValuesSection() {
  const content = await findAboutPageContent();
  if (!content) return null;
  return <ValuesSectionClient content={content} />;
}
