"use client";

import { useState } from "react";
import { Clock, Mail, Phone } from "lucide-react";
import { Instagram } from "@/components/ui/InstagramIcon";
import { PolicyLayout } from "@/components/ui/PolicyLayout";
import { useToast } from "@/context/ToastContext";
import { useCatalog } from "@/context/CatalogContext";
import { api } from "@/lib/client/api";

export default function ContactPage() {
  const { showToast } = useToast();
  const { settings } = useCatalog();
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ name: "", email: "", message: "" });

  return (
    <PolicyLayout eyebrow="We'd love to hear from you" title="Contact us" intro="Questions about an order or a piece? Drop us a line.">
      <div className="!mt-0 grid gap-10 md:grid-cols-2">
        <ul className="space-y-5 [&_li]:ml-0 [&_li]:list-none">
          <li className="flex gap-3"><Mail className="h-5 w-5 text-gold" /> {settings.contactEmail}</li>
          <li className="flex gap-3"><Phone className="h-5 w-5 text-gold" /> {settings.contactPhone}</li>
          <li className="flex gap-3"><Instagram className="h-5 w-5 text-gold" /> @{settings.instagram}</li>
          <li className="flex gap-3"><Clock className="h-5 w-5 text-gold" /> {settings.businessHours}</li>
        </ul>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              await api("/api/contact", { method: "POST", body: f });
              showToast("Message sent — we'll reply soon");
              setF({ name: "", email: "", message: "" });
            } catch (err) {
              showToast(err instanceof Error ? err.message : "Could not send your message");
            } finally {
              setBusy(false);
            }
          }}
          className="space-y-4"
        >
          <input required placeholder="Your name" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input required type="email" placeholder="Email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <textarea required minLength={5} rows={5} placeholder="How can we help?" className="input" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
          <button disabled={busy} className="btn-dark">{busy ? "Sending…" : "Send message"}</button>
        </form>
      </div>
    </PolicyLayout>
  );
}
