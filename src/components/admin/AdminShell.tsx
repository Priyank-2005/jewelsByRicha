"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, Layers, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, ShoppingBag, ShoppingCart, Tag, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { api } from "@/lib/client/api";

const NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: ShoppingBag },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return (
    <AdminProvider>
      <Frame>{children}</Frame>
    </AdminProvider>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingOrders, ready, error, refresh, unreadMessages, integrations } = useAdmin();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const pending = pendingOrders;
  const logout = async () => {
    await api("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {open && <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-ivory transition-transform lg:static lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between border-b border-ivory/10 px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={36} height={36} className="rounded-full" />
            <span className="leading-none">
              <span className="block font-serif text-lg tracking-[0.2em]">JEWELS</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-mid">Admin</span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-gold/15 text-gold-light" : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory")}>
                <n.icon className={cn("h-[18px] w-[18px]", active && "text-gold-mid")} />
                {n.name}
                {n.name === "Orders" && pending > 0 && <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-ink">{pending}</span>}
                {n.name === "Messages" && unreadMessages > 0 && <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-ink">{unreadMessages}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-ivory/10 p-3 text-sm">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2 text-ivory/65 hover:bg-ivory/5 hover:text-ivory"><ExternalLink className="h-[18px] w-[18px]" /> View storefront</Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-ivory/65 hover:bg-red-500/10 hover:text-red-300"><LogOut className="h-[18px] w-[18px]" /> Logout</button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-ivory px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <p className="hidden text-sm text-muted lg:block">Welcome back, <span className="font-medium text-ink">Richa</span></p>
          <div className="flex items-center gap-3">
            {!integrations.razorpay && <span title="Razorpay keys are not set: online payments run in test (mock) mode" className="hidden rounded-full border border-gold-light bg-cream px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gold-deep sm:block">Payments: test mode</span>}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-serif text-ivory">R</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {!ready ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted">Loading…</div>
          ) : error ? (
            <div className="a-card mx-auto max-w-md p-8 text-center">
              <p className="font-serif text-xl">Couldn&apos;t load the admin data</p>
              <p className="mt-1 text-sm text-muted">{error}</p>
              <button onClick={() => void refresh()} className="a-btn-dark mt-4">Try again</button>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
