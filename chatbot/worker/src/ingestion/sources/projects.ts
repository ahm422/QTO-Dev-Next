import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { bulletList, joinSections, parseJsonStringArray } from "../textUtils.js";

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  category: string;
  excerpt: string;
  description: string;
  challenge: string | null;
  solution: string | null;
  results: string;
  service_slug: string | null;
  is_featured: number;
  is_published: number;
  order: number;
  updated_at: string;
}

interface TagRow {
  project_id: string;
  value: string;
}

async function fetchRows(): Promise<
  Array<ProjectRow & { tags: string[]; techStack: string[] }>
> {
  const [projects, tags, techStack] = await Promise.all([
    d1.query<ProjectRow>(
      `SELECT id, slug, title, client, category, excerpt, description, challenge, solution, results, service_slug, is_featured, is_published, "order", updated_at FROM projects`
    ),
    d1.query<TagRow>(`SELECT project_id, value FROM project_tags ORDER BY sort_order ASC`),
    d1.query<TagRow>(
      `SELECT project_id, value FROM project_tech_stack_items ORDER BY sort_order ASC`
    ),
  ]);

  const groupBy = (rows: TagRow[]) => {
    const m = new Map<string, string[]>();
    for (const r of rows) {
      const list = m.get(r.project_id) ?? [];
      list.push(r.value);
      m.set(r.project_id, list);
    }
    return m;
  };
  const tagsByProject = groupBy(tags);
  const techByProject = groupBy(techStack);

  return projects.map((p) => ({
    ...p,
    tags: tagsByProject.get(p.id) ?? [],
    techStack: techByProject.get(p.id) ?? [],
  }));
}

function normalize(
  row: ProjectRow & { tags: string[]; techStack: string[] }
): NormalizedRecord {
  const results = parseJsonStringArray(row.results);
  const heading = row.client ? `${row.title} — ${row.client} (${row.category})` : `${row.title} (${row.category})`;

  const content = joinSections(
    heading,
    row.excerpt,
    row.description,
    row.challenge ? `Challenge: ${row.challenge}` : null,
    row.solution ? `Solution: ${row.solution}` : null,
    results.length ? `Results:\n${bulletList(results)}` : null,
    row.techStack.length ? `Tech stack: ${row.techStack.join(", ")}` : null,
    row.tags.length ? `Tags: ${row.tags.join(", ")}` : null
  );

  return {
    table: "projects",
    recordId: row.id,
    slug: row.slug,
    title: row.title,
    content,
    metadata: {
      client: row.client,
      category: row.category,
      serviceSlug: row.service_slug,
      isFeatured: row.is_featured === 1,
      tags: row.tags,
      techStack: row.techStack,
      order: row.order,
      url: `/projects/${row.slug}`,
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const projectsSource: SourceDefinition = {
  table: "projects",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
