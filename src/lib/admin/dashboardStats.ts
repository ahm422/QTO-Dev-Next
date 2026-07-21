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

export type DashboardActivityPoint = {
  month: string
  services: number
  blog: number
  projects: number
}

export type DashboardStatsResponse = {
  version: 1
  generatedAt: string
  totals: {
    content: number
    published: number
    healthPct: number
  }
  sections: DashboardSectionStat[]
  activityChart: {
    mock: boolean
    points: DashboardActivityPoint[]
  }
}

/**
 * Static representative activity data. There is no real time-series in the
 * current schema, so this is flagged `mock: true` in the response contract.
 */
function buildActivityChartPoints(): DashboardActivityPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const monthIdx = (now.getMonth() - 11 + i + 12) % 12
    return {
      month: months[monthIdx],
      services: Math.floor(Math.random() * 4) + 1,
      blog: Math.floor(Math.random() * 6) + 1,
      projects: Math.floor(Math.random() * 3) + 1,
    }
  })
}

/**
 * Computes all dashboard numbers by iterating the content-sections registry.
 * No hardcoded per-model prisma.<x>.count() calls live in the dashboard page.
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const countableSections = contentSections.filter((s) => s.countable && s.model)

  const results = await Promise.all(
    countableSections.map(async (section) => {
      const delegate = modelDelegates[section.model!]
      const [count, published] = await Promise.all([
        delegate.count(),
        section.publishable ? delegate.count({ where: { isPublished: true } }) : Promise.resolve(null),
      ])
      return { key: section.key, count, published }
    })
  )

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
  const healthPct = content > 0 ? Math.round((published / content) * 100) : 0

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    totals: { content, published, healthPct },
    sections,
    activityChart: {
      mock: true,
      points: buildActivityChartPoints(),
    },
  }
}
