"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Droplets, Gem, Gift, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { HERO } from "@/data/images";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [f, setF] = useState({ name: "", email: "", password: "", otp: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "register" && step === "form") return setStep("otp");
    login(f.email, f.name || undefined);
    router.push("/account");
  };

  return (
    <div className="grid min-h-[calc(100svh-6rem)] lg:grid-cols-2">
      {/* photo panel */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.necklace} alt="" className="absolute inset-0 h-full w-full object-cover object-[62%_50%] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-ivory">
          <p className="eyebrow !text-gold-light">Jewels by Richa</p>
          <h2 className="mt-3 font-serif text-5xl font-light leading-tight">Your jewellery box,<br /><span className="font-script text-gold-mid">always with you</span></h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 text-sm text-ivory/80">
            {[[ShieldCheck, "Track every order"], [Gift, "Save your favourites"], [Gem, "Faster checkout"], [Droplets, "Exclusive early access"]].map(([Icon, t]) => {
              const I = Icon as typeof ShieldCheck;
              return <li key={t as string} className="flex items-center gap-2"><I className="h-4 w-4 text-gold-mid" />{t as string}</li>;
            })}
          </ul>
        </div>
      </div>

      {/* form */}
      <div className="flex items-center justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Image src="/logo.png" alt="" width={72} height={72} className="mx-auto rounded-full lg:hidden" />
            <p className="eyebrow mt-4 lg:mt-0">{mode === "login" ? "Welcome back" : "Join the family"}</p>
            <h1 className="mt-2 font-serif text-4xl font-light md:text-5xl">{mode === "login" ? "Sign in" : "Create account"}</h1>
            <p className="mt-2 text-sm text-muted">{mode === "login" ? "Track orders and save your favourites." : "Faster checkout and exclusive offers."}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 border border-line bg-cream p-1 text-xs font-medium uppercase tracking-[0.18em]">
            {(["login", "register"] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setMode(m); setStep("form"); }} className={`py-2.5 transition-colors ${mode === m ? "bg-ink text-ivory" : "text-muted hover:text-ink"}`}>
                {m === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {step === "form" ? (
              <>
                {mode === "register" && <label className="block"><span className="label">Full name</span><input required className="input" value={f.name} onChange={set("name")} autoComplete="name" /></label>}
                <label className="block"><span className="label">Email</span><input required type="email" className="input" value={f.email} onChange={set("email")} autoComplete="email" /></label>
                <label className="block"><span className="label">Password</span><input required minLength={6} type="password" className="input" value={f.password} onChange={set("password")} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
              </>
            ) : (
              <label className="block">
                <span className="label">Enter the 6-digit code sent to {f.email}</span>
                <input required inputMode="numeric" maxLength={6} className="input text-center text-xl tracking-[0.5em]" value={f.otp} onChange={set("otp")} />
                <span className="mt-2 block text-xs text-muted">Demo: any 6 digits will work.</span>
              </label>
            )}
            <button className="btn-dark w-full !py-4">{mode === "login" ? "Sign in" : step === "form" ? "Send verification code" : "Verify & create account"}</button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.</p>
        </div>
      </div>
    </div>
  );
}
