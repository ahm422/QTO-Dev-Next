import type { Prisma } from "@prisma/client";
import type {
  ProductFeatureInput,
  ProductInput,
} from "@/lib/validators/admin/product";

const productInclude = {
  features: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProductInclude;

export const productWithFeaturesInclude = productInclude;

export type ProductWithFeatures = Prisma.ProductGetPayload<{
  include: typeof productWithFeaturesInclude;
}>;

type ProductScalars = Omit<ProductInput, "features">;

function toProductScalars(input: ProductInput): ProductScalars {
  const scalars = { ...input };
  delete (scalars as Partial<ProductInput>).features;
  return scalars as ProductScalars;
}

function emptyToNull(value: string | undefined | null): string | null {
  return value ? value : null;
}

function createProductFeatures(features: ProductFeatureInput[]) {
  return {
    create: features.map((feature, sortOrder) => ({
      name: feature.name,
      description: feature.description,
      icon: emptyToNull(feature.icon),
      sortOrder,
    })),
  };
}

function replaceProductFeatures(features: ProductFeatureInput[]) {
  return {
    deleteMany: {},
    create: features.map((feature, sortOrder) => ({
      name: feature.name,
      description: feature.description,
      icon: emptyToNull(feature.icon),
      sortOrder,
    })),
  };
}

export function toPrismaProductCreateData(
  input: ProductInput
): Prisma.ProductCreateInput {
  const scalars = toProductScalars(input);
  return {
    title: scalars.title,
    slug: scalars.slug,
    subtitle: emptyToNull(scalars.subtitle),
    shortDescription: emptyToNull(scalars.shortDescription),
    description: scalars.description,
    statusLabel: emptyToNull(scalars.statusLabel),
    titleHighlight: emptyToNull(scalars.titleHighlight),
    imageUrl: emptyToNull(scalars.imageUrl),
    imageAlt: emptyToNull(scalars.imageAlt),
    order: scalars.order,
    isPublished: scalars.isPublished,
    features: createProductFeatures(input.features),
  };
}

export function toPrismaProductUpdateData(
  input: ProductInput
): Prisma.ProductUpdateInput {
  const scalars = toProductScalars(input);
  return {
    title: scalars.title,
    slug: scalars.slug,
    subtitle: emptyToNull(scalars.subtitle),
    shortDescription: emptyToNull(scalars.shortDescription),
    description: scalars.description,
    statusLabel: emptyToNull(scalars.statusLabel),
    titleHighlight: emptyToNull(scalars.titleHighlight),
    imageUrl: emptyToNull(scalars.imageUrl),
    imageAlt: emptyToNull(scalars.imageAlt),
    order: scalars.order,
    isPublished: scalars.isPublished,
    features: replaceProductFeatures(input.features),
  };
}

export function toPrismaProductPartialUpdateData(
  input: Partial<ProductInput>
): Prisma.ProductUpdateInput {
  const data: Prisma.ProductUpdateInput = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.subtitle !== undefined) data.subtitle = emptyToNull(input.subtitle);
  if (input.shortDescription !== undefined) {
    data.shortDescription = emptyToNull(input.shortDescription);
  }
  if (input.description !== undefined) data.description = input.description;
  if (input.statusLabel !== undefined) {
    data.statusLabel = emptyToNull(input.statusLabel);
  }
  if (input.titleHighlight !== undefined) {
    data.titleHighlight = emptyToNull(input.titleHighlight);
  }
  if (input.imageUrl !== undefined) data.imageUrl = emptyToNull(input.imageUrl);
  if (input.imageAlt !== undefined) data.imageAlt = emptyToNull(input.imageAlt);
  if (input.order !== undefined) data.order = input.order;
  if (input.isPublished !== undefined) data.isPublished = input.isPublished;
  if (input.features !== undefined) {
    data.features = replaceProductFeatures(input.features);
  }

  return data;
}

/** Map Prisma row (with included features) to API/form shape. */
export function fromPrismaProduct(row: ProductWithFeatures) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle ?? "",
    shortDescription: row.shortDescription ?? "",
    description: row.description,
    statusLabel: row.statusLabel ?? "",
    titleHighlight: row.titleHighlight ?? "",
    imageUrl: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? "",
    order: row.order,
    isPublished: row.isPublished,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    features: row.features.map((f) => ({
      name: f.name,
      description: f.description,
      icon: f.icon ?? "",
    })),
  };
}
