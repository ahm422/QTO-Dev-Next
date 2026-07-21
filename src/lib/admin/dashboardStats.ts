import { contentSections } from "@/config/content-sections"
import { modelDelegates } from "@/lib/admin/sectionModels"

export type DashboardSectionStat = {
  key: string
  label: string
  href: string
  model: string | null
  count: number | null
  published: number | null
  color: string | null
}

/**
 * Per-signal breakdown of the Content Health composite so the card/tooltip can
 * explain the number instead of surfacing an opaque percentage.
 * All scores are integers on a 0-100 scale.
 */
export type DashboardHealth = {
  /** Weighted composite, clamped 0-100. */
  score: number
  /** published / content. */
  publishCompleteness: number
  /** 1 - (empty countable sections / total countable sections). */
  sectionCompleteness: number
  /** 1 - (records missing key fields / records audited). */
  fieldCompleteness: number
  weights: { publish: number; sections: number; fields: number }
  emptySections: number
  totalSections: number
  incompleteRecords: number
  auditedRecords: number
}

export type DashboardStatsResponse = {
  version: 1
  generatedAt: string
  totals: {
    content: number
    published: number
    /** Alias of `health.score`, kept for backward compatibility. */
    healthPct: number
  }
  health: DashboardHealth
  sections: DashboardSectionStat[]
}

/**
 * Content Health formula (documented, weighted composite):
 *
 *   score = 100 * (
 *       W.publish  * publishCompleteness
 *     + W.sections * sectionCompleteness
 *     + W.fields   * fieldCompleteness
 *   )   clamped to [0, 100]
 *
 * where each completeness term is a 0-1 ratio (defaulting to 1 when its
 * denominator is 0, i.e. "nothing to complete = not a penalty"). Weights sum
 * to 1 and are named constants so the derivation is auditable.
 */
const HEALTH_WEIGHTS = { publish: 0.4, sections: 0.3, fields: 0.3 } as const

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const toPct = (ratio: number) => clamp(Math.round(ratio * 100), 0, 100)

/**
 * Computes all dashboard numbers by iterating the content-sections registry.
 * No hardcoded per-model prisma.<x>.count() calls live in the dashboard page.
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const countableSections = contentSections.filter((s) => s.countable && s.model)

  const [results, incompleteBlog, incompleteProjects] = await Promise.all([
    Promise.all(
      countableSections.map(async (section) => {
        const delegate = modelDelegates[section.model!]
        const [count, published] = await Promise.all([
          delegate.count(),
          section.publishable ? delegate.count({ where: { isPublished: true } }) : Promise.resolve(null),
        ])
        return { key: section.key, count, published }
      })
    ),
    // Field-completeness signal: count blog posts missing key fields (no full-row loads).
    modelDelegates.BlogPost.count({
      where: {
        OR: [
          { imageUrl: null },
          { imageAlt: null },
          { readTime: null },
          { isPublished: true, publishedAt: null },
        ],
      },
    }),
    // Field-completeness signal: count projects missing key fields.
    modelDelegates.Project.count({
      where: {
        OR: [
          { coverImageUrl: null },
          { challenge: null },
          { solution: null },
          { results: "[]" },
          { images: "[]" },
        ],
      },
    }),
  ])

  const resultByKey = new Map(results.map((r) => [r.key, r]))

  const sections: DashboardSectionStat[] = contentSections
    .filter((s) => s.model)
    .map((section) => {
      const result = resultByKey.get(section.key)
      return {
        key: section.key,
        label: section.label,
        href: section.href,
        model: section.model ?? null,
        count: result ? result.count : null,
        published: result ? result.published : null,
        color: section.color ?? null,
      }
    })

  const content = results.reduce((sum, r) => sum + r.count, 0)
  const published = results.reduce((sum, r) => sum + (r.published ?? 0), 0)

  // Signal 1 — publish completeness.
  const publishCompleteness = content > 0 ? published / content : 1

  // Signal 2 — empty-section penalty across countable sections.
  const totalSections = results.length
  const emptySections = results.filter((r) => r.count === 0).length
  const sectionCompleteness = totalSections > 0 ? 1 - emptySections / totalSections : 1

  // Signal 3 — per-record field completeness for the richest content types.
  const auditedRecords = (resultByKey.get("blog")?.count ?? 0) + (resultByKey.get("projects")?.count ?? 0)
  const incompleteRecords = incompleteBlog + incompleteProjects
  const fieldCompleteness = auditedRecords > 0 ? 1 - incompleteRecords / auditedRecords : 1

  const score = clamp(
    Math.round(
      100 *
        (HEALTH_WEIGHTS.publish * publishCompleteness +
          HEALTH_WEIGHTS.sections * sectionCompleteness +
          HEALTH_WEIGHTS.fields * fieldCompleteness)
    ),
    0,
    100
  )

  const health: DashboardHealth = {
    score,
    publishCompleteness: toPct(publishCompleteness),
    sectionCompleteness: toPct(sectionCompleteness),
    fieldCompleteness: toPct(fieldCompleteness),
    weights: HEALTH_WEIGHTS,
    emptySections,
    totalSections,
    incompleteRecords,
    auditedRecords,
  }

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    totals: { content, published, healthPct: score },
    health,
    sections,
  }
}
