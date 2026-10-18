"use client";

import Link from "next/link";
import { Heart, Plus, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCatalog } from "@/context/CatalogContext";
import { cn, discountPct, formatPrice } from "@/lib/utils";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { getCategory } = useCatalog();
  const liked = has(product.id);
  const off = discountPct(product.price, product.originalPrice);
  const soldOut = product.stock <= 0;
  const cat = getCategory(product.categoryId);

  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
            <ProductVisual product={product} />
          </div>
          {product.images[1] && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <ProductVisual product={product} index={1} />
            </div>
          )}
        </Link>

        {(product.badge || off > 0) && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 bg-ivory/95 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink md:left-3 md:top-3 md:text-[10px]">
            {off > 0 && !product.badge ? `${off}% off` : product.badge}
          </span>
        )}

        <button
          onClick={() => toggle(product.id, product.name)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/90 text-ink backdrop-blur transition hover:bg-ivory md:right-3 md:top-3 md:h-9 md:w-9"
        >
          <Heart className={cn("h-4 w-4", liked && "fill-gold text-gold")} />
        </button>

        {soldOut ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink/80 py-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-ivory">Sold out</div>
        ) : (
          <>
            {/* phones: always-visible round button */}
            <button
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to bag`}
              className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-ivory shadow-lift active:scale-95 md:hidden"
            >
              <Plus className="h-4 w-4" />
            </button>
            {/* desktop: slide-up bar on hover */}
            <button
              onClick={() => addToCart(product)}
              className="absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center gap-2 bg-ink/95 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory transition-transform duration-300 hover:bg-gold-deep group-hover:translate-y-0 md:flex"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add to bag
            </button>
          </>
        )}
      </div>

      <div className="px-0.5 pt-3.5 text-center">
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted">{cat?.name}</p>
        <Link href={`/product/${product.slug}`} className="mt-1 block font-serif text-[1.08rem] leading-tight text-ink transition-colors hover:text-gold-deep md:text-xl">
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center justify-center gap-2 text-sm">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-muted">
          <Star className="h-3 w-3 fill-gold text-gold" /> {product.rating} <span className="opacity-60">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
