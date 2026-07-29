"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { revalidateTag } from "next/cache"
import { projectSchema, type ProjectInput } from "@/lib/validators/admin/project"
import { revalidatePaths } from "@/lib/revalidate"
import { projectPaths, servicePaths } from "@/lib/revalidate-paths"
import { persistOrderUpdates } from "@/lib/admin/reorder"
import {
  toPrismaProjectCreateData,
  toPrismaProjectUpdateData,
} from "@/lib/prisma/projectData"

function revalidateProjectCaches(
  projectSlug?: string | null,
  ...serviceSlugs: (string | null | undefined)[]
) {
  const paths = [...projectPaths(projectSlug)]
  for (const slug of serviceSlugs) {
    if (slug) paths.push(...servicePaths(slug))
  }
  revalidatePaths(paths)
  revalidateTag("projects", "max")
}

export async function createProject(data: ProjectInput) {
  await requireCreateAction()
  const parsed = projectSchema.parse(data)
  await prisma.project.create({ data: toPrismaProjectCreateData(parsed) })
  revalidateProjectCaches(parsed.slug, parsed.serviceSlug)
  await persistD1Bookmark()
  return { success: true }
}

export async function updateProject(id: string, data: ProjectInput) {
  await requireAdminAction()
  const parsed = projectSchema.parse(data)
  const previous = await prisma.project.findUnique({
    where: { id },
    select: { serviceSlug: true },
  })
  await prisma.project.update({ where: { id }, data: toPrismaProjectUpdateData(parsed) })
  revalidateProjectCaches(
    parsed.slug,
    parsed.serviceSlug,
    previous?.serviceSlug
  )
  await persistD1Bookmark()
  return { success: true }
}

export async function deleteProject(id: string) {
  await requireDeleteAction()
  const project = await prisma.project.findUnique({
    where: { id },
    select: { slug: true, serviceSlug: true },
  })
  await prisma.project.delete({ where: { id } })
  revalidateProjectCaches(project?.slug, project?.serviceSlug)
  await persistD1Bookmark()
}

export async function toggleProjectPublished(id: string, value: boolean) {
  await requireAdminAction()
  const project = await prisma.project.findUnique({
    where: { id },
    select: { slug: true, serviceSlug: true },
  })
  await prisma.project.update({ where: { id }, data: { isPublished: value } })
  revalidateProjectCaches(project?.slug, project?.serviceSlug)
  await persistD1Bookmark()
}

export async function reorderProjects(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.project.update({ where: { id }, data: { order } })
  )
  revalidatePaths([...projectPaths()])
  revalidateTag("projects", "max")
  await persistD1Bookmark()
}
