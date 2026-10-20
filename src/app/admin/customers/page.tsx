"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { EmptyRow, PageHeader } from "@/components/admin/ui";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AdminCustomers() {
  const { customers, orders } = useAdmin();
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      customers
        .map((c) => {
          const mine = orders.filter((o) => o.customerId === c.id && o.status !== "CANCELLED");
          return { ...c, orderCount: mine.length, spent: mine.reduce((s, o) => s + o.total, 0) };
        })
        .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()) || c.city.toLowerCase().includes(q.toLowerCase())),
    [customers, orders, q],
  );

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} registered customers`} />
      <div className="a-card">
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, city…" className="a-input !pl-9" />
          </div>
        </div>
        <ul className="divide-y divide-line md:hidden">
          {rows.length === 0 && <li className="py-12 text-center text-sm text-muted">No customers found.</li>}
          {rows.map((c) => (
            <li key={c.id}>
              <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3 p-4 active:bg-cream">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-serif text-gold-deep">{c.name[0]}</span>
                <span className="min-w-0 flex-1"><span className="block truncate font-medium">{c.name}</span><span className="block truncate text-xs text-muted">{c.city}, {c.state}</span></span>
                <span className="text-right text-sm"><span className="block font-medium">{formatPrice(c.spent)}</span><span className="text-xs text-muted">{c.orderCount} orders</span></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px]">
            <thead className="bg-cream/60"><tr><th className="a-th">Customer</th><th className="a-th">Location</th><th className="a-th">Joined</th><th className="a-th">Orders</th><th className="a-th text-right">Total spent</th></tr></thead>
            <tbody className="divide-y divide-line">
              {rows.length === 0 && <EmptyRow cols={5} text="No customers found." />}
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-cream/40">
                  <td className="a-td">
                    <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream font-serif text-gold-deep">{c.name[0]}</span>
                      <span><span className="block font-medium hover:text-gold-deep">{c.name}</span><span className="text-xs text-muted">{c.email}</span></span>
                    </Link>
                  </td>
                  <td className="a-td text-muted">{c.city}, {c.state}</td>
                  <td className="a-td text-muted">{formatDate(c.joinedDate)}</td>
                  <td className="a-td">{c.orderCount}</td>
                  <td className="a-td text-right font-medium">{formatPrice(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
