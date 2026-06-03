import { findPublishedEngagementModels } from "@/lib/cms/engagementModels";
import { EngagementModelsSectionClient } from "./EngagementModelsSectionClient";

export async function EngagementModelsSection() {
  const items = await findPublishedEngagementModels();
  return <EngagementModelsSectionClient items={items} />;
}
