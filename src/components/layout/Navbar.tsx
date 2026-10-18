"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useCatalog } from "@/context/CatalogContext";
import { HERO } from "@/data/images";
import { SearchOverlay } from "./SearchOverlay";

export function Navbar() {
  const { cartCount, setIsDrawerOpen } = useCart();
  const { ids } = useWishlist();
  const { user } = useAuth();
  const { collections, categories } = useCatalog();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center md:h-[76px] justify-between px-4 md:px-8">
        {/* left */}
        <div className="flex flex-1 items-center gap-4">
          <button className="md:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden items-center gap-6 whitespace-nowrap lg:gap-8 md:flex">
            <Link href="/categories" className="text-[11px] font-medium uppercase tracking-[0.18em] hover:text-gold-deep">
              Categories
            </Link>
            {collections.map((col) => (
              <div key={col.id} className="group relative" onMouseEnter={() => setOpen(col.id)} onMouseLeave={() => setOpen(null)}>
                <Link
                  href={`/collections/${col.slug}`}
                  className="flex items-center gap-1 py-6 text-[11px] font-medium uppercase tracking-[0.18em] hover:text-gold-deep"
                >
                  {col.name} <ChevronDown className="h-3 w-3" />
                </Link>
                {open === col.id && (
                  <div className="absolute left-0 top-full flex w-[620px] border border-line bg-ivory shadow-lift">
                   <div className="flex-1 p-6">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {categories
                        .filter((c) => c.collectionId === col.id && c.active)
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((c) => (
                          <Link
                            key={c.id}
                            href={`/collections/${col.slug}/${c.slug}`}
                            onClick={() => setOpen(null)}
                            className="py-1.5 text-sm text-ink-soft hover:text-gold-deep"
                          >
                            {c.name}
                          </Link>
                        ))}
                    </div>
                    <Link href={`/collections/${col.slug}`} className="mt-3 inline-block border-t border-line pt-3 text-xs uppercase tracking-[0.2em] text-gold-deep">
                      View all →
                    </Link>
                   </div>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={col.slug === "festive" ? HERO.jhumka : HERO.necklace} alt="" className="hidden h-auto w-56 object-cover lg:block" />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="Jewels by Richa — home">
          <Image src="/logo.png" alt="Jewels by Richa" width={52} height={52} className="h-11 w-11 rounded-full md:h-[52px] md:w-[52px]" priority />
          <span className="hidden leading-none sm:block">
            <span className="block font-serif text-xl tracking-[0.3em]">JEWELS</span>
            <span className="-mt-0.5 block font-script text-lg text-gold-deep">by Richa</span>
          </span>
        </Link>

        {/* right */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-3">
          <button onClick={() => setSearch(true)} className="p-2 hover:text-gold-deep" aria-label="Search">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link href={user ? "/account" : "/login"} className="hidden p-2 hover:text-gold-deep sm:block" aria-label="Account">
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link href="/wishlist" className="relative hidden p-2 hover:text-gold-deep sm:block" aria-label="Wishlist">
            <Heart className="h-[18px] w-[18px]" />
            {ids.length > 0 && <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-gold" />}
          </Link>
          <button onClick={() => setIsDrawerOpen(true)} className="relative p-2 hover:text-gold-deep" aria-label="Open bag">
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-ivory">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobile(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col overflow-y-auto bg-ivory p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-xl tracking-[0.25em]">MENU</span>
              <button onClick={() => setMobile(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Link href="/shop" onClick={() => setMobile(false)} className="border-b border-line py-3 text-sm uppercase tracking-[0.18em]">
              Shop all
            </Link>
            {collections.map((col) => (
              <div key={col.id} className="border-b border-line py-3">
                <Link href={`/collections/${col.slug}`} onClick={() => setMobile(false)} className="text-sm font-medium uppercase tracking-[0.18em]">
                  {col.name}
                </Link>
                <div className="mt-2 grid grid-cols-2 gap-x-3">
                  {categories
                    .filter((c) => c.collectionId === col.id && c.active)
                    .map((c) => (
                      <Link key={c.id} href={`/collections/${col.slug}/${c.slug}`} onClick={() => setMobile(false)} className="py-1.5 text-sm text-muted">
                        {c.name}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
            {[
              ["Wishlist", "/wishlist"],
              [user ? "My account" : "Login / Register", user ? "/account" : "/login"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([l, h]) => (
              <Link key={h} href={h} onClick={() => setMobile(false)} className="border-b border-line py-3 text-sm uppercase tracking-[0.18em]">
                {l}
              </Link>
            ))}
          </div>
        </div>
      )}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </header>
  );
}
