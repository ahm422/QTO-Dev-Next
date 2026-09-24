"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { serviceSchema, type ServiceInput } from "@/lib/validators/admin/service"
import { revalidateServiceCaches } from "@/lib/revalidate"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import {
  toPrismaServiceCreateData,
  toPrismaServiceUpdateData,
} from "@/lib/prisma/serviceData"


export async function createService(data: ServiceInput) {
  await requireAdminAction()
  const parsed = serviceSchema.parse(data)
  await prisma.service.create({ data: toPrismaServiceCreateData(parsed) })
  revalidateServiceCaches(parsed.slug)
  await persistD1Bookmark()
  return { success: true }
}

export async function updateService(id: string, data: ServiceInput) {
  await requireAdminAction()
  const parsed = serviceSchema.parse(data)
  await prisma.service.update({ where: { id }, data: toPrismaServiceUpdateData(parsed) })
  revalidateServiceCaches(parsed.slug)
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteService(id: string) {
  await requireDeleteAction()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.delete({ where: { id } })
  revalidateServiceCaches(service?.slug)
  await persistD1Bookmark()
}

export async function reorderServices(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.service.update({ where: { id }, data: { order } })
  )
  revalidateServiceCaches()
  await persistD1Bookmark()
}

export async function toggleServicePublished(id: string, value: boolean) {
  await requireAdminAction()
  const service = await prisma.service.findUnique({ where: { id }, select: { slug: true } })
  await prisma.service.update({ where: { id }, data: { isPublished: value } })
  revalidateServiceCaches(service?.slug)
  await persistD1Bookmark()
}
