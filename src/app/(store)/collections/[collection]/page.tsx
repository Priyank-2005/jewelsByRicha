import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ShopView } from "@/components/shop/ShopView";

type Props = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  const c = await prisma.collection.findUnique({ where: { slug: collection } });
  return c ? { title: c.name, description: c.description ?? undefined } : { title: "Collection not found" };
}

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  if (!(await prisma.collection.findUnique({ where: { slug: collection }, select: { id: true } }))) notFound();
  return <ShopView collectionSlug={collection} />;
}
