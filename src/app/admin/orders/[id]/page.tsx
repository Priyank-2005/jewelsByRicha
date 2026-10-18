"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { Field, PageHeader } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderStatus } from "@/data/admin";
import { formatDate, formatPrice } from "@/lib/utils";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { orders, setOrderStatus, updateOrder } = useCatalog();
  const { showToast } = useToast();
  const o = orders.find((x) => x.id === id);
  const [tracking, setTracking] = useState(o?.trackingNumber ?? "");

  if (!o) return <p className="text-muted">Order not found. <Link href="/admin/orders" className="underline">Back to orders</Link></p>;

  return (
    <div>
      <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Orders</Link>
      <PageHeader title={o.id} subtitle={`Placed ${formatDate(o.createdAt)}`} actions={<StatusBadge status={o.status} />} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="a-card overflow-hidden">
            <div className="border-b border-line p-5"><h2 className="font-serif text-xl font-semibold">Items</h2></div>
            <table className="w-full">
              <thead className="bg-cream/60"><tr><th className="a-th">Product</th><th className="a-th">Price</th><th className="a-th">Qty</th><th className="a-th text-right">Total</th></tr></thead>
              <tbody className="divide-y divide-line">
                {o.items.map((i) => (
                  <tr key={i.productId}><td className="a-td font-medium">{i.name}</td><td className="a-td">{formatPrice(i.price)}</td><td className="a-td">{i.quantity}</td><td className="a-td text-right">{formatPrice(i.price * i.quantity)}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 border-t border-line bg-cream/40 p-5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
              {o.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount {o.couponCode && `(${o.couponCode})`}</span><span>− {formatPrice(o.discount)}</span></div>}
              <div className="flex justify-between"><span>Shipping &amp; fees</span><span>{o.shipping ? formatPrice(o.shipping) : "Free"}</span></div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><span>Total</span><span>{formatPrice(o.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="a-card space-y-4 p-5">
            <h2 className="font-serif text-xl font-semibold">Fulfilment</h2>
            <Field label="Order status">
              <select className="a-input" value={o.status} onChange={(e) => { setOrderStatus(o.id, e.target.value as OrderStatus); showToast(`Order marked ${e.target.value.toLowerCase()}`); }}>
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.toLowerCase()}</option>)}
              </select>
            </Field>
            <Field label="Tracking number">
              <div className="flex gap-2">
                <input className="a-input" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="e.g. TRK1234567" />
                <button className="a-btn-ghost" onClick={() => { updateOrder(o.id, { trackingNumber: tracking || undefined }); showToast("Tracking saved"); }}>Save</button>
              </div>
            </Field>
          </div>

          <div className="a-card space-y-3 p-5 text-sm">
            <h2 className="font-serif text-xl font-semibold">Customer</h2>
            <div><div className="font-medium">{o.customerName}</div><div className="text-muted">{o.email}</div><div className="text-muted">{o.phone}</div></div>
            <div><div className="text-xs font-medium uppercase tracking-wider text-muted">Ship to</div>{o.address}</div>
            <div><div className="text-xs font-medium uppercase tracking-wider text-muted">Payment</div>{o.paymentMethod} · <StatusBadge status={o.paymentStatus} /></div>
            {o.customerId !== "guest" && <Link href={`/admin/customers/${o.customerId}`} className="inline-block text-gold-deep hover:underline">View customer →</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
