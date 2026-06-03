import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import JobForm from "./JobForm"

export default async function JobFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">New job</h2><JobForm /></div>
  const record = await prisma.job.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-3xl space-y-4"><h2 className="text-lg font-semibold">Edit job</h2><JobForm defaultValues={record} /></div>
}
