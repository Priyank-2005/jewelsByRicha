import { BRAND } from "@/config/brand";
import type { Coupon, PaymentMethod } from "@/data/admin";

export function validateCoupon(coupon: Coupon | undefined, subtotal: number, method: PaymentMethod): { ok: boolean; message?: string; discount: number } {
  if (!coupon) return { ok: false, message: "Invalid coupon code", discount: 0 };
  if (!coupon.active) return { ok: false, message: "This coupon is no longer active", discount: 0 };
  if (new Date(coupon.expiresAt + "T23:59:59+05:30") < new Date("2026-10-18")) return { ok: false, message: "This coupon has expired", discount: 0 };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { ok: false, message: "This coupon has been fully redeemed", discount: 0 };
  if (subtotal < coupon.minOrder) return { ok: false, message: `Add ₹${coupon.minOrder - subtotal} more to use this coupon`, discount: 0 };
  if (method === "COD" && !coupon.codAllowed) return { ok: false, message: "Not valid on Cash on Delivery", discount: 0 };
  let d = coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount) d = Math.min(d, coupon.maxDiscount);
  return { ok: true, discount: Math.min(d, subtotal) };
}

export function computeTotals(subtotal: number, discount: number, method: PaymentMethod) {
  const after = subtotal - discount;
  const shipping = subtotal === 0 || after >= BRAND.freeShippingThreshold ? 0 : BRAND.shippingFee;
  const codFee = method === "COD" ? BRAND.codFee : 0;
  return { subtotal, discount, shipping, codFee, total: after + shipping + codFee };
}
