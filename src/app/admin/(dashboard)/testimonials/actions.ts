"use server"

import { requireAdminAction, requireDeleteAction } from "@/lib/auth/requireServerAction"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { testimonialSchema, type TestimonialInput } from "@/lib/validators/admin/testimonial"
import { persistOrderUpdates } from "@/lib/admin/reorder"


export async function createTestimonial(data: TestimonialInput) {
  await requireAdminAction()
  await prisma.testimonial.create({ data: testimonialSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/testimonials")
}

export async function updateTestimonial(id: string, data: TestimonialInput) {
  await requireAdminAction()
  await prisma.testimonial.update({ where: { id }, data: testimonialSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/testimonials")
}

export async function deleteTestimonial(id: string) {
  await requireDeleteAction()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleTestimonialPublished(id: string, value: boolean) {
  await requireAdminAction()
  await prisma.testimonial.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}

export async function reorderTestimonials(items: { id: string; order: number }[]) {
  await requireAdminAction()
  await persistOrderUpdates(items, (id, order) =>
    prisma.testimonial.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}
