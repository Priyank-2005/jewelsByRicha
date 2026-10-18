import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { Instagram } from "@/components/ui/InstagramIcon";
import { BRAND } from "@/config/brand";
import { COLLECTIONS } from "@/data/catalog";
import { Newsletter } from "@/components/ui/Newsletter";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory/80">
      <Newsletter />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <Image src="/logo.png" alt="Jewels by Richa" width={88} height={88} className="mb-4 h-[88px] w-[88px] rounded-full" />
          <p className="text-sm leading-relaxed text-ivory/60">{BRAND.positioning}</p>
          <a
            href={`https://instagram.com/${BRAND.social.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-gold-light hover:text-gold-mid"
          >
            <Instagram className="h-4 w-4" /> @{BRAND.social.instagram}
          </a>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-gold-light">All jewellery</Link></li>
            {COLLECTIONS.map((c) => (
              <li key={c.id}><Link href={`/collections/${c.slug}`} className="hover:text-gold-light">{c.name}</Link></li>
            ))}
            <li><Link href="/wishlist" className="hover:text-gold-light">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-gold-light">FAQ</Link></li>
            <li><Link href="/care" className="hover:text-gold-light">Jewellery care</Link></li>
            <li><Link href="/shipping-returns" className="hover:text-gold-light">Shipping &amp; returns</Link></li>
            <li><Link href="/account/orders" className="hover:text-gold-light">Track my order</Link></li>
            <li><Link href="/contact" className="hover:text-gold-light">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {BRAND.contact.email}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {BRAND.contact.phone}</li>
            <li className="text-ivory/60">{BRAND.businessHours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ivory/50 md:flex-row md:px-8">
          <span>© 2026 Jewels by Richa. All rights reserved.</span>
          <span className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-gold-light">Privacy</Link>
            <Link href="/terms" className="hover:text-gold-light">Terms</Link>
            <Link href="/shipping-returns" className="hover:text-gold-light">Refunds</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
