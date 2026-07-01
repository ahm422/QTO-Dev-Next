import type { Prisma } from "@prisma/client";
import type { ProjectInput } from "@/lib/validators/admin/project";
import {
  createOrderedChildren,
  orderedTagValues,
  parseStringArray,
  replaceOrderedChildren,
  stringifyStringArray,
} from "@/lib/prisma/arrayFields";

const projectInclude = {
  tags: { orderBy: { sortOrder: "asc" as const } },
  techStack: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProjectInclude;

export const projectWithRelationsInclude = projectInclude;

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: typeof projectWithRelationsInclude;
}>;

type ProjectScalars = Omit<ProjectInput, "tags" | "results" | "images" | "techStack">;

function toProjectScalars(input: ProjectInput): ProjectScalars {
  const { tags: _t, results: _r, images: _i, techStack: _s, ...scalars } = input;
  return scalars;
}

export function toPrismaProjectCreateData(
  input: ProjectInput
): Prisma.ProjectCreateInput {
  const scalars = toProjectScalars(input);
  return {
    ...scalars,
    client: scalars.client || null,
    category: scalars.category || "",
    excerpt: scalars.excerpt || "",
    description: scalars.description || "",
    challenge: scalars.challenge || null,
    solution: scalars.solution || null,
    coverImageUrl: scalars.coverImageUrl || null,
    liveUrl: scalars.liveUrl || null,
    completedAt: scalars.completedAt ? new Date(scalars.completedAt) : null,
    results: stringifyStringArray(input.results),
    images: stringifyStringArray(input.images),
    tags: createOrderedChildren(input.tags),
    techStack: createOrderedChildren(input.techStack),
  };
}

export function toPrismaProjectUpdateData(
  input: ProjectInput
): Prisma.ProjectUpdateInput {
  const scalars = toProjectScalars(input);
  return {
    ...scalars,
    client: scalars.client || null,
    category: scalars.category || "",
    excerpt: scalars.excerpt || "",
    description: scalars.description || "",
    challenge: scalars.challenge || null,
    solution: scalars.solution || null,
    coverImageUrl: scalars.coverImageUrl || null,
    liveUrl: scalars.liveUrl || null,
    completedAt: scalars.completedAt ? new Date(scalars.completedAt) : null,
    results: stringifyStringArray(input.results),
    images: stringifyStringArray(input.images),
    tags: replaceOrderedChildren(input.tags),
    techStack: replaceOrderedChildren(input.techStack),
  };
}

export function toPrismaProjectPartialUpdateData(
  input: Partial<ProjectInput>
): Prisma.ProjectUpdateInput {
  const data: Prisma.ProjectUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.category !== undefined) data.category = input.category;
  if (input.excerpt !== undefined) data.excerpt = input.excerpt;
  if (input.description !== undefined) data.description = input.description;
  if (input.isFeatured !== undefined) data.isFeatured = input.isFeatured;
  if (input.order !== undefined) data.order = input.order;
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;
  if (input.results !== undefined) data.results = stringifyStringArray(input.results);
  if (input.images !== undefined) data.images = stringifyStringArray(input.images);
  if (input.client !== undefined) data.client = input.client || null;
  if (input.coverImageUrl !== undefined) data.coverImageUrl = input.coverImageUrl || null;
  if (input.liveUrl !== undefined) data.liveUrl = input.liveUrl || null;
  if (input.challenge !== undefined) data.challenge = input.challenge || null;
  if (input.solution !== undefined) data.solution = input.solution || null;
  if (input.completedAt !== undefined) {
    data.completedAt = input.completedAt ? new Date(input.completedAt) : null;
  }
  if (input.tags !== undefined) data.tags = replaceOrderedChildren(input.tags);
  if (input.techStack !== undefined) data.techStack = replaceOrderedChildren(input.techStack);
  return data;
}

export function fromPrismaProject(row: ProjectWithRelations) {
  const {
    tags: tagRows,
    techStack: techRows,
    results,
    images,
    client,
    coverImageUrl,
    liveUrl,
    challenge,
    solution,
    completedAt,
    ...rest
  } = row;
  return {
    ...rest,
    client: client ?? "",
    challenge: challenge ?? "",
    solution: solution ?? "",
    coverImageUrl: coverImageUrl ?? "",
    liveUrl: liveUrl ?? "",
    completedAt: completedAt?.toISOString().split("T")[0] ?? "",
    tags: orderedTagValues(tagRows),
    techStack: orderedTagValues(techRows),
    results: parseStringArray(results),
    images: parseStringArray(images),
  };
}
