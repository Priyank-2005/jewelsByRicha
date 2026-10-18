"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { EmptyRow, PageHeader } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { formatPrice } from "@/lib/utils";

export default function AdminProducts() {
  const { products, categories, collections, deleteProduct, saveProduct } = useCatalog();
  const { showToast } = useToast();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (!q || p.name.toLowerCase().includes(q.toLowerCase())) &&
          (cat === "all" || p.categoryId === cat) &&
          (status === "all" || p.status === status) &&
          (stock === "all" || (stock === "out" ? p.stock === 0 : stock === "low" ? p.stock > 0 && p.stock <= 5 : p.stock > 5)),
      ),
    [products, q, cat, status, stock],
  );

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products across ${categories.length} categories`}
        actions={<Link href="/admin/products/new" className="a-btn-dark"><Plus className="h-4 w-4" /> Add product</Link>}
      />

      <div className="a-card">
        <div className="flex flex-wrap gap-3 border-b border-line p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="a-input !pl-9" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="a-input !w-auto">
            <option value="all">All categories</option>
            {collections.map((col) => (
              <optgroup key={col.id} label={col.name}>
                {categories.filter((c) => c.collectionId === col.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="a-input !w-auto">
            <option value="all">Any status</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option>
          </select>
          <select value={stock} onChange={(e) => setStock(e.target.value)} className="a-input !w-auto">
            <option value="all">Any stock</option><option value="ok">In stock</option><option value="low">Low (≤5)</option><option value="out">Sold out</option>
          </select>
        </div>

        <ul className="divide-y divide-line md:hidden">
          {list.length === 0 && <li className="py-12 text-center text-sm text-muted">No products match your filters.</li>}
          {list.map((p) => (
            <li key={p.id} className="flex gap-3 p-4">
              <Link href={`/admin/products/${p.id}`} className="h-20 w-16 shrink-0 overflow-hidden rounded bg-cream"><ProductVisual product={p} /></Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="block truncate font-medium">{p.name}</Link>
                <div className="text-xs text-muted">{categories.find((c) => c.id === p.categoryId)?.name}</div>
                <div className="mt-1 text-sm">{formatPrice(p.price)} <span className="text-xs text-muted">· {p.stock === 0 ? "sold out" : `${p.stock} in stock`}</span></div>
                <div className="mt-2 flex items-center justify-between">
                  <button onClick={() => saveProduct({ ...p, status: p.status === "ACTIVE" ? "DRAFT" : "ACTIVE" })}><StatusBadge status={p.status} /></button>
                  <div className="flex gap-1">
                    <Link href={`/admin/products/${p.id}`} className="rounded-md p-2 text-muted hover:bg-cream" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => { if (confirm(`Delete “${p.name}”?`)) { deleteProduct(p.id); showToast("Product deleted"); } }} className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px]">
            <thead className="bg-cream/60">
              <tr><th className="a-th">Product</th><th className="a-th">Category</th><th className="a-th">Price</th><th className="a-th">Stock</th><th className="a-th">Status</th><th className="a-th text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.length === 0 && <EmptyRow cols={6} text="No products match your filters." />}
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-cream/40">
                  <td className="a-td">
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded bg-cream"><ProductVisual product={p} /></div>
                      <span className="font-medium hover:text-gold-deep">{p.name}</span>
                    </Link>
                  </td>
                  <td className="a-td text-muted">{categories.find((c) => c.id === p.categoryId)?.name}</td>
                  <td className="a-td">{formatPrice(p.price)}{p.originalPrice && <span className="ml-1 text-xs text-muted line-through">{formatPrice(p.originalPrice)}</span>}</td>
                  <td className="a-td"><span className={p.stock === 0 ? "font-medium text-red-700" : p.stock <= 5 ? "font-medium text-gold-deep" : ""}>{p.stock}</span></td>
                  <td className="a-td">
                    <button onClick={() => saveProduct({ ...p, status: p.status === "ACTIVE" ? "DRAFT" : "ACTIVE" })} title="Click to toggle"><StatusBadge status={p.status} /></button>
                  </td>
                  <td className="a-td">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`} className="rounded-md p-2 text-muted hover:bg-cream hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                      <button
                        onClick={() => { if (confirm(`Delete “${p.name}”?`)) { deleteProduct(p.id); showToast("Product deleted"); } }}
                        className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" aria-label="Delete"
                      ><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
