"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/ProductVisual";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { products, categories } = useCatalog();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return products
      .filter((p) => p.status === "ACTIVE")
      .filter((p) => p.name.toLowerCase().includes(s) || categories.find((c) => c.id === p.categoryId)?.name.toLowerCase().includes(s))
      .slice(0, 6);
  }, [q, products, categories]);

  return (
    <div className="fixed inset-0 z-50 bg-ink/50" onClick={onClose}>
      <div className="bg-ivory shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
          <Search className="h-5 w-5 text-gold" />
          <input
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search kada, earrings, mangalsutra…"
            className="flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-muted/60"
          />
          <button onClick={onClose} aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>
        {q && (
          <div className="mx-auto max-w-3xl border-t border-line px-4 pb-6">
            {results.length === 0 ? (
              <p className="py-8 text-center text-muted">No pieces found for “{q}”.</p>
            ) : (
              results.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} onClick={onClose} className="flex items-center gap-4 border-b border-line py-3 hover:bg-cream">
                  <div className="h-16 w-14 overflow-hidden bg-cream">
                    <ProductVisual product={p} />
                  </div>
                  <div className="flex-1">
                    <div className="font-serif text-lg">{p.name}</div>
                    <div className="text-xs text-muted">{categories.find((c) => c.id === p.categoryId)?.name}</div>
                  </div>
                  <div className="text-sm">{formatPrice(p.price)}</div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
