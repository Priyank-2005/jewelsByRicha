import prisma from "@/lib/db";
import type { CatalogData } from "@/types/shop";
import { getSettings } from "./settings";
import { toCategory, toCollection, toProduct } from "./mappers";

/** Upper bound for the storefront catalogue payload (listing cards only need a lean subset of each product). */
const MAX_LISTED_PRODUCTS = 1000;

/**
 * Everything the public storefront needs to render: live products only, in a LEAN form (long text fields are left out;
 * the product page loads the full record itself). Keeps the HTML small as the catalogue grows.
 */
export async function getCatalogData(): Promise<CatalogData> {
  const [collections, categories, products, settings] = await Promise.all([
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: [{ collectionId: "asc" }, { sortOrder: "asc" }] }),
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: { images: { orderBy: { sortOrder: "asc" }, take: 3 } }, orderBy: { createdAt: "desc" }, take: MAX_LISTED_PRODUCTS }),
    getSettings(),
  ]);
  return {
    collections: collections.map(toCollection),
    categories: categories.map(toCategory),
    products: products.map((p) => ({ ...toProduct(p), description: "", material: "", careInstructions: "", features: p.features.slice(0, 4) })),
    settings,
  };
}
