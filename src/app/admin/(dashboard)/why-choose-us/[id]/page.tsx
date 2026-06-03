import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import WhyChooseUsForm from "./WhyChooseUsForm"

export default async function WhyChooseUsFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New item</h2><WhyChooseUsForm /></div>
  const record = await prisma.whyChooseUs.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit item</h2><WhyChooseUsForm defaultValues={record} /></div>
}
