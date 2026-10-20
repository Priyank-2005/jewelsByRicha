"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pager({ page, pages, total, pageSize = 20, onPage }: { page: number; pages: number; total: number; pageSize?: number; onPage: (p: number) => void }) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
      <span>{from}–{to} of {total}</span>
      <div className="flex items-center gap-1">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-md p-2 hover:bg-cream disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
        <span className="px-2 text-ink">Page {page} of {pages}</span>
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded-md p-2 hover:bg-cream disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
