"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Order } from "@/types/shop";
import { api } from "./api";

interface OrdersPage {
  orders: Order[];
  spent: number;
  page: number;
  pages: number;
  total: number;
}

/** The signed-in customer's orders, newest first, loaded page by page. */
export function useMyOrders(pageSize = 10) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, spent: 0 });
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const busy = useRef(false);

  const load = useCallback(
    async (page: number, replace: boolean) => {
      if (busy.current) return;
      busy.current = true;
      try {
        const r = await api<OrdersPage>(`/api/account/orders?page=${page}&pageSize=${pageSize}`);
        setOrders((prev) => (replace || !prev ? r.orders : [...prev, ...r.orders.filter((o) => !prev.some((p) => p.id === o.id))]));
        setMeta({ page: r.page, pages: r.pages, total: r.total, spent: r.spent });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load your orders");
      } finally {
        busy.current = false;
        setLoadingMore(false);
      }
    },
    [pageSize],
  );

  const reload = useCallback(() => void load(1, true), [load]);
  useEffect(() => void load(1, true), [load]);

  return {
    orders,
    error,
    reload,
    total: meta.total,
    spent: meta.spent,
    hasMore: meta.page < meta.pages,
    loadingMore,
    loadMore: () => {
      setLoadingMore(true);
      void load(meta.page + 1, false);
    },
  };
}
