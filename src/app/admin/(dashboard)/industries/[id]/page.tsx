import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import IndustryForm from "./IndustryForm"

export default async function IndustryFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New industry</h2><IndustryForm /></div>
  const record = await prisma.industry.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit industry</h2><IndustryForm defaultValues={record} /></div>
}
