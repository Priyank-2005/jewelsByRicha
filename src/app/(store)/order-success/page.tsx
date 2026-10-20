"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import type { Order } from "@/types/shop";
import { api } from "@/lib/client/api";
import { formatPrice } from "@/lib/utils";

function Inner() {
  const id = useSearchParams().get("id");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    let token = "";
    try {
      const raw = sessionStorage.getItem("jbr_last_order");
      if (raw) {
        const saved = JSON.parse(raw) as { order: Order; token: string };
        if (saved.order.id === id) {
          setOrder(saved.order);
          token = saved.token;
        }
      }
    } catch {}
    // refresh from the server so the status shown is the real one
    api<{ order: Order }>(`/api/orders/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`).then((r) => setOrder(r.order)).catch(() => {});
  }, [id]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <CheckCircle2 className="h-14 w-14 text-gold" strokeWidth={1.2} />
      <p className="eyebrow mt-6">Thank you</p>
      <h1 className="mt-2 font-serif text-5xl font-light">Order placed!</h1>
      <p className="mt-4 text-ink-soft">
        {order ? (
          <>Your order <b>{order.id}</b> of {formatPrice(order.total)} {order.paymentStatus === "PAID" ? "is confirmed and paid" : "has been received"}. A confirmation has been sent to {order.email}.</>
        ) : (
          "Your order has been received. A confirmation is on its way to your email."
        )}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/account/orders" className="btn-dark">View my orders</Link>
        <Link href="/shop" className="btn-outline">Keep shopping</Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
