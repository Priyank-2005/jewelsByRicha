"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/types/shop";
import { slugify } from "@/lib/utils";
import { Field, PageHeader, Toggle } from "./ui";

const BLANK = (categoryId: string, collectionId: string): Product => ({
  id: "new",
  name: "",
  slug: "",
  categoryId,
  collectionId,
  price: 0,
  description: "",
  shortDescription: "",
  images: [],
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
  const { categories, collections, saveProduct } = useAdmin();
  const { showToast } = useToast();
  const router = useRouter();
  const isNew = !product;
  const first = categories[0];
  const [p, setP] = useState<Product>(() => product ?? BLANK(first?.id ?? "", first?.collectionId ?? ""));
  const [imgUrl, setImgUrl] = useState("");
  const [feature, setFeature] = useState("");
  const [uploading, setUploading] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    for (const file of Array.from(files)) {
      setUploading((n) => n + 1);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "same-origin" });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.url) throw new Error(json?.error || "Upload failed");
        setP((x) => ({ ...x, images: [...x.images, json.url as string] }));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const move = (i: number, dir: -1 | 1) =>
    setP((x) => {
      const imgs = [...x.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return x;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...x, images: imgs };
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!p.categoryId) return setError("Pick a category first");
    setSaving(true);
    try {
      await saveProduct({ ...p, slug: p.slug || slugify(p.name) });
      showToast(isNew ? "Product created" : "Product saved");
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <PageHeader
        title={isNew ? "Add product" : "Edit product"}
        subtitle={isNew ? "Create a new piece for the store" : p.name}
        actions={<><Link href="/admin/products" className="a-btn-ghost">Cancel</Link><button disabled={saving || uploading > 0} className="a-btn-dark">{saving ? "Saving…" : isNew ? "Create product" : "Save changes"}</button></>}
      />
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

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
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Photos</h2>
              <span className="text-xs text-muted">{p.images.length} / 10 · first photo is the cover</span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {p.images.map((src, i) => (
                <div key={src + i} className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-ivory">Cover</span>}
                  <button type="button" onClick={() => set("images", p.images.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-ivory" aria-label="Remove photo"><X className="h-3 w-3" /></button>
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/60 px-1 py-0.5 text-[11px] text-ivory opacity-0 transition group-hover:opacity-100">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">←</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === p.images.length - 1} aria-label="Move later">→</button>
                  </div>
                </div>
              ))}
              {uploading > 0 && (
                <div className="flex aspect-[4/5] items-center justify-center rounded-lg border border-dashed border-line text-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>
              )}
              {p.images.length < 10 && (
                <button type="button" onClick={() => fileRef.current?.click()} className="flex aspect-[4/5] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gold-light bg-cream/50 text-xs text-gold-deep hover:bg-cream">
                  <ImagePlus className="h-5 w-5" /> Upload
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
            <div className="flex gap-2">
              <input className="a-input" placeholder="…or paste an image URL (https://…)" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} />
              <button type="button" className="a-btn-ghost shrink-0" onClick={() => { if (/^https:\/\//.test(imgUrl.trim())) { set("images", [...p.images, imgUrl.trim()]); setImgUrl(""); } else setError("Image URLs must start with https://"); }}>Add</button>
            </div>
            <p className="text-[11px] text-muted">JPEG, PNG or WEBP up to 8 MB. Best size: 1600 × 2000 px portrait (4:5). Without photos the storefront shows an illustrated placeholder.</p>
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
              <select required className="a-input" value={p.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
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
          </div>

          <div className="a-card space-y-4 p-5">
            <h2 className="font-serif text-xl font-semibold">Pricing & stock</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹)"><input required type="number" min={1} className="a-input" value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} /></Field>
              <Field label="MRP (₹)" hint="Optional — shows a discount"><input type="number" min={0} className="a-input" value={p.originalPrice ?? ""} onChange={(e) => set("originalPrice", e.target.value ? Number(e.target.value) : undefined)} /></Field>
            </div>
            <Field label="Stock quantity"><input required type="number" min={0} className="a-input" value={p.stock} onChange={(e) => set("stock", Math.max(0, Math.floor(Number(e.target.value))))} /></Field>
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
