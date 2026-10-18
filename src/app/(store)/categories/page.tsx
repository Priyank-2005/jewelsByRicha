"use client";

import Link from "next/link";
import { useCatalog } from "@/context/CatalogContext";
import { categoryCover } from "@/lib/catalog";
import { SectionHead } from "@/components/ui/SectionHead";

export default function AllCategoriesPage() {
  const { collections, categories, products } = useCatalog();
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center md:px-8 md:py-20">
          <nav className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
            <Link href="/" className="hover:text-ink">Home</Link><span className="mx-2">/</span><span className="text-ink">All categories</span>
          </nav>
          <h1 className="font-serif text-5xl font-light md:text-6xl">All categories</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">Browse every piece by type — from heritage kadas to everyday studs.</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-20 px-4 py-16 md:px-8 md:py-24">
        {collections.map((col) => {
          const cats = categories.filter((c) => c.collectionId === col.id && c.active).sort((a, b) => a.sortOrder - b.sortOrder);
          return (
            <section key={col.id}>
              <SectionHead eyebrow={col.tagline} title={col.name} action={{ label: `Shop all ${col.name}`, href: `/collections/${col.slug}` }} align="left" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 md:gap-x-6 lg:grid-cols-5">
                {cats.map((c) => {
                  const img = categoryCover(c, products);
                  const n = products.filter((p) => p.categoryId === c.id && p.status === "ACTIVE").length;
                  return (
                    <Link key={c.id} href={`/collections/${col.slug}/${c.slug}`} className="group block text-center">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-beige ring-1 ring-gold-light transition-all group-hover:ring-2 group-hover:ring-gold">
                        {img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt={c.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                        )}
                      </div>
                      <h3 className="mt-4 font-serif text-xl leading-tight">{c.name}</h3>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{n} {n === 1 ? "piece" : "pieces"}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
