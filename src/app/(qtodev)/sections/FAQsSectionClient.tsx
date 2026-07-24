"use client";

import { useState } from "react";
import { Container } from "@/components/common/Container";
import { SectionHeader } from "@/components/common/SectionHeader";
import { FaqAccordionItem } from "@/components/faq";
import { Reveal } from "@/components/animations/Reveal";
import { faqsConfig } from "@/config/faqs";
type FaqsConfigType = typeof faqsConfig;
import type { Faq } from "@/types/faq";
import { faqItems } from "@/data/faqs";
import { cn } from "@/components/theme/cn";
import { homepageSectionPadding } from "@/components/theme/sectionClasses";

const HEADING_ID = "faqs-heading";

export function FAQsSectionClient({ items , config}: { items: Faq[] ; config?: FaqsConfigType}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cfg = config ?? faqsConfig;
  const resolvedItems = items.length > 0 ? items : faqItems;

  if (resolvedItems.length === 0) return null;

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faqs"
      className={cn(
        "relative overflow-hidden",
        homepageSectionPadding,
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
              subtitle={cfg.subtitle}
              subtitleClassName="text-primary font-semibold"
              subtitlePill
              title={cfg.title}
              description={cfg.description}
              headingId={HEADING_ID}
            />
          </div>

          <div className="mt-8 md:mt-10 mx-auto max-w-3xl space-y-4">
            {resolvedItems.map((item, index) => (
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
