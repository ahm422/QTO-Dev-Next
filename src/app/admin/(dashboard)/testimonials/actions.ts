"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { testimonialSchema, type TestimonialInput } from "@/lib/validators/admin/testimonial"

async function requireAdmin() {
  const session = await auth()
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
