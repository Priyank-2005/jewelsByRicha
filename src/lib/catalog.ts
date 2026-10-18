import type { Category } from "@/data/catalog";
import type { Product } from "@/data/products";

/** Cover photo for a category tile = the first photo of its first live product. */
export function categoryCover(cat: Category, products: Product[]) {
  const p = products.find((x) => x.categoryId === cat.id && x.status === "ACTIVE" && x.images[0]);
  return p?.images[0];
}
