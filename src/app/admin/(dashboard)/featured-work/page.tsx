import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import FeaturedWorkTable from "./Table"

export default async function FeaturedWorkPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.featuredWork.findMany({ orderBy: { order: "asc" } })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Featured Work"
        subtitle="Showcase items on the homepage"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Featured Work" }]}
        primaryAction={{ label: "+ Add Item", href: "/admin/featured-work/new" }}
      />
      <FeaturedWorkTable rows={rows} />
    </div>
  )
}
