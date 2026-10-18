"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { HERO } from "@/data/images";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    eyebrow: "Anti-tarnish · Waterproof",
    title: (
      <>
        Everyday gold,
        <br />
        <span className="font-script text-gold-mid">never fades</span>
      </>
    ),
    text: "Light, skin-friendly pieces that go from the shower to the shaadi — and still shine tomorrow.",
    cta: { label: "Shop anti tarnish", href: "/collections/anti-tarnish" },
    img: HERO.necklace,
    pos: "object-[68%_45%] md:object-[60%_50%]",
  },
  {
    eyebrow: "The Festive Edit · 2026",
    title: (
      <>
        Jhumkas &amp; jewels
        <br />
        for <span className="font-script text-gold-mid">celebrations</span>
      </>
    ),
    text: "Kashmiri earrings, moissanite sparkle and heirloom-inspired kadas for the season of shaadis.",
    cta: { label: "Shop festive", href: "/collections/festive" },
    img: HERO.jhumka,
    pos: "object-[50%_55%]",
  },
  {
    eyebrow: "Heritage collection",
    title: (
      <>
        Made for your
        <br />
        <span className="font-script text-gold-mid">big day</span>
      </>
    ),
    text: "Statement necklaces, heritage kadas and AD sets with the grandeur of bridal gold.",
    cta: { label: "Shop heritage kada", href: "/collections/festive/heritage-bangle-kada" },
    img: HERO.bridal,
    pos: "object-[50%_38%]",
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((n: number) => setI((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  const s = SLIDES[i];

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative h-[calc(100svh-6.5rem)] min-h-[560px] md:h-[calc(100svh-7.5rem)] md:max-h-[780px] md:min-h-[600px]">
        {/* photo */}
        <div className="absolute inset-0 overflow-hidden md:left-[44%]">
          <AnimatePresence mode="sync">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.1 }, scale: { duration: 7, ease: "easeOut" } }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt="" className={cn("h-full w-full object-cover", s.pos)} />
            </motion.div>
          </AnimatePresence>
          {/* mobile: darken bottom; desktop: fade into left panel */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 via-35% to-ink/10 md:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ink via-ink/50 via-10% to-transparent to-50% md:block" />
        </div>

        {/* text panel */}
        <div className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(ellipse_at_20%_60%,rgba(201,162,75,0.16),transparent_60%)] md:block" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-24 md:items-center md:px-8 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[34rem]"
            >
              <p className="eyebrow !text-gold-mid">{s.eyebrow}</p>
              <h1 className="mt-4 font-serif text-[2.7rem] font-light leading-[1.04] md:text-[3.9rem] lg:text-[5rem] [&_.font-script]:text-[1.18em]">{s.title}</h1>
              <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-ivory/75 md:text-base">{s.text}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={s.cta.href} className="btn-gold pointer-events-auto">
                  {s.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/categories" className="btn pointer-events-auto border border-ivory/35 text-ivory hover:border-gold-mid hover:text-gold-light max-md:hidden">
                  All categories
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls */}
        <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-2" role="tablist">
            {SLIDES.map((_, k) => (
              <button key={k} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} onClick={() => go(k)} className="group py-3">
                <span className={cn("block h-[2px] transition-all duration-500", k === i ? "w-12 bg-gold-mid" : "w-6 bg-ivory/40 group-hover:bg-ivory/70")} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-ivory/70">
            <span className="hidden sm:block">0{i + 1} / 0{SLIDES.length}</span>
            <button onClick={() => go(i - 1)} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 hover:border-gold-mid hover:text-gold-light"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => go(i + 1)} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 hover:border-gold-mid hover:text-gold-light"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
