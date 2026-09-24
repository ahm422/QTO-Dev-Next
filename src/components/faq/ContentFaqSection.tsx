"use client"

import { useState } from "react"
import type { ContentFaq } from "@/types/faq"
import { FaqAccordionItem } from "./FaqAccordionItem"

export function ContentFaqSection({
  items,
  idPrefix,
  heading = "Frequently Asked Questions",
}: {
  items?: ContentFaq[] | null
  idPrefix: string
  heading?: string
}) {
  const list = items ?? []
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (list.length === 0) return null

  const headingId = `${idPrefix}-heading`
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }).replace(/</g, "\\u003c")

  return (
    <section aria-labelledby={headingId} className="mt-12">
      <h2 id={headingId} className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-6 space-y-4">
        {list.map((item, index) => (
          <FaqAccordionItem
            key={`${idPrefix}-${index}`}
            index={index}
            question={item.question}
            answer={item.answer}
            open={openIndex === index}
            onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
            id={`${idPrefix}-heading-${index}`}
            controlsId={`${idPrefix}-answer-${index}`}
            answerClassName="whitespace-pre-line"
          />
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </section>
  )
}
