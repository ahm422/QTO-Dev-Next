import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import EmployeesTable from "./Table"

const EMPLOYEE_ROLES = ["super_admin", "hr"]

export default async function EmployeesPage() {
  const session = await getServerSession()
  const role = session?.user?.role ?? ""
  if (!EMPLOYEE_ROLES.includes(role)) redirect("/admin/unauthorized")

  const rows = await prisma.employee.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Employees"
        subtitle="Employee records, QR badges, and onboarding"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Employees" }]}
        primaryAction={{ label: "+ Add Employee", href: "/admin/employees/new" }}
      />
      <EmployeesTable rows={rows} canDelete={role === "super_admin"} canCreate />
    </div>
  )
}
