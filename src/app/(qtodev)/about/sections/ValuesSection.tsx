import { findAboutPageContent } from "@/lib/cms/about";
import { ValuesSectionClient } from "./ValuesSectionClient";
import { aboutPageConfig } from "@/config/aboutPage";

type AboutPageConfigType = typeof aboutPageConfig;

export async function ValuesSection({ config }: { config?: AboutPageConfigType }) {
  const content = await findAboutPageContent();
  if (!content) return null;
  return <ValuesSectionClient content={content} config={config} />;
}
