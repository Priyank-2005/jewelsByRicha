"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string, name?: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const KEY = "jbr_wishlist_v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids, mounted]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string, name?: string) => {
      setIds((prev) => {
        const on = prev.includes(id);
        showToast(on ? "Removed from wishlist" : `${name ?? "Item"} saved to wishlist`);
        return on ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [showToast],
  );

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
