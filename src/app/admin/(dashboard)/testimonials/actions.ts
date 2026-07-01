"use server"

import { requireAdminAction, requireCreateAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { persistD1Bookmark } from "@/lib/d1/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { testimonialSchema, type TestimonialInput } from "@/lib/validators/admin/testimonial"
import { persistOrderUpdates } from "@/lib/admin/reorder"


export async function createTestimonial(data: TestimonialInput) {
  await requireCreateAction()
  await prisma.testimonial.create({ data: testimonialSchema.parse(data) })
  revalidatePath("/")
  await persistD1Bookmark()
  redirect("/admin/testimonials")
}

export async function updateTestimonial(id: string, data: TestimonialInput) {
  await requireAdminAction()
  await prisma.testimonial.update({ where: { id }, data: testimonialSchema.parse(data) })
  revalidatePath("/")
  await persistD1Bookmark()
  redirect("/admin/testimonials")
}

export async function deleteTestimonial(id: string) {
  await requireDeleteAction()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function toggleTestimonialPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.testimonial.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
  await persistD1Bookmark()
}

export async function reorderTestimonials(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.testimonial.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
  await persistD1Bookmark()
}
