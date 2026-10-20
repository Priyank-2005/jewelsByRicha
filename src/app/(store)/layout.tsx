import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { BRAND } from "@/config/brand";
import { getCatalogData } from "@/lib/server/catalog";
import "../globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-cormorant" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} | ${BRAND.tagline}`, template: `%s | ${BRAND.name}` },
  description: BRAND.positioning,
  applicationName: BRAND.name,
  openGraph: { type: "website", siteName: BRAND.name, title: BRAND.name, description: BRAND.positioning, locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#faf7f2" };

// The catalogue comes straight from the database, so always render on request.
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalogData();
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${greatVibes.variable} ${inter.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <Providers catalog={catalog}>
          <PromoBanner />
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
