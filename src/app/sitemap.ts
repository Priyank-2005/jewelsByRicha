import type { MetadataRoute } from "next";
import prisma from "@/lib/db";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, categories, products] = await Promise.all([
    prisma.collection.findMany({ select: { slug: true } }),
    prisma.category.findMany({ where: { active: true }, select: { slug: true, collection: { select: { slug: true } } } }),
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
  ]);
  const staticPages = ["", "/shop", "/categories", "/collections", "/about", "/care", "/faq", "/contact", "/shipping-returns", "/privacy-policy", "/terms"].map((p) => ({ url: `${SITE}${p}` }));
  return [
    ...staticPages,
    ...collections.map((c) => ({ url: `${SITE}/collections/${c.slug}` })),
    ...categories.map((c) => ({ url: `${SITE}/collections/${c.collection.slug}/${c.slug}` })),
    ...products.map((p) => ({ url: `${SITE}/product/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
