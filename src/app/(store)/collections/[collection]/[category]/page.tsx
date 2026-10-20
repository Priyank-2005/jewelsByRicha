import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ShopView } from "@/components/shop/ShopView";

type Props = { params: Promise<{ collection: string; category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = await prisma.category.findUnique({ where: { slug: category } });
  return c ? { title: c.name, description: c.description } : { title: "Category not found" };
}

export default async function CategoryPage({ params }: Props) {
  const { collection, category } = await params;
  const cat = await prisma.category.findUnique({ where: { slug: category }, include: { collection: true } });
  if (!cat || cat.collection.slug !== collection || !cat.active) notFound();
  return <ShopView collectionSlug={collection} categorySlug={category} />;
}
