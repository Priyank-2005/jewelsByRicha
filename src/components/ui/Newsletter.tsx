"use client";

import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  return (
    <div className="border-b border-ivory/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center md:flex-row md:justify-between md:px-8 md:text-left">
        <div>
          <p className="eyebrow">Join the family</p>
          <h3 className="mt-1 font-serif text-3xl text-ivory">Be first to know about new drops</h3>
          <p className="text-sm text-ivory/60">Festive launches, restocks and subscriber-only offers.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            showToast("Thank you for subscribing!");
            setEmail("");
          }}
          className="flex w-full max-w-md"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory outline-none placeholder:text-ivory/40 focus:border-gold"
          />
          <button className="btn-gold !px-6">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
