import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProcessStepForm from "./ProcessStepForm"

export default async function ProcessStepFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New process step</h2><ProcessStepForm /></div>
  const record = await prisma.processStep.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit process step</h2><ProcessStepForm defaultValues={record} /></div>
}
