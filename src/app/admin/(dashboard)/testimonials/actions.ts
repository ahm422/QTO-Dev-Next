"use server"

import { getServerSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { testimonialSchema, type TestimonialInput } from "@/lib/validators/admin/testimonial"
import { persistOrderUpdates } from "@/lib/admin/reorder"

async function requireAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== "admin") throw new Error("Unauthorized")
}

export async function createTestimonial(data: TestimonialInput) {
  await requireAdmin()
  await prisma.testimonial.create({ data: testimonialSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/testimonials")
}

export async function updateTestimonial(id: string, data: TestimonialInput) {
  await requireAdmin()
  await prisma.testimonial.update({ where: { id }, data: testimonialSchema.parse(data) })
  revalidatePath("/")
  redirect("/admin/testimonials")
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/")
}

export async function toggleTestimonialPublished(id: string, value: boolean) {
  await requireAdmin()
  await prisma.testimonial.update({ where: { id }, data: { isPublished: value } })
  revalidatePath("/")
}

export async function reorderTestimonials(items: { id: string; order: number }[]) {
  await requireAdmin()
  await persistOrderUpdates(items, (id, order) =>
    prisma.testimonial.update({ where: { id }, data: { order } })
  )
  revalidatePath("/")
}
