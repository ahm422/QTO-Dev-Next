import type { LucideIcon } from "lucide-react"
import { contentSections, type SectionGroup } from "@/config/content-sections"

export { GROUP_LABELS } from "@/config/content-sections"

export type AdminNavGroup = SectionGroup

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  model?: string
  group: AdminNavGroup
  requiredRole?: string[]
}

/** Sidebar nav, derived from the single content-sections registry. */
export const adminNavItems: AdminNavItem[] = contentSections.map(
  ({ label, href, icon, model, group, requiredRole }) => ({
    label,
    href,
    icon,
    model,
    group,
    requiredRole,
  })
)
