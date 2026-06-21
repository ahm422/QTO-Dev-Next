import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TestimonialsTable from "./Table"

export default async function TestimonialsPage() {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const role = session?.user?.role ?? ""
  const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        subtitle="Client reviews and social proof"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Testimonials" }]}
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Testimonial", href: "/admin/testimonials/new" } : undefined}
      />
      <TestimonialsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
