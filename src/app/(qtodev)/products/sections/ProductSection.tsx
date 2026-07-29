import type { Product } from "@/types/product";
import { ProductSectionClient } from "./ProductSectionClient";

export function ProductSection({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  return <ProductSectionClient product={product} index={index} />;
}
