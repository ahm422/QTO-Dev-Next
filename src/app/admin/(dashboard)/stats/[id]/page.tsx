import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import StatForm from "./StatForm"

export default async function StatFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New stat</h2><StatForm /></div>
  const record = await prisma.stat.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit stat</h2><StatForm defaultValues={record} /></div>
}
