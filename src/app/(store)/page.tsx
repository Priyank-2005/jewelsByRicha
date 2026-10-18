"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Droplets, Gem, Gift, ShieldCheck, Star, Truck, Quote } from "lucide-react";
import { Instagram } from "@/components/ui/InstagramIcon";
import { useCatalog } from "@/context/CatalogContext";
import { ProductGrid } from "@/components/ui/ProductCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { SectionHead } from "@/components/ui/SectionHead";
import { HERO } from "@/data/images";
import { HOME_CATEGORY_SLUGS } from "@/data/catalog";
import { categoryCover } from "@/lib/catalog";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

const rise = { initial: { opacity: 0, y: 26 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-60px" }, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } };

const TRUST = [
  { icon: ShieldCheck, title: "Anti-tarnish", text: "Stays golden, wear after wear" },
  { icon: Droplets, title: "100% waterproof", text: "Showers, gym & monsoons" },
  { icon: Gem, title: "Premium quality", text: "Skin-friendly, nickel-safe" },
  { icon: Truck, title: "Free shipping", text: `On orders above ₹${BRAND.freeShippingThreshold}` },
  { icon: Gift, title: "Gift-ready", text: "Signature JR packaging" },
];

const REVIEWS = [
  { name: "Ananya Sharma", city: "Jaipur", item: "Virasat Heritage Kada", text: "I've worn my kada in the shower for three months — it still looks brand new. Looks far more expensive than it is." },
  { name: "Priya Mehta", city: "Mumbai", item: "Kashmiri Chandbali", text: "Wore these to a family function and got compliments all evening. The packaging felt so premium." },
  { name: "Simran Kaur", city: "Chandigarh", item: "Snake Chain Necklace", text: "Finally jewellery that doesn't turn my neck green. Light, elegant and I never take it off." },
];

const INSTA = ["/images/hero/1777999745587-31af0844db6c.jpg", "/images/stock/1631982690223-8aa4be0a2497.jpg", "/images/stock/1762686130435-897de4b26aac.jpg", "/images/stock/1602173574767-37ac01994b2a.jpg", "/images/stock/1783541507490-edb026e2a961.jpg", "/images/stock/1572545884955-6f3d7b6540a0.jpg"];

export default function HomePage() {
  const { products, categories, collections } = useCatalog();
  const [tab, setTab] = useState<"all" | "festive" | "anti-tarnish">("all");

  const live = useMemo(() => products.filter((p) => p.status === "ACTIVE"), [products]);
  const homeCats = useMemo(
    () => HOME_CATEGORY_SLUGS.map((s) => categories.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => !!c && c.active).slice(0, 8),
    [categories],
  );
  const best = useMemo(() => {
    const col = collections.find((c) => c.slug === tab);
    return live.filter((p) => (p.isBestSeller || p.isFeatured) && (!col || p.collectionId === col.id)).slice(0, 8);
  }, [live, tab, collections]);
  const fresh = useMemo(() => [...live].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4), [live]);

  return (
    <>
      <HeroSlider />

      {/* ───────── TRUST STRIP ───────── */}
      <section className="border-b border-line bg-ivory">
        <div className="hide-scrollbar mx-auto flex max-w-7xl gap-8 overflow-x-auto px-5 py-6 md:grid md:grid-cols-5 md:gap-4 md:px-8 md:py-8">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex shrink-0 items-center gap-3 md:justify-center">
              <Icon className="h-7 w-7 shrink-0 text-gold" strokeWidth={1.2} />
              <div className="leading-tight">
                <div className="text-[13px] font-medium">{title}</div>
                <div className="text-[11px] text-muted">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── COLLECTIONS ───────── */}
      <section className="mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <motion.div {...rise}><SectionHead eyebrow="Two worlds, one signature" title="Our collections" /></motion.div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { slug: "festive", img: HERO.jhumka, pos: "object-[50%_55%]", cta: "Explore festive" },
            { slug: "anti-tarnish", img: HERO.necklace, pos: "object-[60%_50%]", cta: "Explore everyday" },
          ].map((c, i) => {
            const col = collections.find((x) => x.slug === c.slug);
            if (!col) return null;
            return (
              <motion.div key={c.slug} {...rise} transition={{ ...rise.transition, delay: i * 0.12 }}>
                <Link href={`/collections/${col.slug}`} className="group relative block aspect-[1/1.08] overflow-hidden bg-ink md:aspect-[5/6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={col.name} className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105", c.pos)} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <div className="absolute inset-3 border border-ivory/25 transition-colors duration-500 group-hover:border-gold-mid/80" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-ivory md:p-10">
                    <p className="eyebrow !text-gold-light">{col.tagline}</p>
                    <h3 className="mt-2 font-serif text-4xl md:text-5xl">{col.name}</h3>
                    <span className="mt-5 inline-flex items-center gap-2 border-b border-gold-mid pb-1 text-xs font-medium uppercase tracking-[0.25em]">{c.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────── SHOP BY CATEGORY (max 8 + all) ───────── */}
      <section className="bg-cream py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div {...rise}><SectionHead eyebrow="Find your piece" title="Shop by category" action={{ label: "All categories", href: "/categories" }} align="left" /></motion.div>
          <div className="hide-scrollbar -mx-5 flex scroll-px-5 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-10 md:overflow-visible md:px-0">
            {homeCats.map((c, i) => {
              const col = collections.find((x) => x.id === c.collectionId)!;
              const img = categoryCover(c, products);
              return (
                <motion.div key={c.id} {...rise} transition={{ ...rise.transition, delay: (i % 4) * 0.08 }} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-auto">
                  <Link href={`/collections/${col.slug}/${c.slug}`} className="group block text-center">
                    <div className="relative mx-auto aspect-[3/4] overflow-hidden rounded-t-[999px] bg-beige ring-1 ring-gold-light transition-all duration-500 group-hover:ring-2 group-hover:ring-gold">
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={c.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <h3 className="mt-4 font-serif text-xl">{c.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{col.name}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link href="/categories" className="btn-outline">View all {categories.filter((c) => c.active).length} categories</Link>
          </div>
        </div>
      </section>

      {/* ───────── BESTSELLERS ───────── */}
      <section className="mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <motion.div {...rise}><SectionHead eyebrow="Most loved" title="Bestsellers" /></motion.div>
        <div className="mb-10 flex justify-center gap-2">
          {([["all", "All"], ["festive", "Festive"], ["anti-tarnish", "Anti Tarnish"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={cn("border px-5 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors", tab === k ? "border-ink bg-ink text-ivory" : "border-line hover:border-gold hover:text-gold-deep")}>{l}</button>
          ))}
        </div>
        <ProductGrid products={best} />
        <div className="mt-14 text-center"><Link href="/shop" className="btn-outline">View all jewellery</Link></div>
      </section>

      {/* ───────── WHY JR (split) ───────── */}
      <section className="bg-wine text-ivory">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <motion.div {...rise} className="relative mx-auto w-full max-w-md">
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] border border-gold-mid/50 p-2">
              <div className="h-full w-full overflow-hidden rounded-t-[999px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO.hoops} alt="Gold twisted hoop earrings on silk" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 bg-gold-mid px-6 py-4 text-ink shadow-lift">
              <div className="font-serif text-4xl leading-none">18K</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em]">Gold PVD coating</div>
            </div>
          </motion.div>
          <motion.div {...rise}>
            <p className="eyebrow !text-gold-mid">Why Jewels by Richa</p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">Luxury that <span className="font-script text-gold-mid md:text-7xl">lasts</span></h2>
            <p className="mt-5 max-w-lg text-ivory/70">We believe beautiful jewellery shouldn&apos;t fade, tarnish or wait in a box for an occasion. Every piece is made to be lived in.</p>
            <ul className="mt-9 space-y-6">
              {[
                [ShieldCheck, "Anti-tarnish finish", "A durable gold coating that resists fading, sweat and humidity."],
                [Droplets, "Truly waterproof", "Shower, swim and work out — your jewellery keeps its shine."],
                [Gem, "Skin-friendly & nickel-safe", "Comfortable on sensitive skin, light enough for all-day wear."],
              ].map(([Icon, t, d]) => {
                const I = Icon as typeof ShieldCheck;
                return (
                  <li key={t as string} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-mid/50 text-gold-mid"><I className="h-5 w-5" strokeWidth={1.3} /></span>
                    <div><h3 className="font-serif text-xl">{t as string}</h3><p className="text-sm text-ivory/60">{d as string}</p></div>
                  </li>
                );
              })}
            </ul>
            <Link href="/about" className="btn-gold mt-10">Our story</Link>
          </motion.div>
        </div>
      </section>

      {/* ───────── NEW ARRIVALS ───────── */}
      <section className="mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <motion.div {...rise}><SectionHead eyebrow="Just landed" title="New arrivals" action={{ label: "Shop new in", href: "/shop" }} align="left" /></motion.div>
        <ProductGrid products={fresh} />
      </section>

      {/* ───────── FESTIVE BANNER ───────── */}
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.kada} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-[78%_50%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-ivory md:px-8 md:py-36">
          <motion.div {...rise} className="max-w-xl">
            <p className="eyebrow !text-gold-light">Festive season</p>
            <h2 className="mt-4 font-serif text-5xl font-light leading-[1.05] md:text-7xl">Dressed for <span className="font-script text-gold-mid md:text-8xl">every celebration</span></h2>
            <p className="mt-5 text-ivory/75">Kashmiri earrings, heritage kadas, moissanite sparkle and AD sets — handpicked for Diwali, festivals and every celebration.</p>
            <Link href="/collections/festive" className="btn-gold mt-9">Shop the festive collection</Link>
          </motion.div>
        </div>
      </section>

      {/* ───────── REVIEWS ───────── */}
      <section className="bg-cream py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div {...rise}><SectionHead eyebrow="Kind words" title="Loved by our customers" /></motion.div>
          <div className="hide-scrollbar -mx-5 flex scroll-px-5 snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
            {REVIEWS.map((r, i) => (
              <motion.figure key={r.name} {...rise} transition={{ ...rise.transition, delay: i * 0.1 }} className="relative w-[84%] shrink-0 snap-start border border-line bg-ivory p-7 md:w-auto md:p-8">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-gold-light" />
                <div className="mb-4 flex gap-0.5">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-gold text-gold" />)}</div>
                <blockquote className="font-serif text-[1.35rem] leading-snug">{r.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink font-serif text-gold-light">{r.name[0]}</span>
                  <span className="text-sm leading-tight"><b className="font-medium">{r.name}</b><br /><span className="text-xs text-muted">{r.city} · {r.item}</span></span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── INSTAGRAM ───────── */}
      <section className="mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-24">
        <motion.div {...rise}><SectionHead eyebrow="Follow along" title={<>@{BRAND.social.instagram}</>} /></motion.div>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {INSTA.map((src, i) => (
            <a key={i} href={`https://instagram.com/${BRAND.social.instagram}`} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100"><Instagram className="h-6 w-6 text-ivory" /></span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
