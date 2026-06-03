import { auth } from "@/auth"
import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ServiceForm from "./ServiceForm"

export default async function ServiceFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (session?.user?.role !== "admin") redirect("/admin/unauthorized")

  const { id } = await params

  if (id === "new") {
    return (
      <div className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">New service</h2>
        <ServiceForm />
      </div>
    )
  }

  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) notFound()

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Edit service</h2>
      <ServiceForm defaultValues={service} />
    </div>
  )
}
