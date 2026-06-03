import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import EngagementModelsTable from "./Table"

export default async function EngagementModelsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.engagementModel.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Engagement Models"
        subtitle="How clients can work with QTO"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Engagement Models" }]}
        primaryAction={{ label: "+ Add Model", href: "/admin/engagement-models/new" }}
      />
      <EngagementModelsTable rows={rows} />
    </div>
  )
}
