import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Bestsellers — Jewels by Richa",
  description: "Our most loved and highest rated 18K gold-plated jewellery pieces.",
};

export default function BestsellersPage() {
  return <ShopView presetFilter="bestsellers" />;
}
