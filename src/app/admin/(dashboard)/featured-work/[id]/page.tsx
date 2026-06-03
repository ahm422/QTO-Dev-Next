import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import FeaturedWorkForm from "./FeaturedWorkForm"

export default async function FeaturedWorkFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New featured work</h2><FeaturedWorkForm /></div>
  const record = await prisma.featuredWork.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit featured work</h2><FeaturedWorkForm defaultValues={record} /></div>
}
