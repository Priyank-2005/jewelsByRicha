"use client";

/**
 * Wishlist. Guests keep it in the browser; once signed in it is stored on the server (and the guest list is merged in),
 * so it follows the customer across devices.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { api } from "@/lib/client/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface WishlistContextType {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string, name?: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);
const KEY = "jbr_wishlist_v2";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const { user, ready } = useAuth();
  const { showToast } = useToast();
  const loadedFor = useRef<string | null>(null);

  // load: local list for guests; on sign-in, merge the local list into the server list
  useEffect(() => {
    if (!ready) return;
    const local: string[] = (() => {
      try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
      } catch {
        return [];
      }
    })();
    if (!user) {
      loadedFor.current = null;
      setIds(local);
      return;
    }
    if (loadedFor.current === user.id) return;
    loadedFor.current = user.id;
    (async () => {
      try {
        for (const id of local) await api("/api/wishlist", { method: "POST", body: { productId: id } }).catch(() => {});
        const r = await api<{ ids: string[] }>("/api/wishlist");
        setIds(r.ids);
        localStorage.removeItem(KEY);
      } catch {
        setIds(local);
      }
    })();
  }, [user, ready]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string, name?: string) => {
      const on = ids.includes(id);
      const next = on ? ids.filter((x) => x !== id) : [...ids, id];
      setIds(next);
      showToast(on ? "Removed from wishlist" : `${name ?? "Item"} saved to wishlist`);
      if (user) api(`/api/wishlist${on ? `?productId=${encodeURIComponent(id)}` : ""}`, { method: on ? "DELETE" : "POST", body: on ? undefined : { productId: id } }).catch(() => {});
      else {
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
      }
    },
    [ids, user, showToast],
  );

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
