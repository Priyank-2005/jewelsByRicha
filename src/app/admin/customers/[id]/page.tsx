"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft, IndianRupee, Mail, MapPin, Phone, ShoppingCart } from "lucide-react";
import { api } from "@/lib/client/api";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Customer, Order } from "@/types/shop";

export default function AdminCustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [d, setD] = useState<{ customer: Customer; orders: Order[]; orderCount: number; spent: number } | null | undefined>(undefined);

  useEffect(() => {
    api<{ customer: Customer; orders: Order[]; orderCount: number; spent: number }>(`/api/admin/customers/${id}`)
      .then(setD)
      .catch(() => setD(null));
  }, [id]);

  if (d === undefined) return <p className="text-muted">Loading…</p>;
  if (d === null) return <p className="text-muted">Customer not found. <Link href="/admin/customers" className="underline">Back to customers</Link></p>;
  const { customer: c, orders, orderCount, spent } = d;

  return (
    <div>
      <Link href="/admin/customers" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Customers</Link>
      <PageHeader title={c.name} subtitle={`Customer since ${formatDate(c.joinedDate)}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="a-card space-y-3 p-5 text-sm">
          <h2 className="font-serif text-xl font-semibold">Contact</h2>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {c.email}</div>
          {c.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {c.phone}</div>}
          {(c.city || c.state) && <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {[c.city, c.state].filter(Boolean).join(", ")}</div>}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <StatCard label="Orders" value={orderCount} icon={ShoppingCart} />
          <StatCard label="Total spent" value={formatPrice(spent)} icon={IndianRupee} />
        </div>
      </div>

      <div className="a-card mt-6 overflow-hidden">
        <div className="border-b border-line p-5"><h2 className="font-serif text-xl font-semibold">Order history</h2></div>
        {orders.length === 0 ? <p className="p-8 text-center text-sm text-muted">No orders yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="bg-cream/60"><tr><th className="a-th">Order</th><th className="a-th">Date</th><th className="a-th">Status</th><th className="a-th text-right">Total</th></tr></thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40">
                    <td className="a-td font-medium"><Link href={`/admin/orders/${o.id}`} className="hover:text-gold-deep">{o.id}</Link></td>
                    <td className="a-td text-muted">{formatDate(o.createdAt)}</td>
                    <td className="a-td"><StatusBadge status={o.status} /></td>
                    <td className="a-td text-right font-medium">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
