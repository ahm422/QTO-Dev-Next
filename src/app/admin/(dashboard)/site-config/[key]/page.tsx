import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AdminPageHeader from "@/components/admin/layout/AdminPageHeader"
import SiteConfigForm from "./SiteConfigForm"

export default async function SiteConfigFormPage({ params }: { params: Promise<{ key: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) {
    redirect("/admin/unauthorized")
  }

  const { key } = await params
  const decoded = decodeURIComponent(key)
  const isNew = decoded === "new"

  const record = isNew ? null : await prisma.siteConfig.findUnique({ where: { key: decoded } })

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isNew ? "New config entry" : record ? `Edit: ${decoded}` : `New: ${decoded}`}
        subtitle="Advanced key-value editor. Prefer Site Settings for branding, contact, and social links."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Site Config", href: "/admin/site-config" },
          { label: isNew ? "New" : "Edit" },
        ]}
      />
      <SiteConfigForm defaultValues={record ?? undefined} keyParam={key} />
    </div>
  )
}
