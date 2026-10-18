"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/config/brand";

const MESSAGES = [
  `Free shipping on orders above ₹${BRAND.freeShippingThreshold.toLocaleString("en-IN")}`,
  "Anti-tarnish · Waterproof · Premium quality",
  "Use code WELCOME10 for 10% off your first order",
];

export function PromoBanner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative z-50 flex h-9 items-center justify-center overflow-hidden bg-ink px-4 text-center text-[9.5px] font-medium uppercase tracking-[0.14em] sm:text-[10.5px] sm:tracking-[0.24em] text-gold-light md:text-[11px]">
      {MESSAGES.map((m, k) => (
        <span key={m} className={`absolute inset-x-4 transition-all duration-700 ${k === i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          {m}
        </span>
      ))}
    </div>
  );
}
