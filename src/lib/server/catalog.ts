import prisma from "@/lib/db";
import type { CatalogData } from "@/types/shop";
import { getSettings } from "./settings";
import { toCategory, toCollection, toProduct } from "./mappers";

/** Everything the public storefront needs to render: live products only. */
export async function getCatalogData(): Promise<CatalogData> {
  const [collections, categories, products, settings] = await Promise.all([
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: [{ collectionId: "asc" }, { sortOrder: "asc" }] }),
    prisma.product.findMany({ where: { status: "ACTIVE" }, include: { images: true }, orderBy: { createdAt: "desc" } }),
    getSettings(),
  ]);
  return { collections: collections.map(toCollection), categories: categories.map(toCategory), products: products.map(toProduct), settings };
}
