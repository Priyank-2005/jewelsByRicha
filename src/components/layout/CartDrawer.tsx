"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BRAND } from "@/config/brand";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

export function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, subtotal, removeFromCart, updateQuantity } = useCart();
  const close = () => setIsDrawerOpen(false);
  const remaining = Math.max(BRAND.freeShippingThreshold - subtotal, 0);

  return (
    <div className={`fixed inset-0 z-[60] ${isDrawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!isDrawerOpen}>
      <div onClick={close} className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`} />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-lift transition-transform duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line/70 px-6 py-5">
          <h2 className="font-serif text-2xl font-light">Your bag</h2>
          <button onClick={close} aria-label="Close bag">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-gold-mid" strokeWidth={1.2} />
            <p className="font-serif text-xl font-light">Your bag is empty</p>
            <Link href="/shop" onClick={close} className="btn-dark">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-blush-border/50 bg-blush-soft px-6 py-3.5 text-xs text-ink-soft">
              {remaining > 0 ? (
                <>Add <b>{formatPrice(remaining)}</b> more for free shipping</>
              ) : (
                <>You&apos;ve unlocked <b>free shipping</b> ✦</>
              )}
              <div className="mt-2.5 h-1 bg-blush-border/60">
                <div className="h-full bg-gold transition-all duration-500" style={{ width: `${Math.min((subtotal / BRAND.freeShippingThreshold) * 100, 100)}%` }} />
              </div>
            </div>
            <ul className="flex-1 divide-y divide-line/60 overflow-y-auto px-6">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link href={`/product/${product.slug}`} onClick={close} className="h-24 w-20 shrink-0 overflow-hidden bg-blush-soft">
                    <ProductVisual product={product} />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link href={`/product/${product.slug}`} onClick={close} className="font-serif text-lg leading-tight text-ink hover:text-gold-deep">
                        {product.name}
                      </Link>
                      <button onClick={() => removeFromCart(product.id)} aria-label="Remove" className="text-muted hover:text-ink">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1 text-sm text-muted">{formatPrice(product.price)}</div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QuantitySelector value={quantity} max={product.stock} onChange={(q) => updateQuantity(product.id, q)} />
                      <span className="font-medium">{formatPrice(product.price * quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-blush-border/50 bg-blush-light/30 p-6">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted">Shipping and coupons are calculated at checkout.</p>
              <Link href="/checkout" onClick={close} className="btn-dark w-full">
                Checkout
              </Link>
              <Link href="/cart" onClick={close} className="mt-3 block text-center text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">
                View full bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
