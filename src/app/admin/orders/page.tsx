"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { EmptyRow, PageHeader } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const TABS = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default function AdminOrders() {
  const { orders } = useCatalog();
  const [tab, setTab] = useState<(typeof TABS)[number]>("ALL");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      orders.filter(
        (o) =>
          (tab === "ALL" || o.status === tab) &&
          (!q || o.id.toLowerCase().includes(q.toLowerCase()) || o.customerName.toLowerCase().includes(q.toLowerCase()) || o.email.toLowerCase().includes(q.toLowerCase())),
      ),
    [orders, tab, q],
  );

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${orders.length} orders in total`} />
      <div className="a-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div className="hide-scrollbar flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors", tab === t ? "bg-ink text-ivory" : "text-muted hover:bg-cream")}>
                {t.toLowerCase()} <span className="opacity-60">{t === "ALL" ? orders.length : orders.filter((o) => o.status === t).length}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, name, email…" className="a-input !pl-9" />
          </div>
        </div>
        <ul className="divide-y divide-line md:hidden">
          {list.length === 0 && <li className="py-12 text-center text-sm text-muted">No orders found.</li>}
          {list.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 p-4 active:bg-cream">
                <div className="min-w-0">
                  <div className="font-medium">{o.id}</div>
                  <div className="truncate text-sm">{o.customerName}</div>
                  <div className="text-xs text-muted">{formatDate(o.createdAt)} · {o.paymentMethod}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-medium">{formatPrice(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px]">
            <thead className="bg-cream/60"><tr><th className="a-th">Order</th><th className="a-th">Date</th><th className="a-th">Customer</th><th className="a-th">Payment</th><th className="a-th">Status</th><th className="a-th text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-line">
              {list.length === 0 && <EmptyRow cols={6} text="No orders found." />}
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-cream/40">
                  <td className="a-td font-medium"><Link href={`/admin/orders/${o.id}`} className="hover:text-gold-deep">{o.id}</Link></td>
                  <td className="a-td text-muted">{formatDate(o.createdAt)}</td>
                  <td className="a-td">{o.customerName}<div className="text-xs text-muted">{o.email}</div></td>
                  <td className="a-td">{o.paymentMethod} <StatusBadge status={o.paymentStatus} className="ml-1" /></td>
                  <td className="a-td"><StatusBadge status={o.status} /></td>
                  <td className="a-td text-right font-medium">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
