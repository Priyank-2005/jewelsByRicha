"use client";

/** Mock customer auth (localStorage). Swap for server sessions per BACKEND_PLAN.md. */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  ready: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const KEY = "jbr_user_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const login = useCallback((email: string, name?: string) => {
    const fallback = email.split("@")[0].replace(/[._]/g, " ");
    persist({ email, name: name || fallback.replace(/\b\w/g, (c) => c.toUpperCase()) });
  }, []);
  const logout = useCallback(() => persist(null), []);
  const updateProfile = useCallback((u: Partial<User>) => setUser((prev) => {
    if (!prev) return prev;
    const next = { ...prev, ...u };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }), []);

  return <AuthContext.Provider value={{ user, ready, login, logout, updateProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
