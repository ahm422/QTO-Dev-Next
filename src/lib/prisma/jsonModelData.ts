import type { FeaturedWorkInput } from "@/lib/validators/admin/featuredWork";
import type { IndustryInput } from "@/lib/validators/admin/industry";
import type { EngagementModelInput } from "@/lib/validators/admin/engagementModel";
import type { JobInput } from "@/lib/validators/admin/job";
import { parseArrayFields, stringifyArrayFields, stringifyPresentArrayFields } from "@/lib/prisma/arrayFields";

export function toPrismaFeaturedWorkData(input: FeaturedWorkInput) {
  const data = stringifyArrayFields(input, ["tags"]);
  return {
    ...data,
    imageUrl: data.imageUrl || null,
    imageAlt: data.imageAlt || null,
    link: data.link || null,
  };
}

export function fromPrismaFeaturedWork<T extends Record<string, unknown>>(row: T) {
  return parseArrayFields(row, ["tags"]);
}

export function toPrismaIndustryData(input: IndustryInput) {
  const data = stringifyArrayFields(input, ["bulletPoints"]);
  return { ...data, icon: data.icon || null };
}

export function fromPrismaIndustry<T extends Record<string, unknown>>(row: T) {
  return parseArrayFields(row, ["bulletPoints"]);
}

export function toPrismaEngagementModelData(input: EngagementModelInput) {
  return stringifyArrayFields(input, ["features"]);
}

export function fromPrismaEngagementModel<T extends Record<string, unknown>>(row: T) {
  return parseArrayFields(row, ["features"]);
}

export function toPrismaJobData(input: JobInput) {
  const { postedAt, expiresAt, ...rest } = input;
  const data = stringifyArrayFields(rest, ["requirements", "niceToHave"]);
  return {
    ...data,
    postedAt: postedAt ? new Date(postedAt) : null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    applyUrl: data.applyUrl || null,
    salaryRange: data.salaryRange || null,
  };
}

export function fromPrismaJob<T extends Record<string, unknown>>(row: T) {
  return parseArrayFields(row, ["requirements", "niceToHave"]);
}

export function toPartialPrismaFeaturedWorkData(input: Partial<FeaturedWorkInput>) {
  const data = stringifyPresentArrayFields(input, ["tags"]);
  if (data.imageUrl !== undefined) data.imageUrl = data.imageUrl || null;
  if (data.imageAlt !== undefined) data.imageAlt = data.imageAlt || null;
  if (data.link !== undefined) data.link = data.link || null;
  return data;
}

export function toPartialPrismaIndustryData(input: Partial<IndustryInput>) {
  const data = stringifyPresentArrayFields(input, ["bulletPoints"]);
  if (data.icon !== undefined) data.icon = data.icon || null;
  return data;
}

export function toPartialPrismaEngagementModelData(input: Partial<EngagementModelInput>) {
  return stringifyPresentArrayFields(input, ["features"]);
}

export function toPartialPrismaJobData(input: Partial<JobInput>) {
  const { postedAt, expiresAt, ...rest } = input;
  const data = stringifyPresentArrayFields(rest, ["requirements", "niceToHave"]);
  if (postedAt !== undefined) {
    (data as Record<string, unknown>).postedAt = postedAt ? new Date(postedAt) : null;
  }
  if (expiresAt !== undefined) {
    (data as Record<string, unknown>).expiresAt = expiresAt ? new Date(expiresAt) : null;
  }
  if (data.applyUrl !== undefined) data.applyUrl = data.applyUrl || null;
  if (data.salaryRange !== undefined) data.salaryRange = data.salaryRange || null;
  return data;
}
