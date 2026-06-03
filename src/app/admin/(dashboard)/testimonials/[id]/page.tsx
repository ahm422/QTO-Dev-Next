import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TestimonialForm from "./TestimonialForm"

export default async function TestimonialFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")
  const { id } = await params
  if (id === "new") return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">New testimonial</h2><TestimonialForm /></div>
  const record = await prisma.testimonial.findUnique({ where: { id } })
  if (!record) notFound()
  return <div className="max-w-2xl space-y-4"><h2 className="text-lg font-semibold">Edit testimonial</h2><TestimonialForm defaultValues={record} /></div>
}
