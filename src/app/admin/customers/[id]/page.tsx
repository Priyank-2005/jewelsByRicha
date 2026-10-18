"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IndianRupee, ShoppingCart } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminCustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { customers, orders } = useCatalog();
  const c = customers.find((x) => x.id === id);
  if (!c) return <p className="text-muted">Customer not found. <Link href="/admin/customers" className="underline">Back to customers</Link></p>;

  const mine = orders.filter((o) => o.customerId === c.id);
  const spent = mine.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <Link href="/admin/customers" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> Customers</Link>
      <PageHeader title={c.name} subtitle={`Customer since ${formatDate(c.joinedDate)}`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="a-card space-y-3 p-5 text-sm">
          <h2 className="font-serif text-xl font-semibold">Contact</h2>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {c.email}</div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {c.phone}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> {c.city}, {c.state}</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <StatCard label="Orders" value={mine.length} icon={ShoppingCart} />
          <StatCard label="Total spent" value={formatPrice(spent)} icon={IndianRupee} />
        </div>
      </div>

      <div className="a-card mt-6 overflow-hidden">
        <div className="border-b border-line p-5"><h2 className="font-serif text-xl font-semibold">Order history</h2></div>
        {mine.length === 0 ? <p className="p-8 text-center text-sm text-muted">No orders yet.</p> : (
          <table className="w-full">
            <thead className="bg-cream/60"><tr><th className="a-th">Order</th><th className="a-th">Date</th><th className="a-th">Status</th><th className="a-th text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-line">
              {mine.map((o) => (
                <tr key={o.id} className="hover:bg-cream/40">
                  <td className="a-td font-medium"><Link href={`/admin/orders/${o.id}`} className="hover:text-gold-deep">{o.id}</Link></td>
                  <td className="a-td text-muted">{formatDate(o.createdAt)}</td>
                  <td className="a-td"><StatusBadge status={o.status} /></td>
                  <td className="a-td text-right font-medium">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
