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
    <div className="relative z-50 flex h-10 items-center justify-center overflow-hidden bg-ink px-4 text-center text-[9px] font-medium uppercase tracking-[0.28em] sm:text-[10px] sm:tracking-[0.32em] text-gold-light/90 md:text-[10.5px]" style={{ borderBottom: '1px solid rgba(196, 154, 60, 0.2)' }}>
      {MESSAGES.map((m, k) => (
        <span key={m} className={`absolute inset-x-4 transition-all duration-700 ${k === i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
          {m}
        </span>
      ))}
    </div>
  );
}
