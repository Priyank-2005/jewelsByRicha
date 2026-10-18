"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, MapPin, Package, User, LayoutGrid } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutGrid },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: User },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!user) return <div className="py-32 text-center text-muted">Loading…</div>;

  return (
    <>
      <section className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-8 md:gap-6 md:px-8 md:py-12">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold-mid bg-wine font-serif text-2xl text-gold-light md:h-20 md:w-20 md:text-4xl">{user.name[0]}</span>
          <div className="min-w-0">
            <p className="eyebrow !text-gold-mid">My account</p>
            <h1 className="truncate font-serif text-3xl font-light md:text-5xl">{user.name}</h1>
            <p className="truncate text-sm text-ivory/60">{user.email}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
          <nav className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-col md:gap-1 md:px-0">
            {NAV.map((n) => {
              const active = n.href === "/account" ? pathname === n.href : pathname.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} className={cn("flex shrink-0 items-center gap-2.5 border px-4 py-2.5 text-sm transition-colors md:border-transparent", active ? "border-ink bg-ink text-ivory" : "border-line bg-white hover:border-gold md:bg-transparent")}>
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
            <button onClick={() => { logout(); router.push("/"); }} className="flex shrink-0 items-center gap-2.5 border border-line bg-white px-4 py-2.5 text-sm text-muted hover:text-ink md:border-transparent md:bg-transparent">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </>
  );
}
