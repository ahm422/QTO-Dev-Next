import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SiteConfigForm from "./SiteConfigForm"

export default async function SiteConfigFormPage({ params }: { params: Promise<{ key: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const { key } = await params
  const decoded = decodeURIComponent(key)

  if (decoded === "new") {
    return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New config entry</h2><SiteConfigForm keyParam={decoded} /></div>
  }

  const record = await prisma.siteConfig.findUnique({ where: { key: decoded } })

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">{record ? `Edit: ${decoded}` : `New: ${decoded}`}</h2>
      <SiteConfigForm defaultValues={record ?? undefined} keyParam={key} />
    </div>
  )
}
