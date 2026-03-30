import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type CreateCareerApplicationInput = {
  name: string;
  email: string;
  roleInterest?: string | null;
  message: string;
  portfolioUrl?: string | null;
  linkedInUrl?: string | null;
  githubUrl?: string | null;
  source?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

export async function createCareerApplication(input: CreateCareerApplicationInput) {
  return prisma.careerApplication.create({
    data: {
      name: input.name,
      email: input.email,
      roleInterest: input.roleInterest ?? null,
      message: input.message,
      portfolioUrl: input.portfolioUrl ?? null,
      linkedInUrl: input.linkedInUrl ?? null,
      githubUrl: input.githubUrl ?? null,
      source: input.source ?? null,
      referrer: input.referrer ?? null,
      userAgent: input.userAgent ?? null,
      ip: input.ip ?? null,
      metadata: input.metadata ?? Prisma.DbNull,
    },
    select: { id: true },
  });
}

