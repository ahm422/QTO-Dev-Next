import { findPublishedFeaturedWorks } from "@/lib/cms/featuredWorks";
import { FeaturedWorkSectionClient } from "./FeaturedWorkSectionClient";

export async function FeaturedWorkSection() {
  const items = await findPublishedFeaturedWorks();
  return <FeaturedWorkSectionClient items={items} />;
}
