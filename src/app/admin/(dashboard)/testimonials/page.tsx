import { getServerSession } from "@/lib/auth/session"
import { roleCanCreateContent, roleCanDeleteContent, type AdminRole } from "@/lib/auth/roles"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import AdminContentContext from "@/components/admin/layout/AdminContentContext"
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
        publicHref="/"
        primaryAction={roleCanCreateContent(role as AdminRole) ? { label: "+ Add Testimonial", href: "/admin/testimonials/new" } : undefined}
      />
      <AdminContentContext
        publicPaths={[{ label: "Homepage → Testimonials", href: "/" }]}
        description="Shown in the Testimonials slider on the homepage."
        component="TestimonialsSection in src/app/(qtodev)/sections/TestimonialsSection.tsx"
      />
      <TestimonialsTable rows={rows}
        canDelete={roleCanDeleteContent(role as AdminRole)}
        canCreate={roleCanCreateContent(role as AdminRole)}
      />
    </div>
  )
}
