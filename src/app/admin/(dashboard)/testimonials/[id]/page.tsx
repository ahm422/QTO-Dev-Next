import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import TestimonialForm from "./TestimonialForm"

export default async function TestimonialFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Testimonial" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Testimonials", href: "/admin/testimonials" }, { label: "New" }]} />
        <TestimonialForm />
      </div>
    )
  }

  const record = await prisma.testimonial.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Testimonial" subtitle={record.clientName} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Testimonials", href: "/admin/testimonials" }, { label: "Edit" }]} />
      <TestimonialForm defaultValues={record} />
    </div>
  )
}
