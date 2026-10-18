import { PRODUCTS } from "./products";

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "UPI" | "CARD" | "COD";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  status: OrderStatus;
  address: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  joinedDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "PERCENT" | "FLAT";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  codAllowed: boolean;
}

export const CUSTOMERS: Customer[] = [
  { id: "u1", name: "Ananya Sharma", email: "ananya.sharma@example.com", phone: "+91 98100 11001", city: "Jaipur", state: "Rajasthan", joinedDate: "2026-06-12" },
  { id: "u2", name: "Priya Mehta", email: "priya.mehta@example.com", phone: "+91 98100 11002", city: "Mumbai", state: "Maharashtra", joinedDate: "2026-06-30" },
  { id: "u3", name: "Simran Kaur", email: "simran.kaur@example.com", phone: "+91 98100 11003", city: "Chandigarh", state: "Chandigarh", joinedDate: "2026-07-08" },
  { id: "u4", name: "Neha Agarwal", email: "neha.agarwal@example.com", phone: "+91 98100 11004", city: "Kolkata", state: "West Bengal", joinedDate: "2026-07-21" },
  { id: "u5", name: "Kavya Reddy", email: "kavya.reddy@example.com", phone: "+91 98100 11005", city: "Hyderabad", state: "Telangana", joinedDate: "2026-08-02" },
  { id: "u6", name: "Ritu Singh", email: "ritu.singh@example.com", phone: "+91 98100 11006", city: "Lucknow", state: "Uttar Pradesh", joinedDate: "2026-08-14" },
  { id: "u7", name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 98100 11007", city: "Chennai", state: "Tamil Nadu", joinedDate: "2026-08-29" },
  { id: "u8", name: "Pooja Joshi", email: "pooja.joshi@example.com", phone: "+91 98100 11008", city: "Pune", state: "Maharashtra", joinedDate: "2026-09-05" },
  { id: "u9", name: "Isha Verma", email: "isha.verma@example.com", phone: "+91 98100 11009", city: "Delhi", state: "Delhi", joinedDate: "2026-09-18" },
  { id: "u10", name: "Tanvi Desai", email: "tanvi.desai@example.com", phone: "+91 98100 11010", city: "Ahmedabad", state: "Gujarat", joinedDate: "2026-10-01" },
];

export const COUPONS: Coupon[] = [
  { id: "cp1", code: "WELCOME10", description: "10% off your first order", type: "PERCENT", value: 10, minOrder: 499, maxDiscount: 300, usageLimit: 500, usedCount: 87, expiresAt: "2026-12-31", active: true, codAllowed: true },
  { id: "cp2", code: "FESTIVE200", description: "₹200 off on festive collection orders", type: "FLAT", value: 200, minOrder: 1499, usageLimit: 200, usedCount: 41, expiresAt: "2026-11-15", active: true, codAllowed: false },
  { id: "cp3", code: "RICHA15", description: "15% off orders above ₹1,999", type: "PERCENT", value: 15, minOrder: 1999, maxDiscount: 600, usedCount: 12, expiresAt: "2026-12-15", active: true, codAllowed: true },
  { id: "cp4", code: "MONSOON20", description: "Monsoon sale — 20% off", type: "PERCENT", value: 20, minOrder: 799, maxDiscount: 400, usageLimit: 300, usedCount: 300, expiresAt: "2026-09-30", active: false, codAllowed: true },
];

// ---- Deterministic dummy orders (reference real seeded products) ----
const STATUSES: OrderStatus[] = ["DELIVERED", "DELIVERED", "SHIPPED", "CONFIRMED", "PENDING", "DELIVERED", "CANCELLED", "SHIPPED", "DELIVERED", "CONFIRMED", "PENDING", "DELIVERED", "DELIVERED", "SHIPPED"];
const METHODS: PaymentMethod[] = ["UPI", "COD", "CARD", "UPI", "UPI", "COD", "UPI", "CARD", "UPI", "COD", "UPI", "UPI", "CARD", "UPI"];

const BASE = new Date("2026-10-18T10:00:00+05:30").getTime();

export const ORDERS: Order[] = STATUSES.map((status, i) => {
  const cust = CUSTOMERS[i % CUSTOMERS.length];
  const first = PRODUCTS[(i * 5 + 2) % PRODUCTS.length];
  const second = PRODUCTS[(i * 11 + 7) % PRODUCTS.length];
  const items: OrderItem[] = [
    { productId: first.id, name: first.name, price: first.price, quantity: 1 + (i % 2) },
    ...(i % 3 !== 0 ? [{ productId: second.id, name: second.name, price: second.price, quantity: 1 }] : []),
  ];
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const couponCode = i % 4 === 1 ? "WELCOME10" : undefined;
  const discount = couponCode ? Math.min(Math.round(subtotal * 0.1), 300) : 0;
  const method = METHODS[i];
  const shipping = subtotal - discount >= 999 ? 0 : 79;
  const total = subtotal - discount + shipping + (method === "COD" ? 49 : 0);
  return {
    id: `JBR-${1001 + STATUSES.length - 1 - i}`,
    customerId: cust.id,
    customerName: cust.name,
    email: cust.email,
    phone: cust.phone,
    items,
    subtotal,
    discount,
    shipping,
    total,
    couponCode,
    paymentMethod: method,
    paymentStatus: status === "CANCELLED" ? "REFUNDED" : method === "COD" && status !== "DELIVERED" ? "PENDING" : "PAID",
    status,
    address: `${12 + i}, Rose Residency, ${cust.city}, ${cust.state}`,
    trackingNumber: status === "SHIPPED" || status === "DELIVERED" ? `TRK${7400000 + i * 137}` : undefined,
    createdAt: new Date(BASE - (i * 2 + (i % 3)) * 86400000 - i * 3600000).toISOString(),
  };
});
