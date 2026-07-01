import { prisma } from "@/lib/prisma";
import { stringifyMetadata } from "@/lib/metadata";

export type CreateContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
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
      metadata: stringifyMetadata(input.metadata),
    },
    select: { id: true },
  });
}

