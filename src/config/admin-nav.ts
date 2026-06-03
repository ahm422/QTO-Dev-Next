export type AdminNavItem = {
  label: string
  href: string
  model?: string
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard",         href: "/admin" },
  { label: "Services",          href: "/admin/services",          model: "Service" },
  { label: "Process Steps",     href: "/admin/process-steps",     model: "ProcessStep" },
  { label: "Featured Work",     href: "/admin/featured-work",     model: "FeaturedWork" },
  { label: "Why Choose Us",     href: "/admin/why-choose-us",     model: "WhyChooseUs" },
  { label: "Stats",             href: "/admin/stats",             model: "Stat" },
  { label: "Testimonials",      href: "/admin/testimonials",      model: "Testimonial" },
  { label: "Industries",        href: "/admin/industries",        model: "Industry" },
  { label: "Engagement Models", href: "/admin/engagement-models", model: "EngagementModel" },
  { label: "FAQs",              href: "/admin/faqs",              model: "Faq" },
  { label: "Blog",              href: "/admin/blog",              model: "BlogPost" },
  { label: "Technologies",      href: "/admin/technologies",      model: "Technology" },
  { label: "Projects",          href: "/admin/projects",          model: "Project" },
  { label: "Work Values",       href: "/admin/work-values",       model: "WorkValue" },
  { label: "About",             href: "/admin/about",             model: "AboutContent" },
  { label: "Team",              href: "/admin/team",              model: "TeamMember" },
  { label: "Jobs",              href: "/admin/jobs",              model: "Job" },
  { label: "Contact Info",      href: "/admin/contact-info",      model: "ContactInfo" },
  { label: "Site Config",       href: "/admin/site-config",       model: "SiteConfig" },
]
