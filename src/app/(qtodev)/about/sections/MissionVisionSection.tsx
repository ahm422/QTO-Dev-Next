import { findAboutPageContent } from "@/lib/cms/about";
import { MissionVisionSectionClient } from "./MissionVisionSectionClient";
import { aboutPageConfig } from "@/config/aboutPage";

type AboutPageConfigType = typeof aboutPageConfig;

export async function MissionVisionSection({ config }: { config?: AboutPageConfigType }) {
  const content = await findAboutPageContent();
  if (!content) return null;
  return <MissionVisionSectionClient content={content} config={config} />;
}
