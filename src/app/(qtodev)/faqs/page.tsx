import type { Metadata } from "next";
import { findPublishedFaqs } from "@/lib/cms/faqs";
import { findPageSection } from "@/lib/cms/pageContent";
import { FAQsSectionClient } from "@/app/(qtodev)/sections/FAQsSectionClient";
import { faqsConfig } from "@/config/faqs";
import { faqItems } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQs | QTO Dev",
  description: "Answers to the most common questions about working with QTO Dev.",
};

export default async function FAQsPage() {
  const [faqs, sectionConfig] = await Promise.all([
    findPublishedFaqs("faqs"),
    findPageSection("homepage.faqs-header"),
  ]);

  const items = faqs.length > 0 ? faqs : faqItems;

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <FAQsSectionClient items={items} config={sectionConfig as typeof faqsConfig | null ?? undefined} />
    </main>
  );
}
