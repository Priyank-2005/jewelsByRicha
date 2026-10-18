"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";
import { useToast } from "@/context/ToastContext";
import { EmptyRow, Field, Modal, PageHeader, Toggle } from "@/components/admin/ui";
import type { Coupon } from "@/data/admin";
import { formatPrice } from "@/lib/utils";

const BLANK: Coupon = { id: "", code: "", description: "", type: "PERCENT", value: 10, minOrder: 0, usedCount: 0, expiresAt: "2026-12-31", active: true, codAllowed: true };

export default function AdminCoupons() {
  const { coupons, saveCoupon, deleteCoupon } = useCatalog();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Coupon | null>(null);
  const isExisting = editing && coupons.some((c) => c.id === editing.id);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const code = editing.code.trim().toUpperCase();
    if (coupons.some((c) => c.code === code && c.id !== editing.id)) return showToast("A coupon with this code already exists");
    saveCoupon({ ...editing, code });
    showToast("Coupon saved");
    setEditing(null);
  };

  const num = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <div>
      <PageHeader title="Coupons" subtitle="Discount codes customers can apply at checkout" actions={<button className="a-btn-dark" onClick={() => setEditing({ ...BLANK, id: `cp${Date.now()}` })}><Plus className="h-4 w-4" /> New coupon</button>} />

      <ul className="space-y-3 md:hidden">
        {coupons.map((c) => (
          <li key={c.id} className="a-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded border border-dashed border-gold bg-cream px-2 py-0.5 font-mono text-xs font-semibold tracking-wider text-gold-deep">{c.code}</span>
                <div className="mt-2 text-sm">{c.description}</div>
              </div>
              <Toggle checked={c.active} onChange={(v) => saveCoupon({ ...c, active: v })} label={`Toggle ${c.code}`} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <span><b className="text-ink">{c.type === "PERCENT" ? `${c.value}%` : formatPrice(c.value)}</b> off</span>
              <span>Min {c.minOrder ? formatPrice(c.minOrder) : "—"}</span>
              <span>Used {c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ""}</span>
              <span>Exp {c.expiresAt}</span>
            </div>
            <div className="mt-3 flex justify-end gap-1 border-t border-line pt-3">
              <button onClick={() => setEditing(c)} className="a-btn-ghost !py-1.5"><Pencil className="h-3.5 w-3.5" /> Edit</button>
              <button onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) { deleteCoupon(c.id); showToast("Coupon deleted"); } }} className="a-btn-ghost !py-1.5 text-red-700"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="a-card hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px]">
          <thead className="bg-cream/60"><tr><th className="a-th">Code</th><th className="a-th">Discount</th><th className="a-th">Min. order</th><th className="a-th">Usage</th><th className="a-th">Expires</th><th className="a-th">Active</th><th className="a-th text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {coupons.length === 0 && <EmptyRow cols={7} text="No coupons yet." />}
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-cream/40">
                <td className="a-td"><span className="rounded border border-dashed border-gold bg-cream px-2 py-0.5 font-mono text-xs font-semibold tracking-wider text-gold-deep">{c.code}</span><div className="mt-1 text-xs text-muted">{c.description}</div></td>
                <td className="a-td">{c.type === "PERCENT" ? `${c.value}%` : formatPrice(c.value)}{c.maxDiscount && <div className="text-xs text-muted">up to {formatPrice(c.maxDiscount)}</div>}</td>
                <td className="a-td">{c.minOrder ? formatPrice(c.minOrder) : "—"}</td>
                <td className="a-td">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="a-td text-muted">{c.expiresAt}</td>
                <td className="a-td"><Toggle checked={c.active} onChange={(v) => saveCoupon({ ...c, active: v })} label={`Toggle ${c.code}`} /></td>
                <td className="a-td">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditing(c)} className="rounded-md p-2 text-muted hover:bg-cream hover:text-ink" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) { deleteCoupon(c.id); showToast("Coupon deleted"); } }} className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-700" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isExisting ? "Edit coupon" : "New coupon"} wide>
        {editing && (
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <Field label="Code"><input required className="a-input font-mono uppercase" value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} /></Field>
            <Field label="Expires on"><input required type="date" className="a-input" value={editing.expiresAt} onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value })} /></Field>
            <div className="sm:col-span-2"><Field label="Description (shown to customer)"><input className="a-input" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field></div>
            <Field label="Discount type">
              <select className="a-input" value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as Coupon["type"] })}>
                <option value="PERCENT">Percentage (%)</option><option value="FLAT">Flat amount (₹)</option>
              </select>
            </Field>
            <Field label={editing.type === "PERCENT" ? "Percent off" : "Amount off (₹)"}><input required type="number" min={1} className="a-input" value={editing.value} onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })} /></Field>
            <Field label="Minimum order (₹)"><input type="number" min={0} className="a-input" value={editing.minOrder} onChange={(e) => setEditing({ ...editing, minOrder: Number(e.target.value) })} /></Field>
            <Field label="Max discount (₹)" hint="Optional cap for % coupons"><input type="number" min={0} className="a-input" value={editing.maxDiscount ?? ""} onChange={(e) => setEditing({ ...editing, maxDiscount: num(e.target.value) })} /></Field>
            <Field label="Usage limit" hint="Leave blank for unlimited"><input type="number" min={0} className="a-input" value={editing.usageLimit ?? ""} onChange={(e) => setEditing({ ...editing, usageLimit: num(e.target.value) })} /></Field>
            <div className="flex flex-col justify-end gap-3 pb-1 text-sm">
              <div className="flex items-center justify-between">Active<Toggle checked={editing.active} onChange={(v) => setEditing({ ...editing, active: v })} label="Active" /></div>
              <div className="flex items-center justify-between">Valid on COD orders<Toggle checked={editing.codAllowed} onChange={(v) => setEditing({ ...editing, codAllowed: v })} label="COD allowed" /></div>
            </div>
            <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="a-btn-ghost" onClick={() => setEditing(null)}>Cancel</button><button className="a-btn-dark">Save coupon</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}
