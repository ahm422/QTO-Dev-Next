import { findPublishedIndustries } from "@/lib/cms/industries";
import { IndustriesSectionClient } from "./IndustriesSectionClient";

export async function IndustriesSection() {
  const items = await findPublishedIndustries();
  return <IndustriesSectionClient items={items} />;
}
