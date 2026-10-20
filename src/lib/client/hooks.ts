"use client";

import { useCallback, useEffect, useState } from "react";
import type { Order } from "@/types/shop";
import { api } from "./api";

/** The signed-in customer's orders (newest first). */
export function useMyOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(() => {
    api<{ orders: Order[] }>("/api/account/orders")
      .then((r) => {
        setOrders(r.orders);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);
  useEffect(reload, [reload]);
  return { orders, error, reload };
}
