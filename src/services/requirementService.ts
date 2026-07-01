import { prisma } from "@/lib/prisma";
import { stringifyMetadata } from "@/lib/metadata";

export type CreateRequirementInput = {
  intent: string;
  name: string;
  email: string;
  message: string;
  company?: string | null;
  website?: string | null;
  role?: string | null;
  projectType?: string | null;
  industry?: string | null;
  companySize?: string | null;
  goals?: string | null;
  budgetRange?: string | null;
  startDate?: string | null;
  launchWindow?: string | null;
  urgency?: string | null;
  timeline?: string | null;
  preferredTime?: string | null;
  timezone?: string | null;
  channel?: string | null;
  features?: string | null;
  integrations?: string | null;
  successCriteria?: string | null;
  source?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function createRequirementSubmission(input: CreateRequirementInput) {
  return prisma.requirement.create({
    data: {
      intent: input.intent,
      name: input.name,
      email: input.email,
      message: input.message,
      company: input.company ?? null,
      website: input.website ?? null,
      role: input.role ?? null,
      projectType: input.projectType ?? null,
      industry: input.industry ?? null,
      companySize: input.companySize ?? null,
      goals: input.goals ?? null,
      budgetRange: input.budgetRange ?? null,
      startDate: input.startDate ?? null,
      launchWindow: input.launchWindow ?? null,
      urgency: input.urgency ?? null,
      timeline: input.timeline ?? null,
      preferredTime: input.preferredTime ?? null,
      timezone: input.timezone ?? null,
      channel: input.channel ?? null,
      features: input.features ?? null,
      integrations: input.integrations ?? null,
      successCriteria: input.successCriteria ?? null,
      source: input.source ?? null,
      referrer: input.referrer ?? null,
      userAgent: input.userAgent ?? null,
      ip: input.ip ?? null,
      metadata: stringifyMetadata(input.metadata),
    },
    select: { id: true },
  });
}
