import { findPublishedFaqs } from "@/lib/cms/faqs";
import { FAQsSectionClient } from "./FAQsSectionClient";

export async function FAQsSection() {
  const items = await findPublishedFaqs("homepage");
  return <FAQsSectionClient items={items} />;
}
