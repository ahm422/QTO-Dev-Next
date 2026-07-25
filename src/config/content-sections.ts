import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Briefcase,
  GitBranch,
  Star,
  CheckSquare,
  BarChart2,
  MessageSquare,
  Building2,
  Layers,
  HelpCircle,
  BookOpen,
  Cpu,
  FolderKanban,
  Heart,
  Info,
  Users,
  Handshake,
  Phone,
  Settings2,
  Shield,
  ScrollText,
  LayoutTemplate,
  Inbox,
  FileText,
  ClipboardList,
  Package,
} from "lucide-react"

export type SectionGroup = "main" | "content" | "settings"

export type PrismaModelName =
  | "Service"
  | "Product"
  | "ProcessStep"
  | "FeaturedWork"
  | "WhyChooseUs"
  | "Stat"
  | "Testimonial"
  | "Industry"
  | "EngagementModel"
  | "Faq"
  | "BlogPost"
  | "Technology"
  | "Project"
  | "WorkValue"
  | "AboutContent"
  | "TeamMember"
  | "Job"
  | "ContactInfo"
  | "PageSection"
  | "SiteConfig"

export type ContentSection = {
  /** Stable id, e.g. "services" — matches API response keys. */
  key: string
  label: string
  href: string
  icon: LucideIcon
  group: SectionGroup
  /** Omit for pages with no backing model (e.g. submission inboxes, dashboard). */
  model?: PrismaModelName
  /** Include in totals + sections grid count. */
  countable?: boolean
  /** Model has isPublished → contributes to content health. */
  publishable?: boolean
  /** Model has createdAt/updatedAt → eligible for activity feed. */
  hasTimestamps?: boolean
  /** Donut/legend color for charts. */
  color?: string
  requiredRole?: string[]
}

/**
 * Single source of truth for admin content sections. Both the sidebar
 * (via admin-nav) and the dashboard aggregation read from this registry.
 *
 * Schema facts encoded below (see prisma/schema.prisma):
 *  - Not publishable (no isPublished): SiteConfig.
 *  - No createdAt (only updatedAt) → not activity-feed eligible:
 *    AboutContent, ContactInfo, PageSection, SiteConfig.
 *  - Not countable (settings/singletons): AboutContent, PageSection, SiteConfig,
 *    plus nav-only submission inboxes with no CRUD-managed model.
 */
export const contentSections: ContentSection[] = [
  // MAIN
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard, group: "main", countable: false },

  // CONTENT
  { key: "services",          label: "Services",          href: "/admin/services",          icon: Briefcase,      group: "content", model: "Service",         countable: true,  publishable: true,  hasTimestamps: true,  color: "#F97316" },
  { key: "products",          label: "Products",          href: "/admin/products",          icon: Package,        group: "content", model: "Product",         countable: true,  publishable: true,  hasTimestamps: true,  color: "#0EA5E9" },
  { key: "process-steps",     label: "Process Steps",     href: "/admin/process-steps",     icon: GitBranch,      group: "content", model: "ProcessStep",     countable: true,  publishable: true,  hasTimestamps: true,  color: "#06B6D4" },
  { key: "featured-work",     label: "Featured Work",     href: "/admin/featured-work",     icon: Star,           group: "content", model: "FeaturedWork",    countable: true,  publishable: true,  hasTimestamps: true },
  { key: "why-choose-us",     label: "Why Choose Us",     href: "/admin/why-choose-us",     icon: CheckSquare,    group: "content", model: "WhyChooseUs",     countable: true,  publishable: true,  hasTimestamps: true },
  { key: "stats",             label: "Stats",             href: "/admin/stats",             icon: BarChart2,      group: "content", model: "Stat",            countable: true,  publishable: true,  hasTimestamps: true },
  { key: "testimonials",      label: "Testimonials",      href: "/admin/testimonials",      icon: MessageSquare,  group: "content", model: "Testimonial",     countable: true,  publishable: true,  hasTimestamps: true },
  { key: "industries",        label: "Industries",        href: "/admin/industries",        icon: Building2,      group: "content", model: "Industry",        countable: true,  publishable: true,  hasTimestamps: true },
  { key: "engagement-models", label: "Engagement Models", href: "/admin/engagement-models", icon: Layers,         group: "content", model: "EngagementModel", countable: true,  publishable: true,  hasTimestamps: true },
  { key: "faqs",              label: "FAQs",              href: "/admin/faqs",              icon: HelpCircle,     group: "content", model: "Faq",             countable: true,  publishable: true,  hasTimestamps: true },
  { key: "blog",              label: "Blog",              href: "/admin/blog",              icon: BookOpen,       group: "content", model: "BlogPost",        countable: true,  publishable: true,  hasTimestamps: true,  color: "#3B82F6" },
  { key: "technologies",      label: "Technologies",      href: "/admin/technologies",      icon: Cpu,            group: "content", model: "Technology",      countable: true,  publishable: true,  hasTimestamps: true },
  { key: "projects",          label: "Projects",          href: "/admin/projects",          icon: FolderKanban,   group: "content", model: "Project",         countable: true,  publishable: true,  hasTimestamps: true,  color: "#A855F7" },
  { key: "work-values",       label: "Work Values",       href: "/admin/work-values",       icon: Heart,          group: "content", model: "WorkValue",       countable: true,  publishable: true,  hasTimestamps: true },
  { key: "about",             label: "About",             href: "/admin/about",             icon: Info,           group: "content", model: "AboutContent",    countable: false, publishable: true,  hasTimestamps: false },
  { key: "team",              label: "Team",              href: "/admin/team",              icon: Users,          group: "content", model: "TeamMember",      countable: true,  publishable: true,  hasTimestamps: true,  color: "#22C55E" },
  { key: "jobs",              label: "Jobs",              href: "/admin/jobs",              icon: Handshake,      group: "content", model: "Job",             countable: true,  publishable: true,  hasTimestamps: true },
  { key: "contact-info",      label: "Contact Info",      href: "/admin/contact-info",      icon: Phone,          group: "content", model: "ContactInfo",     countable: true,  publishable: true,  hasTimestamps: false },
  { key: "pages",             label: "Pages",             href: "/admin/pages",             icon: LayoutTemplate, group: "content", model: "PageSection",     countable: false, publishable: true,  hasTimestamps: false },

  // SUBMISSIONS (nav-only, no CRUD-managed model)
  { key: "contact-submissions", label: "Contact Inbox",    href: "/admin/contact-submissions", icon: Inbox,         group: "content", countable: false },
  { key: "job-applications",    label: "Job Applications", href: "/admin/job-applications",    icon: FileText,      group: "content", countable: false },
  { key: "requirements",        label: "Requirements",     href: "/admin/requirements",        icon: ClipboardList, group: "content", countable: false },

  // SETTINGS
  { key: "site-config", label: "Site Config", href: "/admin/site-config", icon: Settings2,   group: "settings", model: "SiteConfig", countable: false, publishable: false, hasTimestamps: false },
  { key: "users",       label: "Admin Users", href: "/admin/users",       icon: Shield,      group: "settings", countable: false, requiredRole: ["super_admin"] },
  { key: "audit-log",   label: "Audit Log",   href: "/admin/audit-log",   icon: ScrollText,  group: "settings", countable: false, requiredRole: ["super_admin"] },
]

export const GROUP_LABELS: Record<SectionGroup, string> = {
  main: "Main",
  content: "Content",
  settings: "Settings",
}
