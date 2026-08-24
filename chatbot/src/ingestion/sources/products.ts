import { d1 } from "../../d1/client.js";
import type { NormalizedRecord, SourceDefinition } from "../../types/document.js";
import { joinSections } from "../textUtils.js";

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string | null;
  description: string;
  status_label: string | null;
  is_published: number;
  order: number;
  updated_at: string;
}

interface FeatureRow {
  product_id: string;
  name: string;
  description: string;
}

async function fetchRows(): Promise<Array<ProductRow & { features: FeatureRow[] }>> {
  const [products, features] = await Promise.all([
    d1.query<ProductRow>(
      `SELECT id, slug, title, subtitle, short_description, description, status_label, is_published, "order", updated_at FROM products`
    ),
    d1.query<FeatureRow>(
      `SELECT product_id, name, description FROM product_features ORDER BY sort_order ASC`
    ),
  ]);

  const featuresByProduct = new Map<string, FeatureRow[]>();
  for (const f of features) {
    const list = featuresByProduct.get(f.product_id) ?? [];
    list.push(f);
    featuresByProduct.set(f.product_id, list);
  }

  return products.map((p) => ({ ...p, features: featuresByProduct.get(p.id) ?? [] }));
}

function normalize(row: ProductRow & { features: FeatureRow[] }): NormalizedRecord {
  const heading = row.subtitle ? `${row.title} — ${row.subtitle}` : row.title;
  const featureText = row.features.length
    ? `Features:\n${row.features.map((f) => `- ${f.name}: ${f.description}`).join("\n")}`
    : null;

  const content = joinSections(
    heading,
    row.status_label ? `Status: ${row.status_label}` : null,
    row.short_description,
    row.description,
    featureText
  );

  return {
    table: "products",
    recordId: row.id,
    slug: row.slug,
    title: row.title,
    content,
    metadata: {
      subtitle: row.subtitle,
      statusLabel: row.status_label,
      order: row.order,
      features: row.features.map((f) => f.name),
      url: `/products#${row.slug}`,
    },
    isPublished: row.is_published === 1,
    updatedAt: row.updated_at,
  };
}

export const productsSource: SourceDefinition = {
  table: "products",
  fetchAndNormalize: async () => (await fetchRows()).map(normalize),
};
