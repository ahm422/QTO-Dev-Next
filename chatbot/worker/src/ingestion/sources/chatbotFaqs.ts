import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";

interface ChatbotFaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<ChatbotFaqRow[]> {
  return d1.query<ChatbotFaqRow>(
    `SELECT id, question, answer, category, is_published, "order", updated_at FROM chatbot_faqs`
  );
}

function normalize(row: ChatbotFaqRow): NormalizedRecord {
  return {
    table: "chatbot_faqs",
    recordId: row.id,
    slug: null,
    title: row.question,
    content: `Q: ${row.question}\nA: ${row.answer}`,
    metadata: { category: row.category, order: row.order },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const chatbotFaqsSource: SourceDefinition = {
  table: "chatbot_faqs",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
