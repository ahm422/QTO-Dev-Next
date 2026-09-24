"use server"

import {
  requireAdminAction,
  requireCreateAction,
  requireDeleteAction,
} from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { productSchema, type ProductInput } from "@/lib/validators/admin/product"
import { revalidateProductsCaches } from "@/lib/revalidate"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import {
  toPrismaProductCreateData,
  toPrismaProductUpdateData,
} from "@/lib/prisma/productData"
import { triggerChatbotSync } from "@/lib/chat/triggerChatbotSync"

export async function createProduct(data: ProductInput) {
  await requireCreateAction()
  const parsed = productSchema.parse(data)
  await prisma.product.create({ data: toPrismaProductCreateData(parsed) })
  revalidateProductsCaches()
  triggerChatbotSync("products")
  await persistD1Bookmark()
  return { success: true }
}

export async function updateProduct(id: string, data: ProductInput) {
  await requireAdminAction()
  const parsed = productSchema.parse(data)
  await prisma.product.update({
    where: { id },
    data: toPrismaProductUpdateData(parsed),
  })
  revalidateProductsCaches()
  triggerChatbotSync("products")
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteProduct(id: string) {
  await requireDeleteAction()
  await prisma.product.delete({ where: { id } })
  revalidateProductsCaches()
  triggerChatbotSync("products")
  await persistD1Bookmark()
}

export async function reorderProducts(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.product.update({ where: { id }, data: { order } })
  )
  revalidateProductsCaches()
  triggerChatbotSync("products")
  await persistD1Bookmark()
}

export async function toggleProductPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.product.update({ where: { id }, data: { isPublished: value } })
  revalidateProductsCaches()
  triggerChatbotSync("products")
  await persistD1Bookmark()
}
