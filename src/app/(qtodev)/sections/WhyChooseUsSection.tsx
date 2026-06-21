import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedWhyChooseUs } from "@/lib/cms/whyChooseUs";
import { WhyChooseUsSectionClient } from "./WhyChooseUsSectionClient";

export async function WhyChooseUsSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedWhyChooseUs("homepage"),
    findPageSection("homepage.why-choose-us"),
  ]);
  return <WhyChooseUsSectionClient items={items} config={sectionConfig as any} />;
}
