import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedEngagementModels } from "@/lib/cms/engagementModels";
import { EngagementModelsSectionClient } from "./EngagementModelsSectionClient";

export async function EngagementModelsSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedEngagementModels(),
    findPageSection("homepage.engagement-models"),
  ]);
  return <EngagementModelsSectionClient items={items} config={sectionConfig as any} />;
}
