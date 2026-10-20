"use client";

import Link from "next/link";
import { Heart, Plus, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types/shop";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCatalog } from "@/context/CatalogContext";
import { cn, discountPct, formatPrice } from "@/lib/utils";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product, dark = false }: { product: Product; dark?: boolean }) {
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { getCategory } = useCatalog();
  const liked = has(product.id);
  const off = discountPct(product.price, product.originalPrice);
  const soldOut = product.stock <= 0;
  const cat = getCategory(product.categoryId);

  return (
    <div className="group relative">
      <div className={cn("relative aspect-[4/5] overflow-hidden transition-all duration-500", dark ? "bg-[#251a11] ring-1 ring-[#c49e49]/30 group-hover:ring-[#d4ae58]/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]" : "bg-blush-soft/80")}>
        <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
            <ProductVisual product={product} />
          </div>
          {product.images[1] && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <ProductVisual product={product} index={1} />
            </div>
          )}
        </Link>

        {(product.badge || off > 0) && (
          <span className={cn("pointer-events-none absolute left-3 top-3 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm md:left-3.5 md:top-3.5 md:text-[9.5px]", dark ? "bg-gradient-to-r from-[#d4ae58] to-[#b08930] text-[#141110] font-bold shadow-sm" : "bg-ivory/90 text-ink/90")}>
            {off > 0 && !product.badge ? `${off}% off` : product.badge}
          </span>
        )}

        <button
          onClick={() => toggle(product.id, product.name)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className={cn("absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 md:right-3.5 md:top-3.5 md:h-9 md:w-9", dark ? "bg-[#1f140d]/90 text-ivory/80 hover:bg-[#342315] hover:text-white" : "bg-ivory/80 text-ink/70 hover:bg-ivory hover:text-ink")}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-gold text-gold")} />
        </button>

        {soldOut ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-ink/80 py-2.5 text-center text-[9.5px] font-semibold uppercase tracking-[0.25em] text-ivory">Sold out</div>
        ) : (
          <>
            {/* phones: always-visible round button */}
            <button
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to bag`}
              className={cn("absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-lift active:scale-95 md:hidden", dark ? "bg-[#d4ae58] text-[#141110]" : "bg-ink text-ivory")}
            >
              <Plus className="h-4 w-4" />
            </button>
            {/* desktop: slide-up bar on hover */}
            <button
              onClick={() => addToCart(product)}
              className={cn("absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center gap-2 py-3.5 text-[10px] font-semibold uppercase tracking-[0.24em] backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 md:flex", dark ? "bg-gradient-to-r from-[#d4ae58] to-[#b08930] text-[#141110] font-bold hover:brightness-110 shadow-glow" : "bg-ink/90 text-ivory hover:bg-gold-deep")}
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add to bag
            </button>
          </>
        )}
      </div>

      <div className="px-0.5 pt-4 text-center">
        <p className={cn("text-[9px] uppercase tracking-[0.28em]", dark ? "text-[#e8cca0]/70" : "text-muted/70")}>{cat?.name}</p>
        <Link href={`/product/${product.slug}`} className={cn("mt-1.5 block font-serif text-[1.05rem] font-light leading-tight transition-colors duration-300 md:text-[1.2rem]", dark ? "text-ivory hover:text-[#d4ae58]" : "text-ink hover:text-gold-deep")}>
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-center gap-2.5 text-sm">
          <span className={cn("font-medium tracking-wide", dark ? "text-ivory" : "text-ink")}>{formatPrice(product.price)}</span>
          {product.originalPrice && <span className={cn("text-[11px] line-through", dark ? "text-[#e8cca0]/50" : "text-muted/60")}>{formatPrice(product.originalPrice)}</span>}
        </div>
        <div className={cn("mt-1.5 flex items-center justify-center gap-1 text-[11px]", dark ? "text-ivory/70" : "text-muted")}>
          <Star className="h-3 w-3 fill-gold text-gold" /> {product.rating} <span className="opacity-50">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, dark = false }: { products: Product[]; dark?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 md:gap-x-7 md:gap-y-14 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} dark={dark} />
      ))}
    </div>
  );
}
