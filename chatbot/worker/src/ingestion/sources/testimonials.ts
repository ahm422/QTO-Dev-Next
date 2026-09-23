import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";

interface TestimonialRow {
  id: string;
  client_name: string;
  client_role: string;
  client_company: string;
  quote: string;
  rating: number | null;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<TestimonialRow[]> {
  return d1.query<TestimonialRow>(
    `SELECT id, client_name, client_role, client_company, quote, rating, is_published, "order", updated_at FROM testimonials`
  );
}

function normalize(row: TestimonialRow): NormalizedRecord {
  const title = `${row.client_name}, ${row.client_role} at ${row.client_company}`;
  const content = `"${row.quote}" — ${title}${row.rating ? ` (${row.rating}/5)` : ""}`;

  return {
    table: "testimonials",
    recordId: row.id,
    slug: null,
    title,
    content,
    metadata: {
      clientCompany: row.client_company,
      clientRole: row.client_role,
      rating: row.rating,
      order: row.order,
      url: "/",
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const testimonialsSource: SourceDefinition = {
  table: "testimonials",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
