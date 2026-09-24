import type { Prisma } from "@prisma/client";
import type { ServiceInput } from "@/lib/validators/admin/service";
import { normalizeStoredHtml } from "@/lib/sanitize-html";
import {
  createOrderedChildren,
  orderedTagValues,
  parseStringArray,
  replaceOrderedChildren,
  stringifyStringArray,
} from "@/lib/prisma/arrayFields";
import {
  createContentFaqs,
  mapContentFaqRows,
  replaceContentFaqs,
  type ContentFaqRow,
} from "@/lib/prisma/contentFaqs";

const serviceInclude = {
  technologyTags: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ServiceInclude;

export const serviceWithTagsInclude = serviceInclude;

export const serviceDetailInclude = {
  ...serviceWithTagsInclude,
  faqs: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ServiceInclude;

export type ServiceWithTags = Prisma.ServiceGetPayload<{
  include: typeof serviceWithTagsInclude;
}>;

export type ServiceFaqSource = ServiceWithTags & { faqs?: ContentFaqRow[] };

type ServiceScalars = Omit<ServiceInput, "features" | "technologyTags" | "faqs">;

function toServiceScalars(input: ServiceInput): ServiceScalars {
  const scalars = { ...input };
  delete (scalars as Partial<ServiceInput>).features;
  delete (scalars as Partial<ServiceInput>).technologyTags;
  delete (scalars as Partial<ServiceInput>).faqs;
  return scalars as ServiceScalars;
}

export function toPrismaServiceCreateData(
  input: ServiceInput
): Prisma.ServiceCreateInput {
  const scalars = toServiceScalars(input);
  return {
    ...scalars,
    imageUrl: scalars.imageUrl || null,
    imageAlt: scalars.imageAlt || null,
    description: normalizeStoredHtml(scalars.description || ""),
    features: stringifyStringArray(input.features),
    technologyTags: createOrderedChildren(input.technologyTags),
    faqs: createContentFaqs(input.faqs),
  };
}

export function toPrismaServiceUpdateData(
  input: ServiceInput
): Prisma.ServiceUpdateInput {
  const scalars = toServiceScalars(input);
  return {
    ...scalars,
    imageUrl: scalars.imageUrl || null,
    imageAlt: scalars.imageAlt || null,
    description: normalizeStoredHtml(scalars.description || ""),
    features: stringifyStringArray(input.features),
    technologyTags: replaceOrderedChildren(input.technologyTags),
    faqs: replaceContentFaqs(input.faqs),
  };
}

export function toPrismaServicePartialUpdateData(
  input: Partial<ServiceInput>
): Prisma.ServiceUpdateInput {
  const data: Prisma.ServiceUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.shortDescription !== undefined) data.shortDescription = input.shortDescription;
  if (input.description !== undefined) data.description = normalizeStoredHtml(input.description);
  if (input.icon !== undefined) data.icon = input.icon;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl || null;
  if (input.imageAlt !== undefined) data.imageAlt = input.imageAlt || null;
  if (input.order !== undefined) data.order = input.order;
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;
  if (input.features !== undefined) data.features = stringifyStringArray(input.features);
  if (input.technologyTags !== undefined) {
    data.technologyTags = replaceOrderedChildren(input.technologyTags);
  }
  if (input.faqs !== undefined) data.faqs = replaceContentFaqs(input.faqs);

  return data;
}

/** Map Prisma row (with included tags) to API/form shape with string arrays. */
export function fromPrismaService(row: ServiceFaqSource) {
  const { faqs: faqRows, ...rest } = row;
  return {
    ...rest,
    features: parseStringArray(row.features),
    technologyTags: orderedTagValues(row.technologyTags),
    faqs: mapContentFaqRows(faqRows),
  };
}
