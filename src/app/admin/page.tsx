"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, IndianRupee, Package, ShoppingCart, Users } from "lucide-react";
import { api } from "@/lib/client/api";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, Product } from "@/types/shop";

interface Stats {
  revenue: number;
  avgOrder: number;
  orderCount: number;
  pending: number;
  customers: number;
  products: { total: number; active: number };
  daily: { key: string; label: string; revenue: number; orders: number }[];
  topCategories: { name: string; value: number }[];
  recentOrders: Order[];
  lowStock: Product[];
}

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Stats>("/api/admin/stats").then(setS).catch((e: Error) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!s) return <p className="text-muted">Loading dashboard…</p>;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Snapshot of your store — last 30 days" />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatPrice(s.revenue)} hint={`Avg. order ${formatPrice(s.avgOrder)}`} icon={IndianRupee} />
        <StatCard label="Orders" value={s.orderCount} hint={`${s.pending} awaiting confirmation`} icon={ShoppingCart} />
        <StatCard label="Customers" value={s.customers} hint="Registered accounts" icon={Users} />
        <StatCard label="Products" value={s.products.total} hint={`${s.products.active} live on store`} icon={Package} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="a-card p-5 xl:col-span-2">
          <h2 className="mb-4 font-serif text-xl font-semibold">Sales</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.daily} margin={{ left: -10, right: 8, top: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5dcc8" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#7a7266" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#7a7266" }} tickLine={false} axisLine={false} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} cursor={{ fill: "#f4ede0" }} contentStyle={{ borderRadius: 8, border: "1px solid #e5dcc8" }} />
                <Bar dataKey="revenue" fill="#c9a24b" radius={[3, 3, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="a-card p-5">
          <h2 className="mb-4 font-serif text-xl font-semibold">Top categories</h2>
          {s.topCategories.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">No sales in the last 30 days yet.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={s.topCategories} layout="vertical" margin={{ left: 10, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 11, fill: "#2b2926" }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => formatPrice(Number(v))} cursor={{ fill: "#f4ede0" }} contentStyle={{ borderRadius: 8, border: "1px solid #e5dcc8" }} />
                  <Bar dataKey="value" fill="#b8913a" radius={[0, 4, 4, 0]} name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="a-card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-line p-5">
            <h2 className="font-serif text-xl font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-gold-deep hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead className="bg-cream/60"><tr><th className="a-th">Order</th><th className="a-th">Customer</th><th className="a-th">Date</th><th className="a-th">Status</th><th className="a-th text-right">Total</th></tr></thead>
              <tbody className="divide-y divide-line">
                {s.recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40">
                    <td className="a-td font-medium"><Link href={`/admin/orders/${o.id}`} className="hover:text-gold-deep">{o.id}</Link></td>
                    <td className="a-td">{o.customerName}</td>
                    <td className="a-td text-muted">{formatDate(o.createdAt)}</td>
                    <td className="a-td"><StatusBadge status={o.status} /></td>
                    <td className="a-td text-right font-medium">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="a-card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-semibold"><AlertTriangle className="h-4 w-4 text-gold-deep" /> Low stock</h2>
          {s.lowStock.length === 0 ? (
            <p className="text-sm text-muted">All products are well stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {s.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <Link href={`/admin/products/${p.id}`} className="truncate hover:text-gold-deep">{p.name}</Link>
                  <span className={p.stock === 0 ? "shrink-0 font-medium text-red-700" : "shrink-0 font-medium text-gold-deep"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
