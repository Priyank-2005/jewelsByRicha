"use client";

import Link from "next/link";
import { Heart, MapPin, Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useMyOrders } from "@/lib/client/hooks";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";

export default function AccountHome() {
  const { user } = useAuth();
  const { orders, total, spent } = useMyOrders(3);
  const { ids } = useWishlist();
  const mine = orders ?? [];
  const stats: [string, string | number, string][] = [
    ["Orders", orders ? total : "–", "/account/orders"],
    ["Wishlist", ids.length, "/wishlist"],
    ["Total spent", orders ? formatPrice(spent) : "–", "/account/orders"],
  ];
  const links = [
    { href: "/account/orders", icon: Package, t: "Track orders", d: "Status, tracking and details" },
    { href: "/wishlist", icon: Heart, t: "Wishlist", d: "Pieces you've saved" },
    { href: "/account/addresses", icon: MapPin, t: "Addresses", d: "Manage delivery addresses" },
  ];

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted">Signed in as {user?.email}</p>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {stats.map(([l, v, h]) => (
          <Link key={l} href={h} className="border border-line bg-white p-4 transition hover:border-gold md:p-6">
            <div className="label !mb-1">{l}</div>
            <div className="font-serif text-2xl md:text-4xl">{v}</div>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl md:text-3xl">Recent orders</h2>
          <Link href="/account/orders" className="text-xs uppercase tracking-[0.2em] text-gold-deep hover:underline">View all</Link>
        </div>
        {orders && mine.length === 0 ? (
          <div className="border border-dashed border-line bg-white p-8 text-center text-sm text-muted">
            No orders yet. <Link href="/shop" className="text-gold-deep underline">Start shopping</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {mine.slice(0, 3).map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="flex items-center justify-between gap-3 border border-line bg-white p-4 transition hover:border-gold">
                  <div><div className="font-medium">{o.id}</div><div className="text-xs text-muted">{formatDate(o.createdAt)}</div></div>
                  <StatusBadge status={o.status} />
                  <div className="font-medium">{formatPrice(o.total)}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="group flex items-center gap-4 border border-line bg-white p-5 transition hover:border-gold">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-gold-deep"><l.icon className="h-5 w-5" strokeWidth={1.4} /></span>
            <span className="flex-1"><span className="block font-serif text-lg leading-tight">{l.t}</span><span className="text-xs text-muted">{l.d}</span></span>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>
    </div>
  );
}
