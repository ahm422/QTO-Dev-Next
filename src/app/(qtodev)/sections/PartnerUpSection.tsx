import { findPublishedTestimonials } from "@/lib/cms/testimonials";
import { PartnerUpSectionClient } from "./PartnerUpSectionClient";

export async function PartnerUpSection() {
  const items = await findPublishedTestimonials();
  return <PartnerUpSectionClient items={items} />;
}
