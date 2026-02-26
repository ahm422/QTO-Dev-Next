"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FaqAccordionItem } from "@/components/faq";
import { Reveal } from "@/components/animations/Reveal";
import { faqsConfig } from "@/config/faqs";
import { faqItems } from "@/data/faqs";
import { cn } from "@/components/theme/cn";

const HEADING_ID = "faqs-heading";

export function FAQsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faqs"
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        "bg-gradient-to-b from-surface via-surface-muted/40 to-surface",
        "border-y border-border/80"
      )}
      aria-labelledby={HEADING_ID}
    >
      {/* Soft gradient orbs for depth */}
      <div
        className="pointer-events-none absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-primary/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />

      <Container className="relative">
        <Reveal staggerSelector="[data-reveal]">
          <div className="max-w-3xl mx-auto text-center" data-reveal>
            <SectionHeader
              subtitle={faqsConfig.subtitle}
              subtitleClassName="text-primary font-semibold"
              subtitlePill
              title={faqsConfig.title}
              description={faqsConfig.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="mt-14 mx-auto max-w-3xl space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} data-reveal>
                <FaqAccordionItem
                  index={index}
                  question={item.question}
                  answer={item.answer}
                  open={openIndex === index}
                  onToggle={() => handleToggle(index)}
                  id={`faq-heading-${index}`}
                  controlsId={`faq-answer-${index}`}
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
