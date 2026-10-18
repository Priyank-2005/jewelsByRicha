import type { Metadata } from "next";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = { title: "Shop all jewellery" };

export default function ShopPage() {
  return <ShopView />;
}
