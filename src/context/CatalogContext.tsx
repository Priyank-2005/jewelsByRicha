"use client";

/**
 * Storefront catalogue. The server renders the page with the catalogue already loaded (see the (store) layout),
 * so there is no loading flash and search engines see real content. Admin edits show up on the next page load.
 */

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { CatalogData, Category, Collection, Product, StoreSettings } from "@/types/shop";

interface CatalogContextType {
  collections: Collection[];
  categories: Category[];
  products: Product[];
  settings: StoreSettings;
  ready: boolean;
  getCategory: (id: string) => Category | undefined;
  getProduct: (id: string) => Product | undefined;
}

const CatalogContext = createContext<CatalogContextType | null>(null);

export function CatalogProvider({ data, children }: { data: CatalogData; children: ReactNode }) {
  const getCategory = useCallback((id: string) => data.categories.find((c) => c.id === id), [data.categories]);
  const getProduct = useCallback((id: string) => data.products.find((p) => p.id === id), [data.products]);
  const value = useMemo<CatalogContextType>(() => ({ ...data, ready: true, getCategory, getProduct }), [data, getCategory, getProduct]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/** Like useCatalog, but returns null outside the storefront (e.g. in the admin panel) instead of throwing. */
export function useCatalogOptional() {
  return useContext(CatalogContext);
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
