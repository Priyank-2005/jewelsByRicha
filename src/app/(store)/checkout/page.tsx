"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, ChevronDown, CreditCard, Lock, Smartphone, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { useAuth } from "@/context/AuthContext";
import { computeTotals, validateCoupon } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { CheckoutSteps } from "@/components/ui/CheckoutSteps";
import type { PaymentMethod } from "@/data/admin";
import { BRAND } from "@/config/brand";

const METHODS: { id: PaymentMethod; label: string; hint: string; icon: typeof Smartphone }[] = [
  { id: "UPI", label: "UPI", hint: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "CARD", label: "Credit / Debit card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "COD", label: "Cash on delivery", hint: `₹${BRAND.codFee} handling fee`, icon: Banknote },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, ready } = useCart();
  const { coupons, addOrder, nextOrderId } = useCatalog();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const coupon = coupons.find((c) => c.code === applied);
  const check = applied ? validateCoupon(coupon, subtotal, method) : { ok: false, discount: 0 };
  const totals = computeTotals(subtotal, check.ok ? check.discount : 0, method);

  const apply = () => {
    const c = coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase());
    const r = validateCoupon(c, subtotal, method);
    setCouponMsg({ ok: r.ok, text: r.ok ? `${c!.code} applied — you save ${formatPrice(r.discount)}` : r.message! });
    setApplied(r.ok ? c!.code : null);
  };

  if (!ready) return <div className="py-32 text-center text-muted">Loading…</div>;

  if (items.length === 0)
    return (
      <div className="py-32 text-center">
        <h1 className="font-serif text-4xl">Nothing to checkout</h1>
        <Link href="/shop" className="btn-dark mt-6">Shop jewellery</Link>
      </div>
    );

  const place = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const id = nextOrderId();
    addOrder({
      id,
      customerId: "guest",
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      items: items.map((i) => ({ productId: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping + totals.codFee,
      total: totals.total,
      couponCode: check.ok ? applied! : undefined,
      paymentMethod: method,
      paymentStatus: method === "COD" ? "PENDING" : "PAID",
      status: "PENDING",
      address: `${form.address}, ${form.city}, ${form.state} – ${form.pincode}`,
      createdAt: new Date().toISOString(),
    });
    setTimeout(() => {
      clearCart();
      router.push(`/order-success?id=${id}`);
    }, 600);
  };

  const payLabel = busy ? "Placing order…" : method === "COD" ? "Place order" : `Pay ${formatPrice(totals.total)}`;

  const summary = (
    <>
      <ul className="mb-5 space-y-4">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-3 text-sm">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
              <ProductVisual product={product} />
              <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] text-ivory">{quantity}</span>
            </div>
            <span className="flex-1 font-serif text-lg leading-tight">{product.name}</span>
            <span className="font-medium">{formatPrice(product.price * quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mb-2 flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className="input !pl-9 uppercase" />
        </div>
        <button type="button" onClick={apply} className="btn-outline !px-5">Apply</button>
      </div>
      {couponMsg && <p className={cn("mb-3 text-xs", couponMsg.ok ? "text-emerald-700" : "text-red-700")}>{couponMsg.text}</p>}
      <p className="mb-4 text-[11px] text-muted">Try <b>WELCOME10</b> for 10% off.</p>

      <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="flex justify-between text-emerald-700"><dt>Discount ({applied})</dt><dd>− {formatPrice(totals.discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
        {totals.codFee > 0 && <div className="flex justify-between"><dt className="text-muted">COD fee</dt><dd>{formatPrice(totals.codFee)}</dd></div>}
        <div className="flex justify-between border-t border-line pt-3 text-lg font-medium"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      </dl>
    </>
  );

  return (
    <form onSubmit={place} className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 md:px-8 md:pb-20 md:pt-12">
      <CheckoutSteps current={1} />

      {/* phone: collapsible summary */}
      <div className="mb-6 border border-line bg-white lg:hidden">
        <button type="button" onClick={() => setShowSummary((v) => !v)} className="flex w-full items-center justify-between px-4 py-3.5 text-sm">
          <span className="flex items-center gap-2 text-gold-deep">{showSummary ? "Hide" : "Show"} order summary <ChevronDown className={cn("h-4 w-4 transition-transform", showSummary && "rotate-180")} /></span>
          <span className="text-base font-medium">{formatPrice(totals.total)}</span>
        </button>
        {showSummary && <div className="border-t border-line p-4">{summary}</div>}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-14">
        <div className="space-y-6">
          <section className="border border-line bg-white p-5 md:p-8">
            <h2 className="mb-5 flex items-center gap-3 font-serif text-2xl"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-sans text-xs text-ivory">1</span> Contact &amp; delivery</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1"><Field label="Full name" value={form.name} onChange={set("name")} autoComplete="name" /></div>
              <div className="col-span-2 sm:col-span-1"><Field label="Phone" type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" /></div>
              <div className="col-span-2"><Field label="Email" type="email" value={form.email} onChange={set("email")} autoComplete="email" /></div>
              <div className="col-span-2"><Field label="Address" value={form.address} onChange={set("address")} autoComplete="street-address" /></div>
              <Field label="City" value={form.city} onChange={set("city")} />
              <Field label="State" value={form.state} onChange={set("state")} />
              <div className="col-span-2 sm:col-span-1"><Field label="PIN code" inputMode="numeric" value={form.pincode} onChange={set("pincode")} pattern="[0-9]{6}" /></div>
            </div>
          </section>

          <section className="border border-line bg-white p-5 md:p-8">
            <h2 className="mb-5 flex items-center gap-3 font-serif text-2xl"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-sans text-xs text-ivory">2</span> Payment</h2>
            <div className="space-y-3">
              {METHODS.map((m) => (
                <label key={m.id} className={cn("flex cursor-pointer items-center gap-4 border p-4 transition-colors", method === m.id ? "border-gold bg-cream" : "border-line hover:border-gold-light")}>
                  <input type="radio" name="pay" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-[#b8913a]" />
                  <m.icon className="h-5 w-5 text-gold" strokeWidth={1.4} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-xs text-muted">{m.hint}</div>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Lock className="h-3.5 w-3.5" /> Demo build — no real payment is taken. Razorpay is connected with the backend.</p>
          </section>
        </div>

        <aside className="hidden h-fit border border-line bg-white p-6 lg:sticky lg:top-28 lg:block">
          <h2 className="mb-5 font-serif text-2xl">Your order</h2>
          {summary}
          <button disabled={busy} className="btn-gold mt-6 w-full">{payLabel}</button>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur lg:hidden">
        <button disabled={busy} className="btn-gold w-full !py-3.5">{payLabel}</button>
      </div>
    </form>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input required className="input" {...rest} />
    </label>
  );
}
