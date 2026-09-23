import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  context: string;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<FaqRow[]> {
  return d1.query<FaqRow>(
    `SELECT id, question, answer, context, is_published, "order", updated_at FROM faqs`
  );
}

function normalize(row: FaqRow): NormalizedRecord {
  return {
    table: "faqs",
    recordId: row.id,
    slug: null,
    title: row.question,
    content: `Q: ${row.question}\nA: ${row.answer}`,
    metadata: { context: row.context, order: row.order, url: "/faqs" },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const faqsSource: SourceDefinition = {
  table: "faqs",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
