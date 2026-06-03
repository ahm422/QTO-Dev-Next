"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { projectSchema, type ProjectInput } from "@/lib/validators/admin/project"

async function requireAdmin() {
  const session = await auth()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createProject(data: ProjectInput) {
  await requireAdmin()
  const { completedAt, ...rest } = projectSchema.parse(data)
  await prisma.project.create({ data: { ...rest, completedAt: completedAt ? new Date(completedAt) : null } })
  revalidatePath("/")
  revalidatePath("/projects")
  redirect("/admin/projects")
}

export async function updateProject(id: string, data: ProjectInput) {
  await requireAdmin()
  const { completedAt, ...rest } = projectSchema.parse(data)
  await prisma.project.update({ where: { id }, data: { ...rest, completedAt: completedAt ? new Date(completedAt) : null } })
  revalidatePath("/")
  revalidatePath("/projects")
  revalidatePath(`/projects/${rest.slug}`)
  redirect("/admin/projects")
}

export async function deleteProject(id: string) {
  await requireAdmin()
  const project = await prisma.project.findUnique({ where: { id }, select: { slug: true } })
  await prisma.project.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/projects")
  if (project) revalidatePath(`/projects/${project.slug}`)
}

export async function toggleProjectPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.project.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  revalidatePath("/projects")
}
