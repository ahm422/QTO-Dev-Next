import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type CreateContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  metadata?: Prisma.InputJsonValue | null;
};

export async function createContactSubmission(input: CreateContactInput) {
  return prisma.contact.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      source: input.source ?? null,
      referrer: input.referrer ?? null,
      userAgent: input.userAgent ?? null,
      ip: input.ip ?? null,
      metadata: input.metadata ?? null,
    },
    select: { id: true },
  });
}

