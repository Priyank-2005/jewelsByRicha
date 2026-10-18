"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";

interface Addr {
  id: string;
  name: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  pincode: string;
}
const KEY = "jbr_addresses_v1";
const EMPTY = { name: "", phone: "", line: "", city: "", state: "", pincode: "" };
const FIELDS = [["name", "Full name"], ["phone", "Phone"], ["line", "Address"], ["city", "City"], ["state", "State"], ["pincode", "PIN code"]] as const;

export default function AddressesPage() {
  const [list, setList] = useState<Addr[]>([]);
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState(EMPTY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem(KEY);
      if (r) setList(JSON.parse(r));
    } catch {}
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) localStorage.setItem(KEY, JSON.stringify(list));
  }, [list, mounted]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setList((l) => [...l, { id: String(Date.now()), ...f }]);
    setF(EMPTY);
    setAdding(false);
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
            <button className="btn-dark">Save address</button>
            <button type="button" onClick={() => setAdding(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}
      {list.length === 0 && !adding ? (
        <div className="border border-dashed border-line p-12 text-center text-muted">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-gold-mid" strokeWidth={1.2} />
          No saved addresses yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <div key={a.id} className="relative border border-line bg-white p-5 text-sm">
              <div className="font-medium">{a.name}</div>
              <div className="text-muted">{a.line}, {a.city}, {a.state} – {a.pincode}</div>
              <div className="text-muted">{a.phone}</div>
              <button onClick={() => setList((l) => l.filter((x) => x.id !== a.id))} aria-label="Delete" className="absolute right-4 top-4 text-muted hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
