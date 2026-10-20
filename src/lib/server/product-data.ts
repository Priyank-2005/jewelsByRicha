import type { z } from "zod";
import type { productSchema } from "./admin-schemas";

type ProductInput = z.infer<typeof productSchema>;

/** Scalar columns for create/update. The badge is derived from the flags so the storefront stays consistent. */
export function productData(i: ProductInput) {
  const original = i.originalPrice && i.originalPrice > i.price ? i.originalPrice : null;
  const badge = i.isBestSeller ? "BEST SELLER" : i.isNew ? "NEW" : original ? "SALE" : null;
  return {
    name: i.name,
    categoryId: i.categoryId,
    price: i.price,
    originalPrice: original,
    shortDescription: i.shortDescription,
    description: i.description,
    material: i.material,
    careInstructions: i.careInstructions,
    features: i.features,
    stock: i.stock,
    status: i.status,
    badge,
    isFeatured: i.isFeatured,
    isBestSeller: i.isBestSeller,
    isNew: i.isNew,
  };
}
