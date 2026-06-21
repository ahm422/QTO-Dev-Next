import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedTestimonials } from "@/lib/cms/testimonials";
import { TestimonialsSectionClient } from "./TestimonialsSectionClient";

export async function TestimonialsSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedTestimonials(),
    findPageSection("homepage.testimonials"),
  ]);
  return <TestimonialsSectionClient items={items} config={sectionConfig as any} />;
}
