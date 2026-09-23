import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { bulletList, joinSections, parseJsonStringArray } from "../textUtils.js";

interface JobRow {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  nice_to_have: string;
  salary_range: string | null;
  is_published: number;
  order: number;
  expires_at: string | null;
  updated_at: string;
}

async function fetchRows(): Promise<JobRow[]> {
  return d1.query<JobRow>(
    `SELECT id, title, department, location, type, description, requirements, nice_to_have, salary_range, is_published, "order", expires_at, updated_at FROM jobs`
  );
}

function normalize(row: JobRow): NormalizedRecord {
  const requirements = parseJsonStringArray(row.requirements);
  const niceToHave = parseJsonStringArray(row.nice_to_have);

  const content = joinSections(
    `${row.title} — ${row.department}, ${row.location} (${row.type})`,
    row.description,
    requirements.length ? `Requirements:\n${bulletList(requirements)}` : null,
    niceToHave.length ? `Nice to have:\n${bulletList(niceToHave)}` : null,
    row.salary_range ? `Salary: ${row.salary_range}` : null
  );

  // A job is only truly "open" if it's published AND not past its expiry date —
  // the site itself may apply the same filter when rendering /careers, so the
  // chatbot's definition of "currently open" mirrors that rather than just is_published.
  const notExpired = !row.expires_at || new Date(row.expires_at).getTime() > Date.now();

  return {
    table: "jobs",
    recordId: row.id,
    slug: null,
    title: row.title,
    content,
    metadata: {
      department: row.department,
      location: row.location,
      type: row.type,
      expiresAt: row.expires_at,
      order: row.order,
      url: "/careers",
    },
    isPublished: row.is_published === 1 && notExpired,
    updatedAt: row.updated_at,
  };
}

export const jobsSource: SourceDefinition = {
  table: "jobs",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
