import { findAboutPageContent } from "@/lib/cms/about";
import { MissionVisionSectionClient } from "./MissionVisionSectionClient";

export async function MissionVisionSection() {
  const content = await findAboutPageContent();
  if (!content) return null;
  return <MissionVisionSectionClient content={content} />;
}
