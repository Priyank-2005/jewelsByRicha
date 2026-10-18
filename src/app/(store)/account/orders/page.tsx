"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useCatalog();
  const mine = orders.filter((o) => o.email.toLowerCase() === user?.email.toLowerCase());
  return (
    <div>
      <h2 className="mb-6 font-serif text-3xl">Order history</h2>
      {mine.length === 0 ? (
        <div className="border border-dashed border-line p-12 text-center">
          <p className="font-serif text-2xl">No orders yet</p>
          <p className="mt-1 text-sm text-muted">Orders you place with {user?.email} will appear here.</p>
          <Link href="/shop" className="btn-dark mt-5">Start shopping</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {mine.map((o) => (
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
