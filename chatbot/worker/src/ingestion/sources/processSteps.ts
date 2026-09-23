import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { joinSections } from "../textUtils.js";

interface ProcessStepRow {
  id: string;
  context: string;
  step_number: number;
  title: string;
  description: string;
  is_published: number;
  order: number;
  updated_at: string;
}

async function fetchRows(): Promise<ProcessStepRow[]> {
  return d1.query<ProcessStepRow>(
    `SELECT id, context, step_number, title, description, is_published, "order", updated_at FROM process_steps`
  );
}

function normalize(row: ProcessStepRow): NormalizedRecord {
  const content = joinSections(`Step ${row.step_number}: ${row.title}`, row.description);

  return {
    table: "process_steps",
    recordId: row.id,
    slug: null,
    title: row.title,
    content,
    metadata: { context: row.context, stepNumber: row.step_number, order: row.order, url: "/" },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const processStepsSource: SourceDefinition = {
  table: "process_steps",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
