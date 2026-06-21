import { findPageSection } from "@/lib/cms/pageContent";
import { findPublishedFaqs } from "@/lib/cms/faqs";
import { FAQsSectionClient } from "./FAQsSectionClient";

export async function FAQsSection() {
  const [items, sectionConfig] = await Promise.all([
    findPublishedFaqs("homepage"),
    findPageSection("homepage.faqs-header"),
  ]);
  return <FAQsSectionClient items={items} config={sectionConfig as any} />;
}
