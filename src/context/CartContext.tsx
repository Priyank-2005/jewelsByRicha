"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { useToast } from "./ToastContext";
import { useCatalog } from "./CatalogContext";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface CartContextType {
  lines: CartLine[];
  /** false until the saved bag has been read from the browser */
  ready: boolean;
  /** Lines joined with live product data (drops products that no longer exist). */
  items: { product: Product; quantity: number }[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);
const KEY = "jbr_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();
  const { products, ready: catalogReady } = useCatalog();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, mounted]);

  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      setLines((prev) => {
        const ex = prev.find((l) => l.productId === p.id);
        if (ex) return prev.map((l) => (l.productId === p.id ? { ...l, quantity: Math.min(l.quantity + qty, Math.max(p.stock, 1)) } : l));
        return [...prev, { productId: p.id, quantity: qty }];
      });
      showToast(`${p.name} added to bag`);
      setIsDrawerOpen(true);
    },
    [showToast],
  );
  const removeFromCart = useCallback((id: string) => setLines((l) => l.filter((x) => x.productId !== id)), []);
  const updateQuantity = useCallback(
    (id: string, qty: number) => setLines((l) => (qty <= 0 ? l.filter((x) => x.productId !== id) : l.map((x) => (x.productId === id ? { ...x, quantity: qty } : x)))),
    [],
  );
  const clearCart = useCallback(() => setLines([]), []);

  const items = useMemo(
    () => lines.flatMap((l) => { const product = products.find((p) => p.id === l.productId); return product ? [{ product, quantity: l.quantity }] : []; }),
    [lines, products],
  );
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, ready: mounted && catalogReady, items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, subtotal, isDrawerOpen, setIsDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
