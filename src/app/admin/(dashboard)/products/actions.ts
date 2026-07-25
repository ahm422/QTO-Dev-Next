"use server"

import {
  requireAdminAction,
  requireCreateAction,
  requireDeleteAction,
} from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { redirect } from "next/navigation"
import { productSchema, type ProductInput } from "@/lib/validators/admin/product"
import { revalidatePaths } from "@/lib/revalidate"
import { productPaths } from "@/lib/revalidate-paths"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import {
  toPrismaProductCreateData,
  toPrismaProductUpdateData,
} from "@/lib/prisma/productData"

export async function createProduct(data: ProductInput) {
  await requireCreateAction()
  const parsed = productSchema.parse(data)
  await prisma.product.create({ data: toPrismaProductCreateData(parsed) })
  revalidatePaths([...productPaths(parsed.slug)])
  await persistD1Bookmark()
  redirect("/admin/products")
}

export async function updateProduct(id: string, data: ProductInput) {
  await requireAdminAction()
  const parsed = productSchema.parse(data)
  await prisma.product.update({
    where: { id },
    data: toPrismaProductUpdateData(parsed),
  })
  revalidatePaths([...productPaths(parsed.slug)])
  await persistD1Bookmark()
  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  await requireDeleteAction()
  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  })
  await prisma.product.delete({ where: { id } })
  revalidatePaths([...productPaths(product?.slug)])
  await persistD1Bookmark()
}

export async function reorderProducts(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.product.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...productPaths()])
  await persistD1Bookmark()
}

export async function toggleProductPublished(id: string, value: boolean) {
  await requireAdminAction()
  const product = await prisma.product.findUnique({
    where: { id },
    select: { slug: true },
  })
  await prisma.product.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...productPaths(product?.slug)])
  await persistD1Bookmark()
}
