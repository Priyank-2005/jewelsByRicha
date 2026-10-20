"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api";

/**
 * Loads one page of an admin list (products, orders, customers, messages) from the server.
 * `params` are sent as the query string; changing them goes back to page 1. Text search is debounced.
 */
export function useAdminList<T, Extra = Record<string, never>>(path: string, key: string, params: Record<string, string | undefined>, pageSize = 20) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: T[]; total: number; pages: number; extra: Extra } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paramKey = JSON.stringify(params);
  const prevParams = useRef(paramKey);
  const seq = useRef(0);

  const load = useCallback(
    async (p: number) => {
      const id = ++seq.current;
      setLoading(true);
      const qs = new URLSearchParams({ page: String(p), pageSize: String(pageSize) });
      for (const [k, v] of Object.entries(JSON.parse(paramKey) as Record<string, string | undefined>)) if (v) qs.set(k, v);
      try {
        const r = await api<Record<string, unknown> & { total: number; pages: number }>(`${path}?${qs}`);
        if (id !== seq.current) return; // a newer request superseded this one
        const { total, pages, page: _page, pageSize: _ps, [key]: items, ...extra } = r as Record<string, unknown> & { total: number; pages: number };
        void _page;
        void _ps;
        setData({ items: items as T[], total, pages, extra: extra as Extra });
        setError(null);
      } catch (e) {
        if (id === seq.current) setError(e instanceof Error ? e.message : "Could not load");
      } finally {
        if (id === seq.current) setLoading(false);
      }
    },
    [path, key, paramKey, pageSize],
  );

  useEffect(() => {
    const changed = prevParams.current !== paramKey;
    prevParams.current = paramKey;
    if (changed && page !== 1) {
      setPage(1);
      return;
    }
    const t = setTimeout(() => void load(page), changed ? 250 : 0); // debounce typing, not paging
    return () => clearTimeout(t);
  }, [load, page, paramKey]);

  return { items: data?.items ?? [], total: data?.total ?? 0, pages: data?.pages ?? 1, extra: data?.extra, page, setPage, loading, error, reload: () => load(page) };
}
