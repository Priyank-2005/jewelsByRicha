"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import type { SavedAddress } from "@/types/shop";
import { api } from "@/lib/client/api";
import { useToast } from "@/context/ToastContext";

const EMPTY = { name: "", phone: "", line: "", city: "", state: "", pincode: "" };
const FIELDS = [["name", "Full name"], ["phone", "Phone"], ["line", "Address"], ["city", "City"], ["state", "State"], ["pincode", "PIN code"]] as const;

export default function AddressesPage() {
  const [list, setList] = useState<SavedAddress[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => {
    api<{ addresses: SavedAddress[] }>("/api/account/addresses").then((r) => setList(r.addresses)).catch(() => setList([]));
  }, []);
  useEffect(load, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/account/addresses", { method: "POST", body: f });
      setF(EMPTY);
      setAdding(false);
      load();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not save the address");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await api(`/api/account/addresses/${id}`, { method: "DELETE" }).catch(() => {});
    load();
  };
  const makeDefault = async (a: SavedAddress) => {
    await api(`/api/account/addresses/${a.id}`, { method: "PUT", body: { ...a, isDefault: true } }).catch(() => {});
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-3xl">Saved addresses</h2>
        <button onClick={() => setAdding(true)} className="btn-outline !px-4 !py-2"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {adding && (
        <form onSubmit={save} className="mb-6 grid gap-4 border border-line bg-white p-5 sm:grid-cols-2">
          {FIELDS.map(([k, l]) => (
            <label key={k} className={k === "line" ? "sm:col-span-2" : ""}>
              <span className="label">{l}</span>
              <input required className="input" value={f[k]} onChange={(e) => setF((p) => ({ ...p, [k]: e.target.value }))} />
            </label>
          ))}
          <div className="flex gap-3 sm:col-span-2">
            <button disabled={busy} className="btn-dark">Save address</button>
            <button type="button" onClick={() => setAdding(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}
      {list && list.length === 0 && !adding ? (
        <div className="border border-dashed border-line p-12 text-center text-muted">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-gold-mid" strokeWidth={1.2} />
          No saved addresses yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(list ?? []).map((a) => (
            <div key={a.id} className="relative border border-line bg-white p-5 text-sm">
              <div className="font-medium">{a.name} {a.isDefault && <span className="ml-1 rounded-full bg-cream px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold-deep">Default</span>}</div>
              <div className="text-muted">{a.line}, {a.city}, {a.state} – {a.pincode}</div>
              <div className="text-muted">{a.phone}</div>
              {!a.isDefault && <button onClick={() => makeDefault(a)} className="mt-3 text-xs text-gold-deep underline">Make default</button>}
              <button onClick={() => remove(a.id)} aria-label="Delete" className="absolute right-4 top-4 text-muted hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
