"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { ProductGrid } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";
import { HERO } from "@/data/images";
import { categoryCover } from "@/lib/catalog";

type Sort = "featured" | "price-asc" | "price-desc" | "newest" | "rating";
const PRICE_BANDS = [
  { id: "all", label: "All prices", min: 0, max: Infinity },
  { id: "u500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-1500", label: "₹1,000 – ₹1,500", min: 1000, max: 1500 },
  { id: "o1500", label: "Above ₹1,500", min: 1500, max: Infinity },
];

export function ShopView({ collectionSlug, categorySlug }: { collectionSlug?: string; categorySlug?: string }) {
  const { products, categories, collections } = useCatalog();
  const [sort, setSort] = useState<Sort>("featured");
  const [band, setBand] = useState("all");
  const [inStock, setInStock] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const collection = collections.find((c) => c.slug === collectionSlug);
  const category = categories.find((c) => c.slug === categorySlug);
  const siblings = categories.filter((c) => c.active && (!collection || c.collectionId === collection.id)).sort((a, b) => a.sortOrder - b.sortOrder);

  const list = useMemo(() => {
    const b = PRICE_BANDS.find((x) => x.id === band)!;
    let out = products.filter(
      (p) =>
        p.status === "ACTIVE" &&
        (!collection || p.collectionId === collection.id) &&
        (!category || p.categoryId === category.id) &&
        p.price >= b.min &&
        p.price < b.max &&
        (!inStock || p.stock > 0),
    );
    out = [...out];
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    else if (sort === "newest") out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "rating") out.sort((a, b) => b.rating - a.rating);
    else out.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isBestSeller) - Number(a.isBestSeller));
    return out;
  }, [products, collection, category, band, inStock, sort]);

  const banner = (category && categoryCover(category, products)) || (collection?.slug === "festive" ? HERO.bridal : collection?.slug === "anti-tarnish" ? HERO.necklace : HERO.hoops);
  const title = category?.name ?? collection?.name ?? "All Jewellery";
  const blurb = category?.description ?? collection?.description ?? "Every piece from Jewels by Richa — anti-tarnish, waterproof and made to be worn daily.";

  return (
    <div>
      {/* header */}
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/70 to-ink/20" />
        <div className="mx-auto max-w-7xl px-5 py-12 text-center md:px-8 md:py-24">
          <nav className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/70">
            <Link href="/" className="hover:text-gold-light">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gold-light">Shop</Link>
            {collection && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/collections/${collection.slug}`} className="hover:text-gold-light">{collection.name}</Link>
              </>
            )}
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gold-light">{category.name}</span>
              </>
            )}
          </nav>
          <h1 className="font-serif text-4xl font-light md:text-7xl">{title}</h1>
          <p className="mx-auto mt-3 line-clamp-2 max-w-xl text-sm text-ivory/80 md:line-clamp-none md:text-base">{blurb}</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
        {/* category chips */}
        <div className="hide-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
          {collection && (
            <Chip href={`/collections/${collection.slug}`} active={!category}>All {collection.name}</Chip>
          )}
          {!collection && collections.map((c) => (
            <Chip key={c.id} href={`/collections/${c.slug}`} active={false}>{c.name}</Chip>
          ))}
          {collection && siblings.map((c) => (
            <Chip key={c.id} href={`/collections/${collection.slug}/${c.slug}`} active={category?.id === c.id}>{c.name}</Chip>
          ))}
        </div>

        {/* toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters((v) => !v)} className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <span className="text-xs text-muted">{list.length} {list.length === 1 ? "piece" : "pieces"}</span>
          </div>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="border border-line bg-white px-3 py-2 text-xs normal-case tracking-normal outline-none focus:border-gold">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="mb-8 grid gap-6 border border-line bg-white p-5 sm:grid-cols-2">
            <div>
              <div className="label">Price</div>
              <div className="flex flex-wrap gap-2">
                {PRICE_BANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBand(b.id)}
                    className={cn("border px-3 py-1.5 text-xs transition-colors", band === b.id ? "border-ink bg-ink text-ivory" : "border-line hover:border-gold")}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="label">Availability</div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-[#b8913a]" />
                In stock only
              </label>
            </div>
          </div>
        )}

        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-3xl">Nothing here yet</p>
            <p className="mt-2 text-muted">Try adjusting the filters or browse all jewellery.</p>
            <Link href="/shop" className="btn-dark mt-6">Shop all</Link>
          </div>
        ) : (
          <ProductGrid products={list} />
        )}
      </div>
    </div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 border px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors",
        active ? "border-ink bg-ink text-ivory" : "border-line bg-white hover:border-gold hover:text-gold-deep",
      )}
    >
      {children}
    </Link>
  );
}
