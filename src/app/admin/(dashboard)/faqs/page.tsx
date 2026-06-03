import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import FaqsTable from "./Table"

export default async function FaqsPage() {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const rows = await prisma.faq.findMany({ orderBy: [{ context: "asc" }, { order: "asc" }] })
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQs"
        subtitle="Frequently asked questions across the site"
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "FAQs" }]}
        primaryAction={{ label: "+ Add FAQ", href: "/admin/faqs/new" }}
      />
      <FaqsTable rows={rows} />
    </div>
  )
}
