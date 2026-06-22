import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
import WhyChooseUsTable from "./Table"

export default async function WhyChooseUsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.whyChooseUs.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Why Choose Us"
        subtitle="Reasons and differentiators shown on the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Why Choose Us" }]}
        publicHref="/"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Item", href: "/admin/why-choose-us/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[{ label: "Homepage → Why Choose Us", href: "/" }]}
        description="Populates the 'Why Choose Us' reasons block on the homepage."
        component="WhyChooseUsSection in src/app/(qtodev)/sections/WhyChooseUsSection.tsx"
      />
      <WhyChooseUsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
