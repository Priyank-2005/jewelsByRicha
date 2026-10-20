import { PRODUCTS } from "./products";

export const COUPONS = [
  { code: "WELCOME10", description: "10% off your first order", type: "PERCENT" as const, value: 10, minOrder: 499, maxDiscount: 300, usageLimit: 500, perCustomerLimit: 1, firstOrderOnly: true, expiresAt: "2026-12-31", active: true, codAllowed: true },
  { code: "FESTIVE200", description: "₹200 off on orders above ₹1,499", type: "FLAT" as const, value: 200, minOrder: 1499, usageLimit: 200, perCustomerLimit: null, firstOrderOnly: false, expiresAt: "2026-11-15", active: true, codAllowed: false },
  { code: "RICHA15", description: "15% off orders above ₹1,999", type: "PERCENT" as const, value: 15, minOrder: 1999, maxDiscount: 600, usageLimit: null, perCustomerLimit: null, firstOrderOnly: false, expiresAt: "2026-12-15", active: true, codAllowed: true },
  { code: "MONSOON20", description: "Monsoon sale — 20% off", type: "PERCENT" as const, value: 20, minOrder: 799, maxDiscount: 400, usageLimit: 300, perCustomerLimit: null, firstOrderOnly: false, expiresAt: "2026-09-30", active: false, codAllowed: true },
];

export const DEMO_CUSTOMERS = [
  { name: "Ananya Sharma", email: "ananya.sharma@example.com", phone: "+91 98100 11001", city: "Jaipur", state: "Rajasthan", joined: "2026-06-12" },
  { name: "Priya Mehta", email: "priya.mehta@example.com", phone: "+91 98100 11002", city: "Mumbai", state: "Maharashtra", joined: "2026-06-30" },
  { name: "Simran Kaur", email: "simran.kaur@example.com", phone: "+91 98100 11003", city: "Chandigarh", state: "Chandigarh", joined: "2026-07-08" },
  { name: "Neha Agarwal", email: "neha.agarwal@example.com", phone: "+91 98100 11004", city: "Kolkata", state: "West Bengal", joined: "2026-07-21" },
  { name: "Kavya Reddy", email: "kavya.reddy@example.com", phone: "+91 98100 11005", city: "Hyderabad", state: "Telangana", joined: "2026-08-02" },
  { name: "Ritu Singh", email: "ritu.singh@example.com", phone: "+91 98100 11006", city: "Lucknow", state: "Uttar Pradesh", joined: "2026-08-14" },
  { name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 98100 11007", city: "Chennai", state: "Tamil Nadu", joined: "2026-08-29" },
  { name: "Pooja Joshi", email: "pooja.joshi@example.com", phone: "+91 98100 11008", city: "Pune", state: "Maharashtra", joined: "2026-09-05" },
  { name: "Isha Verma", email: "isha.verma@example.com", phone: "+91 98100 11009", city: "Delhi", state: "Delhi", joined: "2026-09-18" },
  { name: "Tanvi Desai", email: "tanvi.desai@example.com", phone: "+91 98100 11010", city: "Ahmedabad", state: "Gujarat", joined: "2026-10-01" },
];

const STATUSES = ["DELIVERED", "DELIVERED", "SHIPPED", "CONFIRMED", "PENDING", "DELIVERED", "CANCELLED", "SHIPPED", "DELIVERED", "CONFIRMED", "PENDING", "DELIVERED", "DELIVERED", "SHIPPED"] as const;
const METHODS = ["UPI", "COD", "CARD", "UPI", "UPI", "COD", "UPI", "CARD", "UPI", "COD", "UPI", "UPI", "CARD", "UPI"] as const;

/** Deterministic sample orders for the dashboard (seeded only when SEED_DEMO_DATA=true). */
export function buildDemoOrders(baseDate: Date) {
  return STATUSES.map((status, i) => {
    const cust = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length];
    const first = PRODUCTS[(i * 5 + 2) % PRODUCTS.length];
    const second = PRODUCTS[(i * 11 + 7) % PRODUCTS.length];
    const items = [
      { productId: first.id, name: first.name, image: first.images[0] ?? null, price: first.price, quantity: 1 + (i % 2) },
      ...(i % 3 !== 0 ? [{ productId: second.id, name: second.name, image: second.images[0] ?? null, price: second.price, quantity: 1 }] : []),
    ];
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const couponCode = i % 4 === 1 ? "WELCOME10" : null;
    const discount = couponCode ? Math.min(Math.round(subtotal * 0.1), 300) : 0;
    const method = METHODS[i];
    const shipping = subtotal - discount >= 999 ? 0 : 79;
    const codFee = method === "COD" ? 49 : 0;
    return {
      number: `JBR-${1001 + STATUSES.length - 1 - i}`,
      customerEmail: cust.email,
      customerName: cust.name,
      phone: cust.phone,
      address: { name: cust.name, phone: cust.phone, line: `${12 + i}, Rose Residency`, city: cust.city, state: cust.state, pincode: "110001" },
      items,
      subtotal,
      discount,
      shipping,
      codFee,
      total: subtotal - discount + shipping + codFee,
      couponCode,
      paymentMethod: method,
      paymentStatus: (status === "CANCELLED" ? "REFUNDED" : method === "COD" && status !== "DELIVERED" ? "PENDING" : "PAID") as "REFUNDED" | "PENDING" | "PAID",
      status,
      trackingNumber: status === "SHIPPED" || status === "DELIVERED" ? `TRK${7400000 + i * 137}` : null,
      createdAt: new Date(baseDate.getTime() - (i * 2 + (i % 3)) * 86400000 - i * 3600000),
    };
  });
}
