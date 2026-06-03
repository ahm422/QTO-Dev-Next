import { findPublishedTestimonials } from "@/lib/cms/testimonials";
import { TestimonialsSectionClient } from "./TestimonialsSectionClient";

export async function TestimonialsSection() {
  const items = await findPublishedTestimonials();
  return <TestimonialsSectionClient items={items} />;
}
