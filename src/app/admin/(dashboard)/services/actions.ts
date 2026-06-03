"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { serviceSchema, type ServiceInput } from "@/lib/validators/admin/service"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createService(data: ServiceInput) {
  await requireAdmin()
  const parsed = serviceSchema.parse(data)
  await prisma.service.create({ data: parsed })
  revalidatePath("/")
  revalidatePath("/services")
  redirect("/admin/services")
}

export async function updateService(id: string, data: ServiceInput) {
  await requireAdmin()
  const parsed = serviceSchema.parse(data)
  await prisma.service.update({ where: { id }, data: parsed })
  revalidatePath("/")
  revalidatePath("/services")
  revalidatePath(`/services/${parsed.slug}`)
  redirect("/admin/services")
}

export async function deleteService(id: string) {
  await requireAdmin()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/services")
  if (service) revalidatePath(`/services/${service.slug}`)
}

export async function reorderServices(items: { id: string; order: number }[]) {
  await requireAdmin()
  await Promise.all(
    items.map((item) => prisma.service.update({ where: { id: item.id }, data: { order: item.order } }))
  )
  revalidatePath("/services")
}

export async function toggleServicePublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.service.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  revalidatePath("/services")
}
