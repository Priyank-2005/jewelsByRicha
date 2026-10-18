"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/context/ToastContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CatalogProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}
