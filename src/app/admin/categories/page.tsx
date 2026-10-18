"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { Field, Modal, PageHeader, Toggle } from "@/components/admin/ui";
import { slugify } from "@/lib/utils";
import type { ArtKind, Category } from "@/data/catalog";

const KINDS: ArtKind[] = ["watch", "necklace", "chain-necklace", "pendant", "mangalsutra", "combo", "bangle", "bracelet", "chain-bracelet", "ring", "hoop", "stud", "drop"];

export default function AdminCategories() {
  const { categories, collections, products, saveCategory, deleteCategory } = useCatalog();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Category | null>(null);

  const startNew = (collectionId: string) =>
    setEditing({ id: `cat-${Date.now()}`, name: "", slug: "", collectionId, kind: "ring", description: "", active: true, sortOrder: categories.filter((c) => c.collectionId === collectionId).length + 1 });

  const count = (id: string) => products.filter((p) => p.categoryId === id).length;

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const slug = editing.slug || slugify(editing.name);
    if (categories.some((c) => c.slug === slug && c.id !== editing.id)) return showToast("That slug is already in use");
    saveCategory({ ...editing, slug });
    showToast("Category saved");
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Categories" subtitle="Collections group your categories — the storefront menu is built from this" />

      <div className="space-y-8">
        {collections.map((col) => (
          <section key={col.id} className="a-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-cream/60 p-5">
              <div>
                <h2 className="font-serif text-2xl font-semibold">{col.name}</h2>
                <p className="text-xs text-muted">{col.tagline}</p>
              </div>
              <button onClick={() => startNew(col.id)} className="a-btn-dark"><Plus className="h-4 w-4" /> Add category</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead><tr><th className="a-th w-14">Order</th><th className="a-th">Name</th><th className="a-th">URL</th><th className="a-th">Products</th><th className="a-th">Visible</th><th className="a-th text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {categories.filter((c) => c.collectionId === col.id).sort((a, b) => a.sortOrder - b.sortOrder).map((c) => (
                    <tr key={c.id} className="hover:bg-cream/40">
                      <td className="a-td text-muted">{c.sortOrder}</td>
                      <td className="a-td font-medium">{c.name}</td>
                      <td className="a-td text-muted">/collections/{col.slug}/{c.slug}</td>
                      <td className="a-td">{count(c.id)}</td>
                      <td className="a-td"><Toggle checked={c.active} onChange={(v) => saveCategory({ ...c, active: v })} label={`Show ${c.name}`} /></td>
                      <td className="a-td">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setEditing(c)} className="rounded-md p-2 text-muted hover:bg-cream hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                          <button
                            onClick={() => {
                              if (count(c.id) > 0) return showToast(`Move or delete its ${count(c.id)} products first`);
                              if (confirm(`Delete category “${c.name}”?`)) { deleteCategory(c.id); showToast("Category deleted"); }
                            }}
                            className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" aria-label="Delete"
                          ><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing && categories.some((c) => c.id === editing.id) ? "Edit category" : "New category"}>
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Collection">
              <select className="a-input" value={editing.collectionId} onChange={(e) => setEditing({ ...editing, collectionId: e.target.value })}>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Name"><input required className="a-input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="URL slug" hint="Leave blank to generate from the name"><input className="a-input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} placeholder={slugify(editing.name)} /></Field>
            <Field label="Description"><textarea rows={2} className="a-input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Illustration" hint="Placeholder art style">
                <select className="a-input" value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value as ArtKind })}>
                  {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Sort order"><input type="number" min={1} className="a-input" value={editing.sortOrder} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} /></Field>
            </div>
            <div className="flex justify-end gap-2 pt-2"><button type="button" className="a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button className="a-btn-dark">Save category</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}
