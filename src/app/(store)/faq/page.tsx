"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PolicyLayout } from "@/components/ui/PolicyLayout";
import { cn } from "@/lib/utils";

const FAQS: [string, string][] = [
  ["Is the jewellery really waterproof and anti-tarnish?", "Yes. Our Anti Tarnish range uses stainless steel with a durable PVD gold coating that withstands water, sweat and daily wear. Festive pieces should be kept away from water."],
  ["Is it safe for sensitive skin?", "Our pieces are nickel-safe and skin-friendly. If you have a known metal allergy, please contact us before ordering."],
  ["How long does delivery take?", "Orders ship in 1–2 business days. Delivery is usually 3–7 business days across India."],
  ["Do you offer Cash on Delivery?", "Yes, COD is available on most pincodes with a small handling fee. Some coupons are not valid on COD orders."],
  ["Can I return or exchange an order?", "Unused pieces in original packaging can be returned within 7 days of delivery. See Shipping & Returns for details."],
  ["Do you ship internationally?", "Not yet — we currently deliver within India only."],
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PolicyLayout eyebrow="Help" title="Frequently asked questions">
      <div className="!mt-0 divide-y divide-line border-y border-line">
        {FAQS.map(([q, a], i) => (
          <div key={q}>
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-xl text-ink">
              {q}
              <ChevronDown className={cn("h-5 w-5 shrink-0 text-gold transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && <p className="pb-5">{a}</p>}
          </div>
        ))}
      </div>
    </PolicyLayout>
  );
}
