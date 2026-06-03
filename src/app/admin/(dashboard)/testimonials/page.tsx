import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TestimonialsTable from "./Table"

export default async function TestimonialsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        subtitle="Client reviews and social proof"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Testimonials" }]}
        primaryAction={{ label: "+ Add Testimonial", href: "/admin/testimonials/new" }}
      />
      <TestimonialsTable rows={rows} />
    </div>
  )
}
