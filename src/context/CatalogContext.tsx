"use client";

/**
 * UI-only data store. Holds the seeded dummy catalog / coupons / orders and persists admin edits
 * to localStorage so the whole admin + storefront flow can be demoed with no backend.
 *
 * BACKEND SWAP: replace the reducers below with calls to the API routes listed in BACKEND_PLAN.md
 * (server components / SWR). The component-facing hook `useCatalog()` is designed to stay the same.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CATEGORIES, COLLECTIONS, type Category, type Collection } from "@/data/catalog";
import { PRODUCTS, type Product } from "@/data/products";
import { COUPONS, CUSTOMERS, ORDERS, type Coupon, type Customer, type Order, type OrderStatus } from "@/data/admin";

const KEY = "jbr_catalog_v4";

interface State {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  customers: Customer[];
}

const SEED: State = { products: PRODUCTS, categories: CATEGORIES, coupons: COUPONS, orders: ORDERS, customers: CUSTOMERS };

interface CatalogContextType extends State {
  collections: Collection[];
  ready: boolean;
  getCategory: (id: string) => Category | undefined;
  getProduct: (id: string) => Product | undefined;
  // products
  saveProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  // categories
  saveCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  // coupons
  saveCoupon: (c: Coupon) => void;
  deleteCoupon: (id: string) => void;
  // orders
  addOrder: (o: Order) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  nextOrderId: () => string;
  resetDemoData: () => void;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

const upsert = <T extends { id: string }>(list: T[], item: T) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(SEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...SEED, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full / blocked */
    }
  }, [state, ready]);

  const patch = useCallback(<K extends keyof State>(key: K, fn: (v: State[K]) => State[K]) => setState((s) => ({ ...s, [key]: fn(s[key]) })), []);

  const value = useMemo<CatalogContextType>(
    () => ({
      ...state,
      collections: COLLECTIONS,
      ready,
      getCategory: (id) => state.categories.find((c) => c.id === id),
      getProduct: (id) => state.products.find((p) => p.id === id),
      saveProduct: (p) => patch("products", (l) => upsert(l, p)),
      deleteProduct: (id) => patch("products", (l) => l.filter((p) => p.id !== id)),
      saveCategory: (c) => patch("categories", (l) => upsert(l, c)),
      deleteCategory: (id) => patch("categories", (l) => l.filter((c) => c.id !== id)),
      saveCoupon: (c) => patch("coupons", (l) => upsert(l, c)),
      deleteCoupon: (id) => patch("coupons", (l) => l.filter((c) => c.id !== id)),
      addOrder: (o) => patch("orders", (l) => [o, ...l]),
      updateOrder: (id, p) => patch("orders", (l) => l.map((o) => (o.id === id ? { ...o, ...p } : o))),
      setOrderStatus: (id, status) =>
        patch("orders", (l) =>
          l.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  paymentStatus: status === "CANCELLED" ? "REFUNDED" : status === "DELIVERED" ? "PAID" : o.paymentStatus,
                }
              : o,
          ),
        ),
      nextOrderId: () => {
        const max = state.orders.reduce((m, o) => Math.max(m, parseInt(o.id.replace(/\D/g, ""), 10) || 0), 1000);
        return `JBR-${max + 1}`;
      },
      resetDemoData: () => setState(SEED),
    }),
    [state, ready, patch],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
