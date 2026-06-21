import { getServerSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import AboutContentForm from "./AboutContentForm"

export default async function AboutContentFormPage({ params }: { params: Promise<{ section: string }> }) {
  const session = await getServerSession()
  if (!["super_admin", "admin", "editor"].includes(session?.user?.role ?? "")) redirect("/admin/unauthorized")

  const { section } = await params
  const decoded = decodeURIComponent(section)

  if (decoded === "new") {
    return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">New about section</h2><AboutContentForm sectionParam={decoded} /></div>
  }

  const record = await prisma.aboutContent.findUnique({ where: { section: decoded } })

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-lg font-semibold">{record ? `Edit: ${decoded}` : `New section: ${decoded}`}</h2>
      <AboutContentForm defaultValues={record ?? undefined} sectionParam={decoded} />
    </div>
  )
}
