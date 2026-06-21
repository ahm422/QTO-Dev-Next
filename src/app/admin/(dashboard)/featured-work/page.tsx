import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import FeaturedWorkTable from "./Table"

export default async function FeaturedWorkPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.featuredWork.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Featured Work"
        subtitle="Showcase items on the homepage"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Featured Work" }]}
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Item", href: "/admin/featured-work/new" } : undefined}
      />
      <FeaturedWorkTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
