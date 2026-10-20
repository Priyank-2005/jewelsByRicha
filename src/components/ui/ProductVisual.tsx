"use client";

import type { Product } from "@/types/shop";
import { useCatalog } from "@/context/CatalogContext";
import { ProductArt } from "./ProductArt";

/** Shows the product photo, or the illustrated placeholder when none has been uploaded yet. */
export function ProductVisual({ product, index = 0 }: { product: Product; index?: number }) {
  const { getCategory } = useCatalog();
  const src = product.images[index];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={product.name} className="h-full w-full object-cover" />;
  }
  const kind = getCategory(product.categoryId)?.kind ?? "ring";
  // alternate tone for the 2nd+ gallery slides so thumbnails look distinct
  const tone = index === 0 ? product.tone : index % 2 ? "pearl" : "rose";
  return <ProductArt kind={kind} tone={tone} uid={`${product.id}-${index}`} />;
}
