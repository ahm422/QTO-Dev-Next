import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { JobApplicationInput } from "@/lib/validators/jobApplication"

export type CreateJobApplicationInput = JobApplicationInput & {
  source?: string | null
  referrer?: string | null
  userAgent?: string | null
  ip?: string | null
  metadata?: Prisma.InputJsonValue | null
}

export async function createJobApplication(input: CreateJobApplicationInput) {
  return prisma.jobApplication.create({
    data: {
      jobId: input.jobId,
      jobTitle: input.jobTitle,
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      coverLetter: input.coverLetter ?? null,
      resumeUrl: input.resumeUrl || null,
      linkedinUrl: input.linkedinUrl || null,
      source: input.source ?? null,
      referrer: input.referrer ?? null,
      userAgent: input.userAgent ?? null,
      ip: input.ip ?? null,
      metadata: input.metadata ?? Prisma.DbNull,
    },
    select: { id: true },
  })
}
