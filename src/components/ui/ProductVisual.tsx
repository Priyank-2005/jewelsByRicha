"use client";

import type { Product } from "@/types/shop";
import { useCatalogOptional } from "@/context/CatalogContext";
import { ProductArt } from "./ProductArt";

/** Shows the product photo, or the illustrated placeholder when none has been uploaded yet. Works in the storefront and the admin. */
export function ProductVisual({ product, index = 0 }: { product: Product; index?: number }) {
  const catalog = useCatalogOptional();
  const src = product.images[index];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />;
  }
  const kind = catalog?.getCategory(product.categoryId)?.kind ?? "ring";
  // alternate tone for the 2nd+ gallery slides so thumbnails look distinct
  const tone = index === 0 ? product.tone : index % 2 ? "pearl" : "rose";
  return <ProductArt kind={kind} tone={tone} uid={`${product.id}-${index}`} />;
}
