import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import WhyChooseUsForm from "./WhyChooseUsForm"

export default async function WhyChooseUsFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="New Why Choose Us Item" breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Why Choose Us", href: "/admin/why-choose-us" }, { label: "New" }]} />
        <WhyChooseUsForm />
      </div>
    )
  }

  const record = await prisma.whyChooseUs.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Why Choose Us Item" subtitle={record.title} badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]} breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Why Choose Us", href: "/admin/why-choose-us" }, { label: "Edit" }]} />
      <WhyChooseUsForm defaultValues={record} />
    </div>
  )
}
