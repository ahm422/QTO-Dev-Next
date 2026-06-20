"use server"

import { getServerSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { serviceSchema, type ServiceInput } from "@/lib/validators/admin/service"
import { revalidatePaths } from "@/lib/revalidate"
import { servicePaths } from "@/lib/revalidate-paths"
import { persistOrderUpdates } from "@/lib/admin/reorder"

async function requireAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createService(data: ServiceInput) {
  await requireAdmin()
  const parsed = serviceSchema.parse(data)
  await prisma.service.create({ data: parsed })
  revalidatePaths([...servicePaths(parsed.slug)])
  redirect("/admin/services")
}

export async function updateService(id: string, data: ServiceInput) {
  await requireAdmin()
  const parsed = serviceSchema.parse(data)
  await prisma.service.update({ where: { id }, data: parsed })
  revalidatePaths([...servicePaths(parsed.slug)])
  redirect("/admin/services")
}

export async function deleteService(id: string) {
  await requireAdmin()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.delete({ where: { id } })
  revalidatePaths([...servicePaths(service?.slug)])
}

export async function reorderServices(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.service.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...servicePaths()])
}

export async function toggleServicePublished(id: string, value: boolean) {
  await requireAdmin()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...servicePaths(service?.slug)])
}
