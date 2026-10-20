import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { ProductClient } from "@/components/product/ProductClient";

type Props = { params: Promise<{ slug: string }> };

async function find(slug: string) {
  return prisma.product.findFirst({ where: { slug, status: "ACTIVE" }, include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await find(slug);
  if (!p) return { title: "Product not found" };
  const description = p.shortDescription || p.description.slice(0, 160);
  const image = p.images[0]?.url;
  return {
    title: p.name,
    description,
    openGraph: { title: p.name, description, images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!(await find(slug))) notFound();
  return <ProductClient slug={slug} />;
}
