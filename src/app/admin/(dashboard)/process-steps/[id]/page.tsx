import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import ProcessStepForm from "./ProcessStepForm"

export default async function ProcessStepFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")

  const { id } = await params
  const isNew = id === "new"

  if (!isNew) {
    const record = await prisma.processStep.findUnique({ where: { id } })
    if (!record) notFound()

    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Edit Process Step"
          subtitle={record.title}
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Process Steps", href: "/admin/process-steps" },
            { label: "Edit" },
          ]}
          badges={[{ label: record.isPublished ? "Published" : "Draft", variant: record.isPublished ? "success" : "warning" }]}
        />
        <ProcessStepForm defaultValues={record} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="New Process Step"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Process Steps", href: "/admin/process-steps" },
          { label: "New" },
        ]}
      />
      <ProcessStepForm />
    </div>
  )
}
