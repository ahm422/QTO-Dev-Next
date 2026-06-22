import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import FaqsTable from "./Table"

export default async function FaqsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.faq.findMany({ orderBy: [{ context: "asc" }, { order: "asc" }] })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQs"
        subtitle="Frequently asked questions across the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "FAQs" }]}
        publicHref="/faqs"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add FAQ", href: "/admin/faqs/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[
          { label: "FAQs page", href: "/faqs" },
          { label: "Homepage → FAQs teaser", href: "/" },
        ]}
        description="Listed on the public /faqs page (grouped by category) and teased in the homepage FAQs section."
        component="FAQsSection in src/app/(qtodev)/sections/FAQsSection.tsx"
      />
      <FaqsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
