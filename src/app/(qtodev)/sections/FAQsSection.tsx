"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FaqAccordionItem } from "@/components/faq";
import { faqsConfig } from "@/config/faqs";
import { faqItems } from "@/data/faqs";

const HEADING_ID = "faqs-heading";

export function FAQsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className="py-16 md:py-20 bg-surface"
      aria-labelledby={HEADING_ID}
    >
      <Container>
        <SectionHeader
          subtitle={faqsConfig.subtitle}
          subtitleClassName="text-primary"
          subtitlePill
          title={faqsConfig.title}
          description={faqsConfig.description}
          headingId={HEADING_ID}
        />

        <div className="mt-12 mx-auto max-w-3xl space-y-4">
          {faqItems.map((item, index) => (
            <FaqAccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              open={openIndex === index}
              onToggle={() => handleToggle(index)}
              id={`faq-heading-${index}`}
              controlsId={`faq-answer-${index}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
