import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import Link from "next/link"
import { Pencil, Globe, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ConfirmDelete from "@/components/admin/ConfirmDelete"
import { deletePageSection } from "./actions"

const PAGE_LABELS: Record<string, string> = {
  homepage: "Homepage",
  services: "Services",
  about: "About",
  blogs: "Blog",
  careers: "Careers",
  projects: "Projects",
  contact: "Contact",
  faqs: "FAQs",
}

export default async function PagesAdminPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const canDelete = roleCanDeleteContent(role as AdminRole)
  const canCreate = roleCanCreateContent(role as AdminRole)

  const sections = await prisma.pageSection.findMany({ orderBy: { slug: "asc" } })

  // Group by page prefix
  const grouped = sections.reduce<Record<string, typeof sections>>((acc, s) => {
    const page = s.slug.split(".")[0]
    if (!acc[page]) acc[page] = []
    acc[page].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Pages"
        subtitle="Manage page-level copy: heroes, headings, CTAs, and section text"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Pages" }]}
        primaryAction={canCreate ? { label: "+ New Section", href: "/admin/pages/new" } : undefined}
      />

      {Object.entries(grouped).map(([page, items]) => (
        <div key={page} className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              {PAGE_LABELS[page] ?? page}
            </h2>
            <span className="text-xs text-muted-foreground">({items.length} sections)</span>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {items.map((section) => (
                <div key={section.slug} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {section.label ?? section.slug}
                      </p>
                      {section.isPublished ? (
                        <CheckCircle className="h-3.5 w-3.5 text-[var(--admin-success)] shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-[var(--admin-warning)] shrink-0" />
                      )}
                    </div>
                    <code className="text-xs text-muted-foreground font-mono">{section.slug}</code>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] ${section.isPublished ? "text-[var(--admin-success)] border-[var(--admin-success)]/30" : "text-[var(--admin-warning)] border-[var(--admin-warning)]/30"}`}>
                      {section.isPublished ? "Live" : "Hidden"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/pages/${encodeURIComponent(section.slug)}`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    {canDelete && (
                      <ConfirmDelete
                        itemName={section.label ?? section.slug}
                        onConfirm={() => deletePageSection(section.slug)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {sections.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Globe className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No page sections yet. Run the database seed to populate them.</p>
        </div>
      )}
    </div>
  )
}
