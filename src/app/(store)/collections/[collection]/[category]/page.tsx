import { ShopView } from "@/components/shop/ShopView";

export default async function CategoryPage({ params }: { params: Promise<{ collection: string; category: string }> }) {
  const { collection, category } = await params;
  return <ShopView collectionSlug={collection} categorySlug={category} />;
}
