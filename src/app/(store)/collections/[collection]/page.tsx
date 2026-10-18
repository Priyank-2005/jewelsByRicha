import { ShopView } from "@/components/shop/ShopView";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  return <ShopView collectionSlug={collection} />;
}
