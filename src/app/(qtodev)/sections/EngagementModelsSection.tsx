import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedEngagementModels } from "@/lib/cms/engagementModels";
import { EngagementModelsSectionClient } from "./EngagementModelsSectionClient";

export async function EngagementModelsSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedEngagementModels(),
    findPageSection("homepage.engagement-models"),
  ]);
  const displayItems = items.slice(0, 3);
  return <EngagementModelsSectionClient items={displayItems} config={sectionConfig as any} />;
}
