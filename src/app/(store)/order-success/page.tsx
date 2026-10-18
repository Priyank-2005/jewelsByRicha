"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice } from "@/lib/utils";

function Inner() {
  const id = useSearchParams().get("id");
  const { orders } = useCatalog();
  const order = orders.find((o) => o.id === id);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="h-14 w-14 text-gold" strokeWidth={1.2} />
      <p className="eyebrow mt-6">Thank you</p>
      <h1 className="mt-2 font-serif text-5xl">Order placed!</h1>
      <p className="mt-4 text-ink-soft">
        {order ? <>Your order <b>{order.id}</b> of {formatPrice(order.total)} is confirmed. A confirmation will be sent to {order.email}.</> : "Your order is confirmed."}
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/account/orders" className="btn-dark">View my orders</Link>
        <Link href="/shop" className="btn-outline">Keep shopping</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><Inner /></Suspense>;
}
