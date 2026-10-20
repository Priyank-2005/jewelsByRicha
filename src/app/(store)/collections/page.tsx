import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HERO } from "@/data/images";

export const metadata: Metadata = {
  title: "Our Collections — Jewels by Richa",
  description: "Explore the Festive and Everyday Anti-Tarnish collections from Jewels by Richa.",
};

export default function CollectionsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#140e0c] via-[#201714] to-[#140e0c] text-ivory py-16 md:py-24 border-b border-[#362923]">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-10">
          <nav className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/60">
            <Link href="/" className="hover:text-gold-light">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gold-light">Our Collections</span>
          </nav>
          <p className="eyebrow !text-gold-light">Two worlds, one signature</p>
          <h1 className="mt-4 font-serif text-4xl font-extralight md:text-6xl lg:text-7xl">
            Our <span className="font-script text-gold-mid">Collections</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ivory/70 md:text-base">
            From heritage kadas &amp; festive treasures to waterproof everyday 18K gold-plated essentials.
          </p>
        </div>
      </section>

      {/* Collection Cards */}
      <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {[
            {
              slug: "festive",
              name: "Festive Collection",
              tagline: "Diwali, festivals & celebrations",
              desc: "Kashmiri earrings, heritage kadas, moissanite sparkle, choker sets and royal jhumkas handpicked to elevate every celebratory moment.",
              img: HERO.jhumka,
              cta: "Shop Festive Collection",
            },
            {
              slug: "anti-tarnish",
              name: "Anti-Tarnish Collection",
              tagline: "Waterproof daily essentials",
              desc: "18K gold PVD coated chains, twisted hoops, delicate bracelets and rings engineered to survive showers, workouts and daily life without fading.",
              img: HERO.necklace,
              cta: "Shop Everyday Anti-Tarnish",
            },
          ].map((col) => (
            <div
              key={col.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#ebd8cc] bg-gradient-to-b from-[#fdf8f4] to-[#faf2eb] shadow-lift transition-all duration-700 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#201714]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.img}
                  alt={col.name}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140e0c]/80 via-[#140e0c]/25 to-transparent" />
                <div className="absolute inset-4 border border-[#e8cca0]/30 transition-all duration-700 group-hover:border-[#d4ae58]/80" />
                <span className="absolute bottom-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-[#140e0c]/80 px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#e8cca0] backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-gold" /> {col.tagline}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-8 md:p-10">
                <div>
                  <h2 className="font-serif text-3xl font-light text-ink md:text-4xl">{col.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{col.desc}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#ebd8cc]">
                  <Link
                    href={`/collections/${col.slug}`}
                    className="btn-dark inline-flex items-center gap-2"
                  >
                    {col.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
