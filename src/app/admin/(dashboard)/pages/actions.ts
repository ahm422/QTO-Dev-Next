"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePaths } from "@/lib/revalidate"
import { pageSectionPaths } from "@/lib/revalidate-paths"
import { redirect } from "next/navigation"
async function invalidate(slug: string) {
  revalidatePaths(pageSectionPaths(slug))
}

export async function updatePageSection(slug: string, data: object, isPublished: boolean, label?: string) {
  await requireAdminAction()
  await prisma.pageSection.update({
    where: { slug },
    data: { data: data as never, isPublished, label },
  })
  await invalidate(slug)
  redirect("/admin/pages")
}

export async function togglePageSectionPublished(slug: string, value: boolean) {
  await requireAdminAction()
  await prisma.pageSection.update({ where: { slug }, data: { isPublished: value } })
  await invalidate(slug)
}

export async function createPageSection(slug: string, label: string, data: object) {
  await requireCreateAction()
  await prisma.pageSection.create({ data: { slug, label, data: data as never, isPublished: true } })
  await invalidate(slug)
  redirect("/admin/pages")
}

export async function deletePageSection(slug: string) {
  await requireDeleteAction()
  await prisma.pageSection.delete({ where: { slug } })
  await invalidate(slug)
}
