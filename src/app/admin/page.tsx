"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IndianRupee, Package, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";

const TODAY = new Date("2026-10-18T12:00:00+05:30");

export default function Dashboard() {
  const { orders, products, customers, categories } = useAdmin();

  const valid = orders.filter((o) => o.status !== "CANCELLED");
  const revenue = valid.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "PENDING").length;
  const aov = valid.length ? revenue / valid.length : 0;

  const daily = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(TODAY.getTime() - (29 - i) * 86400000);
      return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }), revenue: 0, orders: 0 };
    });
    valid.forEach((o) => {
      const k = new Date(o.createdAt).toISOString().slice(0, 10);
      const day = days.find((d) => d.key === k);
      if (day) { day.revenue += o.total; day.orders += 1; }
    });
    return days;
  }, [valid]);

  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    valid.forEach((o) => o.items.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      const c = categories.find((x) => x.id === p?.categoryId)?.name ?? "Other";
      m.set(c, (m.get(c) ?? 0) + it.price * it.quantity);
    }));
    return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [valid, products, categories]);

  const low = products.filter((p) => p.status === "ACTIVE" && p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 6);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Snapshot of your store — last 30 days" />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard label="Revenue" value={formatPrice(revenue)} hint={`Avg. order ${formatPrice(aov)}`} icon={IndianRupee} />
        <StatCard label="Orders" value={orders.length} hint={`${pending} awaiting confirmation`} icon={ShoppingCart} />
        <StatCard label="Customers" value={customers.length} hint="Registered accounts" icon={Users} />
        <StatCard label="Products" value={products.length} hint={`${products.filter((p) => p.status === "ACTIVE").length} live on store`} icon={Package} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="a-card p-5 xl:col-span-2">
          <h2 className="mb-4 font-serif text-xl font-semibold">Sales</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ left: -10, right: 8, top: 4 }}>
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} layout="vertical" margin={{ left: 10, right: 8 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 11, fill: "#2b2926" }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} cursor={{ fill: "#f4ede0" }} contentStyle={{ borderRadius: 8, border: "1px solid #e5dcc8" }} />
                <Bar dataKey="value" fill="#b8913a" radius={[0, 4, 4, 0]} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="a-card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-line p-5">
            <h2 className="font-serif text-xl font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-gold-deep hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream/60"><tr><th className="a-th">Order</th><th className="a-th">Customer</th><th className="a-th">Date</th><th className="a-th">Status</th><th className="a-th text-right">Total</th></tr></thead>
              <tbody className="divide-y divide-line">
                {orders.slice(0, 6).map((o) => (
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
          {low.length === 0 ? (
            <p className="text-sm text-muted">All products are well stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {low.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-gold-deep">{p.name}</Link>
                  <span className={p.stock === 0 ? "font-medium text-red-700" : "font-medium text-gold-deep"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
