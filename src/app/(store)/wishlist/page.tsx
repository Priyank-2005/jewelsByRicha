"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCatalog } from "@/context/CatalogContext";
import { ProductGrid } from "@/components/ui/ProductCard";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { products } = useCatalog();
  const list = products.filter((p) => ids.includes(p.id));
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <h1 className="mb-10 text-center font-serif text-5xl">Wishlist</h1>
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Heart className="h-12 w-12 text-gold-mid" strokeWidth={1.1} />
          <p className="font-serif text-2xl">Nothing saved yet</p>
          <p className="text-muted">Tap the heart on any piece to save it here.</p>
          <Link href="/shop" className="btn-dark mt-2">Browse jewellery</Link>
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}
