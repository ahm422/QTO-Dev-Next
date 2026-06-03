import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import WorkValuesTable from "./Table"

export default async function WorkValuesPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.workValue.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Work Values"
        subtitle="Core values and culture items"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Work Values" }]}
        primaryAction={{ label: "+ Add Value", href: "/admin/work-values/new" }}
      />
      <WorkValuesTable rows={rows} />
    </div>
  )
}
