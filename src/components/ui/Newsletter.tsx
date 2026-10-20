"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/client/api";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  return (
    <div className="border-b border-blush-border bg-blush-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 py-14 text-center md:flex-row md:justify-between md:px-10 md:text-left">
        <div>
          <p className="eyebrow !text-gold-deep">Join the family</p>
          <h3 className="mt-1 font-serif text-3xl font-light text-ink">Be first to know about new drops</h3>
          <p className="mt-1 text-[13px] text-muted">Festive launches, restocks and subscriber-only offers.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            showToast("Thank you for subscribing!");
            setEmail("");
          }}
          className="flex w-full max-w-md shadow-card"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border border-blush-border bg-ivory px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
          />
          <button className="btn-dark !px-7">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
