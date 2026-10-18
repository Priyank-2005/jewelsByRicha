"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/data/products";
import type { Tone } from "@/data/catalog";
import { slugify } from "@/lib/utils";
import { Field, PageHeader, Toggle } from "./ui";
import { ProductVisual } from "@/components/ui/ProductVisual";

const BLANK = (categoryId: string, collectionId: string, id: string): Product => ({
  id,
  name: "",
  slug: "",
  categoryId,
  collectionId,
  price: 0,
  description: "",
  shortDescription: "",
  images: [],
  tone: "gold",
  rating: 0,
  reviewCount: 0,
  isNew: true,
  isBestSeller: false,
  isFeatured: false,
  stock: 10,
  status: "ACTIVE",
  features: ["Anti-tarnish", "Waterproof", "Skin friendly"],
  material: "",
  careInstructions: "",
  createdAt: new Date().toISOString(),
});

export function ProductForm({ product }: { product?: Product }) {
  const { categories, collections, saveProduct, products } = useCatalog();
  const { showToast } = useToast();
  const router = useRouter();
  const isNew = !product;
  const first = categories[0];
  const [p, setP] = useState<Product>(() => product ?? BLANK(first.id, first.collectionId, `p${Date.now()}`));
  const [imgUrl, setImgUrl] = useState("");
  const [feature, setFeature] = useState("");

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = p.slug || slugify(p.name);
    const dup = products.find((x) => x.slug === slug && x.id !== p.id);
    if (dup) return showToast("Another product already uses this URL slug");
    const cat = categories.find((c) => c.id === p.categoryId)!;
    saveProduct({
      ...p,
      slug,
      collectionId: cat.collectionId,
      originalPrice: p.originalPrice && p.originalPrice > p.price ? p.originalPrice : undefined,
      badge: p.isBestSeller ? "BEST SELLER" : p.isNew ? "NEW" : p.originalPrice ? "SALE" : undefined,
    });
    showToast(isNew ? "Product created" : "Product saved");
    router.push("/admin/products");
  };

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={isNew ? "Add product" : "Edit product"}
        subtitle={isNew ? "Create a new piece for the store" : p.name}
        actions={<><Link href="/admin/products" className="a-btn-ghost">Cancel</Link><button className="a-btn-dark">{isNew ? "Create product" : "Save changes"}</button></>}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="a-card space-y-4 p-5">
            <h2 className="font-serif text-xl font-semibold">Details</h2>
            <Field label="Product name"><input required className="a-input" value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="URL slug" hint="Leave blank to generate from the name"><input className="a-input" value={p.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder={slugify(p.name) || "auto-generated"} /></Field>
            <Field label="Short description"><input className="a-input" value={p.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></Field>
            <Field label="Description"><textarea rows={4} className="a-input" value={p.description} onChange={(e) => set("description", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material & finish"><textarea rows={2} className="a-input" value={p.material} onChange={(e) => set("material", e.target.value)} /></Field>
              <Field label="Care instructions"><textarea rows={2} className="a-input" value={p.careInstructions} onChange={(e) => set("careInstructions", e.target.value)} /></Field>
            </div>
          </div>

          <div className="a-card space-y-4 p-5">
            <h2 className="font-serif text-xl font-semibold">Images</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {p.images.map((src, i) => (
                <div key={src + i} className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => set("images", p.images.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-ivory" aria-label="Remove"><X className="h-3 w-3" /></button>
                </div>
              ))}
              {p.images.length === 0 && (
                <div className="col-span-3 flex items-center gap-3 rounded-lg border border-dashed border-line p-3 text-xs text-muted sm:col-span-5">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded"><ProductVisual product={p} /></div>
                  No photos yet — the storefront shows this illustrated placeholder until you add images.
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input className="a-input" placeholder="Paste image URL (https://…)" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
              <button type="button" className="a-btn-ghost shrink-0" onClick={() => { if (imgUrl.trim()) { set("images", [...p.images, imgUrl.trim()]); setImgUrl(""); } }}><ImagePlus className="h-4 w-4" /> Add</button>
            </div>
            <p className="text-[11px] text-muted">File upload (Cloudinary) is connected in the backend phase — see BACKEND_PLAN.md.</p>
          </div>

          <div className="a-card space-y-3 p-5">
            <h2 className="font-serif text-xl font-semibold">Highlights</h2>
            <div className="flex flex-wrap gap-2">
              {p.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 rounded-full border border-gold-light bg-cream px-3 py-1 text-xs text-gold-deep">
                  {f}<button type="button" onClick={() => set("features", p.features.filter((x) => x !== f))} aria-label={`Remove ${f}`}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="a-input" placeholder="e.g. Hypoallergenic" value={feature} onChange={(e) => setFeature(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (feature.trim()) { set("features", [...p.features, feature.trim()]); setFeature(""); } } }} />
              <button type="button" className="a-btn-ghost shrink-0" onClick={() => { if (feature.trim()) { set("features", [...p.features, feature.trim()]); setFeature(""); } }}>Add</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="a-card space-y-4 p-5">
            <h2 className="font-serif text-xl font-semibold">Organisation</h2>
            <Field label="Category">
              <select className="a-input" value={p.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                {collections.map((col) => (
                  <optgroup key={col.id} label={col.name}>
                    {categories.filter((c) => c.collectionId === col.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className="a-input" value={p.status} onChange={(e) => set("status", e.target.value as Product["status"])}>
                <option value="ACTIVE">Active — visible on store</option><option value="DRAFT">Draft — hidden</option>
              </select>
            </Field>
            <Field label="Placeholder tone" hint="Used for the illustrated placeholder">
              <select className="a-input" value={p.tone} onChange={(e) => set("tone", e.target.value as Tone)}>
                <option value="gold">Gold</option><option value="rose">Rose gold</option><option value="onyx">Onyx</option><option value="pearl">Pearl</option>
              </select>
            </Field>
          </div>

          <div className="a-card space-y-4 p-5">
            <h2 className="font-serif text-xl font-semibold">Pricing & stock</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹)"><input required type="number" min={0} className="a-input" value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} /></Field>
              <Field label="MRP (₹)" hint="Optional — shows a discount"><input type="number" min={0} className="a-input" value={p.originalPrice ?? ""} onChange={(e) => set("originalPrice", e.target.value ? Number(e.target.value) : undefined)} /></Field>
            </div>
            <Field label="Stock quantity"><input required type="number" min={0} className="a-input" value={p.stock} onChange={(e) => set("stock", Number(e.target.value))} /></Field>
          </div>

          <div className="a-card space-y-3 p-5">
            <h2 className="font-serif text-xl font-semibold">Merchandising</h2>
            {([["isFeatured", "Featured on homepage"], ["isBestSeller", "Bestseller badge"], ["isNew", "New arrival badge"]] as const).map(([k, l]) => (
              <div key={k} className="flex items-center justify-between text-sm">{l}<Toggle checked={p[k]} onChange={(v) => set(k, v)} label={l} /></div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
