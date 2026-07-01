"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { redirect } from "next/navigation"
import { serviceSchema, type ServiceInput } from "@/lib/validators/admin/service"
import { revalidatePaths } from "@/lib/revalidate"
import { servicePaths } from "@/lib/revalidate-paths"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import {
  toPrismaServiceCreateData,
  toPrismaServiceUpdateData,
} from "@/lib/prisma/serviceData"


export async function createService(data: ServiceInput) {
  await requireCreateAction()
  const parsed = serviceSchema.parse(data)
  await prisma.service.create({ data: toPrismaServiceCreateData(parsed) })
  revalidatePaths([...servicePaths(parsed.slug)])
  await persistD1Bookmark()
  redirect("/admin/services")
}

export async function updateService(id: string, data: ServiceInput) {
  await requireAdminAction()
  const parsed = serviceSchema.parse(data)
  await prisma.service.update({ where: { id }, data: toPrismaServiceUpdateData(parsed) })
  revalidatePaths([...servicePaths(parsed.slug)])
  await persistD1Bookmark()
  redirect("/admin/services")
}

export async function deleteService(id: string) {
  await requireDeleteAction()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.delete({ where: { id } })
  revalidatePaths([...servicePaths(service?.slug)])
  await persistD1Bookmark()
}

export async function reorderServices(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.service.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...servicePaths()])
  await persistD1Bookmark()
}

export async function toggleServicePublished(id: string, value: boolean) {
  await requireAdminAction()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...servicePaths(service?.slug)])
  await persistD1Bookmark()
}
