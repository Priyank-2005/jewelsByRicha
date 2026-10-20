"use client";

import Link from "next/link";
import { useMyOrders } from "@/lib/client/hooks";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { orders, error } = useMyOrders();
  return (
    <div>
      <h2 className="mb-6 font-serif text-3xl">Order history</h2>
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {!orders && !error && <p className="text-muted">Loading your orders…</p>}
      {orders && orders.length === 0 && (
        <div className="border border-dashed border-line p-12 text-center">
          <p className="font-serif text-2xl">No orders yet</p>
          <p className="mt-1 text-sm text-muted">Your orders will appear here.</p>
          <Link href="/shop" className="btn-dark mt-5">Start shopping</Link>
        </div>
      )}
      {orders && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white p-5 transition hover:border-gold">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-xs text-muted">{formatDate(o.createdAt)} · {o.items.length} item(s)</div>
                </div>
                <StatusBadge status={o.status} />
                <div className="font-medium">{formatPrice(o.total)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
