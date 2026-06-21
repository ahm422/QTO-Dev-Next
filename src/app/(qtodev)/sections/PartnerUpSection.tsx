import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedTestimonials } from "@/lib/cms/testimonials";
import { PartnerUpSectionClient } from "./PartnerUpSectionClient";

export async function PartnerUpSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedTestimonials(),
    findPageSection("homepage.partner-up"),
  ]);
  return <PartnerUpSectionClient items={items} config={sectionConfig as any} />;
}
