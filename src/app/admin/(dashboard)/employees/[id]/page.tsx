import { getServerSession } from "@/lib/auth/session"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getPublicUrl } from "@/lib/garage"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import EmployeeForm from "./EmployeeForm"

const EMPLOYEE_ROLES = ["super_admin", "hr"]

export default async function EmployeeFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  if (!EMPLOYEE_ROLES.includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")
  const { id } = await params

  if (id === "new") {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="New Employee"
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Employees", href: "/admin/employees" }, { label: "New" }]}
        />
        <EmployeeForm />
      </div>
    )
  }

  const record = await prisma.employee.findUnique({ where: { id } })
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Edit Employee"
        subtitle={record.name}
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Employees", href: "/admin/employees" }, { label: "Edit" }]}
      />
      <EmployeeForm
        defaultValues={record}
        photoUrl={record.photoKey ? getPublicUrl(record.photoKey) : null}
        qrUrl={record.qrKey ? getPublicUrl(record.qrKey) : null}
      />
    </div>
  )
}
