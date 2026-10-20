"use client";

import { useState } from "react";
import { CheckCircle2, CircleSlash } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import { Field, PageHeader, Toggle } from "@/components/admin/ui";
import type { StoreSettings } from "@/types/shop";

export default function AdminSettings() {
  const { settings, saveSettings, integrations } = useAdmin();
  const { showToast } = useToast();
  const [s, setS] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof StoreSettings>(k: K, v: StoreSettings[K]) => setS((x) => ({ ...x, [k]: v }));
  const num = (v: string) => Math.max(0, Math.floor(Number(v) || 0));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveSettings({ ...s, instagram: s.instagram.replace(/^@/, "") });
      showToast("Settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  const services = [
    { name: "Razorpay payments", on: integrations.razorpay, hint: "Add RAZORPAY_KEY_ID / KEY_SECRET to go live. Until then online payments run in a test (mock) mode — never use that on the live site." },
    { name: "Cloudinary image storage", on: integrations.cloudinary, hint: "Add CLOUDINARY_* keys. Without them photos are saved on the server's disk (fine for local use only)." },
    { name: "Order & OTP emails (SMTP)", on: integrations.email, hint: "Add SMTP_* settings. Without them emails are only printed in the server log." },
  ];

  return (
    <form onSubmit={submit}>
      <PageHeader title="Settings" subtitle="Shipping, payment and contact details used across the store" actions={<button disabled={saving} className="a-btn-dark">{saving ? "Saving…" : "Save settings"}</button>} />
      {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="a-card space-y-4 p-5">
          <h2 className="font-serif text-xl font-semibold">Shipping &amp; payments</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Free shipping above (₹)" hint="Set 0 to always ship free"><input type="number" min={0} className="a-input" value={s.freeShippingThreshold} onChange={(e) => set("freeShippingThreshold", num(e.target.value))} /></Field>
            <Field label="Shipping fee below that (₹)"><input type="number" min={0} className="a-input" value={s.shippingFee} onChange={(e) => set("shippingFee", num(e.target.value))} /></Field>
            <Field label="COD handling fee (₹)"><input type="number" min={0} className="a-input" value={s.codFee} onChange={(e) => set("codFee", num(e.target.value))} /></Field>
            <Field label="Low-stock alert at"><input type="number" min={0} className="a-input" value={s.lowStockThreshold} onChange={(e) => set("lowStockThreshold", num(e.target.value))} /></Field>
          </div>
          <div className="flex items-center justify-between text-sm">Offer Cash on Delivery<Toggle checked={s.codEnabled} onChange={(v) => set("codEnabled", v)} label="Cash on delivery" /></div>
        </div>

        <div className="a-card space-y-4 p-5">
          <h2 className="font-serif text-xl font-semibold">Store contact</h2>
          <Field label="Customer care email" hint="Contact-form messages and order emails use this"><input required type="email" className="a-input" value={s.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} /></Field>
          <Field label="Customer care phone"><input required className="a-input" value={s.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} /></Field>
          <Field label="Business hours"><input className="a-input" value={s.businessHours} onChange={(e) => set("businessHours", e.target.value)} /></Field>
          <Field label="Instagram handle" hint="Without the @"><input className="a-input" value={s.instagram} onChange={(e) => set("instagram", e.target.value.replace(/^@/, ""))} /></Field>
        </div>

        <div className="a-card p-5 lg:col-span-2">
          <h2 className="mb-3 font-serif text-xl font-semibold">Connected services</h2>
          <ul className="divide-y divide-line">
            {services.map((x) => (
              <li key={x.name} className="flex items-start gap-3 py-3 text-sm">
                {x.on ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> : <CircleSlash className="mt-0.5 h-5 w-5 shrink-0 text-muted" />}
                <div><div className="font-medium">{x.name} <span className={x.on ? "text-emerald-700" : "text-muted"}>— {x.on ? "connected" : "not connected"}</span></div>{!x.on && <div className="text-xs text-muted">{x.hint}</div>}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
}
