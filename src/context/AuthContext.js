"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "@/lib/api";

const SESSION_DURATION_MS = 86400 * 1000; // 24h

function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

function clearSession() {
  lsRemove("snl_user");
  lsRemove("snl_login_time");
  // snl_access_token et snl_refresh_token sont HttpOnly — effacés par POST /auth/logout
  document.cookie = "snl_user_role=; path=/; max-age=0";
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = lsGet("snl_user");
    const loginTime = parseInt(lsGet("snl_login_time") ?? "0", 10);
    const expired = !loginTime || Date.now() - loginTime > SESSION_DURATION_MS;

    if (stored && !expired) {
      try { setUser(JSON.parse(stored)); } catch {}
      // Valide silencieusement — cookie HttpOnly envoyé automatiquement
      authApi.getMe()
        .then(({ data }) => {
          const fresh = data?.data?.data ?? data?.data ?? data;
          if (fresh?.id) {
            setUser(fresh);
            lsSet("snl_user", JSON.stringify(fresh));
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401) {
            authApi.logout().catch(() => {});
            clearSession();
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      if (stored) {
        authApi.logout().catch(() => {});
        clearSession();
      }
      setLoading(false);
    }
  }, []);

  const saveSession = useCallback((raw) => {
    // Tokens dans cookies HttpOnly posés par le backend — on stocke seulement l'user
    const d = raw?.data ?? raw;
    const u = d?.user ?? d;
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookieOpts = `path=/; max-age=86400; SameSite=Lax${secure}`;
    lsSet("snl_user", JSON.stringify(u));
    lsSet("snl_login_time", String(Date.now()));
    document.cookie = `snl_user_role=${(u?.role ?? "user").toLowerCase()}; ${cookieOpts}`;
    setUser(u);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    const d = data?.data ?? data;
    if (d?.requiresTwoFactor || d?.twoFactorRequired || d?.mfaRequired) return data;
    saveSession(data);
    return data;
  }, [saveSession]);

  const verifyAndLogin = useCallback(async ({ code, tempToken }) => {
    const { data } = await authApi.verify2FA({ code, ...(tempToken ? { tempToken } : {}) });
    saveSession(data);
    return data;
  }, [saveSession]);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch {}
    clearSession();
    setUser(null);
  }, []);

  const loginWithOAuth = useCallback(async () => {
    // Cookie HttpOnly déjà posé par le backend via /auth/google/callback
    const { data } = await authApi.getMe();
    const u = data?.data?.data ?? data?.data ?? data;
    const secure = typeof window !== "undefined" && window.location.hostname !== "localhost" ? "; Secure" : "";
    lsSet("snl_user", JSON.stringify(u));
    lsSet("snl_login_time", String(Date.now()));
    document.cookie = `snl_user_role=${(u?.role ?? "user").toLowerCase()}; path=/; max-age=86400; SameSite=Lax${secure}`;
    setUser(u);
    return u;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      const u = data?.data?.data ?? data?.data ?? data;
      setUser(u);
      lsSet("snl_user", JSON.stringify(u));
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyAndLogin, register, logout, refreshUser, loginWithOAuth, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
