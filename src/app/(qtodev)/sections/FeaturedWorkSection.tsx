import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedFeaturedWorks } from "@/lib/cms/featuredWorks";
import { FeaturedWorkSectionClient } from "./FeaturedWorkSectionClient";

export async function FeaturedWorkSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedFeaturedWorks(),
    findPageSection("homepage.featured-work"),
  ]);
  return <FeaturedWorkSectionClient items={items} config={sectionConfig as any} />;
}
