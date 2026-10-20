"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [f, setF] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [busy, setBusy] = useState(false);
  return (
    <div className="max-w-lg">
      <h2 className="mb-6 font-serif text-3xl">Profile</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await updateProfile(f);
            showToast("Profile updated");
          } catch (err) {
            showToast(err instanceof Error ? err.message : "Could not update your profile");
          } finally {
            setBusy(false);
          }
        }}
        className="space-y-4 border border-line bg-white p-6"
      >
        <label className="block"><span className="label">Full name</span><input required minLength={2} className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="block"><span className="label">Email</span><input className="input opacity-60" disabled value={user?.email ?? ""} /></label>
        <label className="block"><span className="label">Phone</span><input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <button disabled={busy} className="btn-dark">Save changes</button>
      </form>
    </div>
  );
}
