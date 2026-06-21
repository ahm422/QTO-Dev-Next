import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedIndustries } from "@/lib/cms/industries";
import { IndustriesSectionClient } from "./IndustriesSectionClient";

export async function IndustriesSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedIndustries(),
    findPageSection("homepage.industries"),
  ]);
  return <IndustriesSectionClient items={items} config={sectionConfig as any} />;
}
