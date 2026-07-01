"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { projectSchema, type ProjectInput } from "@/lib/validators/admin/project"
import { revalidatePaths } from "@/lib/revalidate"
import { projectPaths } from "@/lib/revalidate-paths"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import {
  toPrismaProjectCreateData,
  toPrismaProjectUpdateData,
} from "@/lib/prisma/projectData"


export async function createProject(data: ProjectInput) {
  await requireCreateAction()
  const parsed = projectSchema.parse(data)
  await prisma.project.create({ data: toPrismaProjectCreateData(parsed) })
  revalidatePaths([...projectPaths(parsed.slug)])
  redirect("/admin/projects")
}

export async function updateProject(id: string, data: ProjectInput) {
  await requireAdminAction()
  const parsed = projectSchema.parse(data)
  await prisma.project.update({ where: { id }, data: toPrismaProjectUpdateData(parsed) })
  revalidatePaths([...projectPaths(parsed.slug)])
  redirect("/admin/projects")
}

export async function deleteProject(id: string) {
  await requireDeleteAction()
  const project = await prisma.project.findUnique({ where: { id }, select: { slug: true } })
  await prisma.project.delete({ where: { id } })
  revalidatePaths([...projectPaths(project?.slug)])
}

export async function toggleProjectPublished(id: string, value: boolean) {
  await requireAdminAction()
  const project = await prisma.project.findUnique({ where: { id }, select: { slug: true } })
  await prisma.project.update({ where: { id }, data: { isPublished: value } })
  revalidatePaths([...projectPaths(project?.slug)])
}

export async function reorderProjects(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.project.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...projectPaths()])
}
