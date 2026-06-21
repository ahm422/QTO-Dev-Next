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
} from "lucide-react"

export type AdminNavGroup = "main" | "content" | "settings"

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  model?: string
  group: AdminNavGroup
  requiredRole?: string[]
}

export const adminNavItems: AdminNavItem[] = [
  // MAIN
  { label: "Dashboard",         href: "/admin",                   icon: LayoutDashboard, group: "main" },
  // CONTENT
  { label: "Services",          href: "/admin/services",          icon: Briefcase,      model: "Service",         group: "content" },
  { label: "Process Steps",     href: "/admin/process-steps",     icon: GitBranch,      model: "ProcessStep",     group: "content" },
  { label: "Featured Work",     href: "/admin/featured-work",     icon: Star,           model: "FeaturedWork",    group: "content" },
  { label: "Why Choose Us",     href: "/admin/why-choose-us",     icon: CheckSquare,    model: "WhyChooseUs",     group: "content" },
  { label: "Stats",             href: "/admin/stats",             icon: BarChart2,      model: "Stat",            group: "content" },
  { label: "Testimonials",      href: "/admin/testimonials",      icon: MessageSquare,  model: "Testimonial",     group: "content" },
  { label: "Industries",        href: "/admin/industries",        icon: Building2,      model: "Industry",        group: "content" },
  { label: "Engagement Models", href: "/admin/engagement-models", icon: Layers,         model: "EngagementModel", group: "content" },
  { label: "FAQs",              href: "/admin/faqs",              icon: HelpCircle,     model: "Faq",             group: "content" },
  { label: "Blog",              href: "/admin/blog",              icon: BookOpen,       model: "BlogPost",        group: "content" },
  { label: "Technologies",      href: "/admin/technologies",      icon: Cpu,            model: "Technology",      group: "content" },
  { label: "Projects",          href: "/admin/projects",          icon: FolderKanban,   model: "Project",         group: "content" },
  { label: "Work Values",       href: "/admin/work-values",       icon: Heart,          model: "WorkValue",       group: "content" },
  { label: "About",             href: "/admin/about",             icon: Info,           model: "AboutContent",    group: "content" },
  { label: "Team",              href: "/admin/team",              icon: Users,          model: "TeamMember",      group: "content" },
  { label: "Jobs",              href: "/admin/jobs",              icon: Handshake,      model: "Job",             group: "content" },
  { label: "Contact Info",      href: "/admin/contact-info",      icon: Phone,          model: "ContactInfo",     group: "content" },
  // SETTINGS
  { label: "Site Config",       href: "/admin/site-config",       icon: Settings2,      model: "SiteConfig",      group: "settings" },
  { label: "Admin Users",       href: "/admin/users",             icon: Shield,                                   group: "settings", requiredRole: ["super_admin"] },
]

export const GROUP_LABELS: Record<AdminNavGroup, string> = {
  main: "Main",
  content: "Content",
  settings: "Settings",
}
