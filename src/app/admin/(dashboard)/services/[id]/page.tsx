import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ServiceForm from "./ServiceForm"

export default async function ServiceFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const { id } = await params
  const isNew = id === "new"

  if (!isNew) {
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) notFound()

    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit Service"
          subtitle={service.title}
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Services", href: "/admin/services" },
            { label: "Edit" },
          ]}
          badges={[{ label: service.isPublished ? "Published" : "Draft", variant: service.isPublished ? "success" : "warning" }]}
        />
        <ServiceForm defaultValues={service} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Service"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Services", href: "/admin/services" },
          { label: "New" },
        ]}
      />
      <ServiceForm />
    </div>
  )
}
