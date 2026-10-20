"use client";

import Link from "next/link";
import { Droplets, Gift, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductGrid } from "@/components/ui/ProductCard";
import { CheckoutSteps } from "@/components/ui/CheckoutSteps";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, ready } = useCart();
  const { products, getCategory, settings } = useCatalog();

  if (!ready) return <div className="py-32 text-center text-muted">Loading…</div>;

  const suggestions = products.filter((p) => p.status === "ACTIVE" && p.stock > 0 && p.isBestSeller && !items.some((i) => i.product.id === p.id)).slice(0, 4);

  if (items.length === 0)
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-light bg-cream"><ShoppingBag className="h-8 w-8 text-gold" strokeWidth={1.2} /></span>
          <h1 className="font-serif text-4xl font-light md:text-5xl">Your bag is empty</h1>
          <p className="max-w-sm text-muted">Looks like you haven&apos;t found your sparkle yet. Explore our bestsellers below.</p>
          <Link href="/shop" className="btn-dark mt-2">Continue shopping</Link>
        </div>
        {suggestions.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-center font-serif text-3xl font-light">Bestsellers</h2>
            <ProductGrid products={suggestions} />
          </div>
        )}
      </div>
    );

  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const remaining = Math.max(settings.freeShippingThreshold - subtotal, 0);
  const pct = Math.min((subtotal / settings.freeShippingThreshold) * 100, 100);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:px-8 md:pb-20 md:pt-12">
      <CheckoutSteps current={0} />
      <div className="mb-8 flex items-end justify-between">
        <h1 className="font-serif text-4xl font-light md:text-5xl">Shopping bag</h1>
        <span className="text-sm text-muted">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div>
          {/* free shipping meter */}
          <div className="mb-6 border border-gold-light bg-cream p-4 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold" />
              {remaining > 0 ? <span>Add <b>{formatPrice(remaining)}</b> more for <b>free shipping</b></span> : <span>You&apos;ve unlocked <b>free shipping</b> ✦</span>}
            </div>
            <div className="mt-3 h-1 bg-beige"><div className="h-full bg-gold transition-all duration-500" style={{ width: `${pct}%` }} /></div>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 py-5 md:gap-6 md:py-6">
                <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden bg-cream md:w-32">
                  <ProductVisual product={product} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{getCategory(product.categoryId)?.name}</p>
                  <Link href={`/product/${product.slug}`} className="font-serif text-xl leading-tight md:text-2xl">{product.name}</Link>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span>{formatPrice(product.price)}</span>
                    {product.originalPrice && <span className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</span>}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <QuantitySelector value={quantity} max={product.stock} onChange={(q) => updateQuantity(product.id, q)} />
                    <span className="text-lg font-medium">{formatPrice(product.price * quantity)}</span>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="mt-3 flex items-center gap-1.5 self-start text-xs text-muted hover:text-red-700">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Link href="/shop" className="mt-6 inline-block text-xs font-medium uppercase tracking-[0.2em] text-gold-deep hover:underline">← Continue shopping</Link>
        </div>

        <aside className="h-fit border border-line bg-white p-6 lg:sticky lg:top-28">
          <h2 className="mb-5 font-serif text-2xl">Order summary</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{shipping === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-4 text-base font-medium"><dt>Estimated total</dt><dd className="text-xl">{formatPrice(subtotal + shipping)}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-muted">Coupons and payment method are applied at checkout.</p>
          <Link href="/checkout" className="btn-gold mt-5 w-full">Proceed to checkout</Link>
          <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-5 text-center text-[10.5px] leading-tight text-ink-soft">
            <li className="flex flex-col items-center gap-1.5"><ShieldCheck className="h-5 w-5 text-gold" strokeWidth={1.4} />Secure checkout</li>
            <li className="flex flex-col items-center gap-1.5"><Droplets className="h-5 w-5 text-gold" strokeWidth={1.4} />Waterproof jewellery</li>
            <li className="flex flex-col items-center gap-1.5"><Gift className="h-5 w-5 text-gold" strokeWidth={1.4} />Gift-ready box</li>
          </ul>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-center font-serif text-3xl font-light">Complete the look</h2>
          <ProductGrid products={suggestions} />
        </section>
      )}

      {/* phone sticky checkout */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="leading-tight"><div className="text-[11px] text-muted">Total</div><div className="text-lg font-medium">{formatPrice(subtotal + shipping)}</div></div>
        <Link href="/checkout" className="btn-gold flex-1 !py-3.5">Checkout</Link>
      </div>
    </div>
  );
}
