import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our story" };

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
          <div>
            <p className="eyebrow">Our story</p>
            <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">
              Timeless. Trendy. <span className="font-script text-gold">Yours.</span>
            </h1>
            <p className="mt-5 text-ink-soft">
              Jewels by Richa began with a simple belief: beautiful jewellery shouldn&apos;t fade, tarnish or stay locked in a box waiting for an occasion.
            </p>
          </div>
          <Image src="/logo.png" alt="Jewels by Richa" width={520} height={520} className="mx-auto w-full max-w-sm rounded-full shadow-lift" />
        </div>
      </section>
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-lg leading-relaxed text-ink-soft">
        <p>
          Every piece is chosen for how it feels as much as how it looks — lightweight, skin-friendly and finished to stay golden through showers, workouts and long days.
          Our <b>Anti Tarnish</b> range is built for everyday life; our <b>Festive Collection</b> brings heirloom-inspired kadas, Kashmiri styles and sparkling American-diamond pieces for the moments that matter.
        </p>
        <p>Premium quality, thoughtful packaging and honest prices — jewellery you&apos;ll reach for every single day.</p>
        <div className="flex justify-center pt-4">
          <Link href="/shop" className="btn-dark">Explore the collection</Link>
        </div>
      </section>
    </>
  );
}
