import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { BRAND } from "@/config/brand";
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

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${greatVibes.variable} ${inter.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <Providers>
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
