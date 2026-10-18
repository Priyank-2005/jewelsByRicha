"use client";

import Link from "next/link";
import { use } from "react";
import { Check } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders } = useCatalog();
  const o = orders.find((x) => x.id === id);
  if (!o)
    return (
      <p className="text-muted">
        Order not found. <Link href="/account/orders" className="underline">Back to orders</Link>
      </p>
    );
  const idx = STEPS.indexOf(o.status as (typeof STEPS)[number]);

  return (
    <div>
      <Link href="/account/orders" className="text-xs uppercase tracking-[0.2em] text-muted hover:text-ink">← All orders</Link>
      <div className="mt-3 flex items-center gap-3">
        <h2 className="font-serif text-3xl">{o.id}</h2>
        <StatusBadge status={o.status} />
      </div>
      <p className="text-sm text-muted">Placed on {formatDate(o.createdAt)}</p>

      {o.status !== "CANCELLED" && (
        <ol className="my-8 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="text-center">
              <div className={cn("mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-xs", i <= idx ? "border-gold bg-gold text-ink" : "border-line text-muted")}>
                {i <= idx ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="mt-1 text-[11px] capitalize text-muted">{s.toLowerCase()}</div>
            </li>
          ))}
        </ol>
      )}
      {o.trackingNumber && <p className="mb-6 text-sm">Tracking number: <b>{o.trackingNumber}</b></p>}

      <div className="border border-line bg-white">
        {o.items.map((i) => (
          <div key={i.productId} className="flex justify-between border-b border-line p-4 text-sm last:border-0">
            <span>{i.name} × {i.quantity}</span>
            <span>{formatPrice(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="space-y-1 bg-cream p-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
          {o.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount {o.couponCode && `(${o.couponCode})`}</span><span>− {formatPrice(o.discount)}</span></div>}
          <div className="flex justify-between"><span>Shipping &amp; fees</span><span>{o.shipping ? formatPrice(o.shipping) : "Free"}</span></div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-medium"><span>Total</span><span>{formatPrice(o.total)}</span></div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
        <div><div className="label">Delivery address</div>{o.customerName}<br />{o.address}</div>
        <div><div className="label">Payment</div>{o.paymentMethod} · <StatusBadge status={o.paymentStatus} /></div>
      </div>
    </div>
  );
}
