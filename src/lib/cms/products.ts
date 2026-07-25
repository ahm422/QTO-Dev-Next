import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getCachedReadPrisma } from "@/lib/prisma/cachedRead";
import { productWithFeaturesInclude } from "@/lib/prisma/productData";
import { mapProduct } from "./mappers";

export const findPublishedProducts = cache(
  unstable_cache(
    async () => {
      const items = await (await getCachedReadPrisma()).product.findMany({
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: productWithFeaturesInclude,
      });
      return items.map(mapProduct);
    },
    ["published-products"],
    { revalidate: 3600, tags: ["products"] }
  )
);

export const findProductBySlug = cache(
  unstable_cache(
    async (slug: string) => {
      const item = await (await getCachedReadPrisma()).product.findFirst({
        where: { slug, isPublished: true },
        include: productWithFeaturesInclude,
      });
      return item ? mapProduct(item) : null;
    },
    ["product-by-slug"],
    { revalidate: 3600, tags: ["products"] }
  )
);
