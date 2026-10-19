import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "New Arrivals — Jewels by Richa",
  description: "Explore the latest waterproof, anti-tarnish 18K gold-plated jewellery drops.",
};

export default function NewArrivalsPage() {
  return <ShopView presetFilter="new-arrivals" />;
}
