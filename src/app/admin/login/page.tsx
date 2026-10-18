"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@jewelsbyricha.in");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try { localStorage.setItem("jbr_admin_v1", "1"); } catch {}
          router.push("/admin");
        }}
        className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-lift"
      >
        <Image src="/logo.png" alt="Jewels by Richa" width={88} height={88} className="mx-auto rounded-full" />
        <h1 className="mt-4 text-center font-serif text-3xl">Admin sign in</h1>
        <p className="mb-6 text-center text-xs text-muted">Demo mode — any password works. Real authentication arrives with the backend.</p>
        <label className="mb-4 block"><span className="label">Email</span><input className="a-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="mb-6 block"><span className="label">Password</span><input className="a-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></label>
        <button className="a-btn-dark w-full !py-2.5">Sign in</button>
      </form>
    </div>
  );
}
