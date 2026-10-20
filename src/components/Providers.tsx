"use client";

import type { ReactNode } from "react";
import type { CatalogData } from "@/types/shop";
import { ToastProvider } from "@/context/ToastContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function Providers({ catalog, children }: { catalog: CatalogData; children: ReactNode }) {
  return (
    <ToastProvider>
      <CatalogProvider data={catalog}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}
