"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, usersApi } from "@/lib/api";

const SESSION_DURATION_MS = 5 * 3600 * 1000; // 5h

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1").replace("/api/v1", "");

function normalizeUser(u) {
  if (!u) return u;
  const raw = u.profileImage ?? u.avatar ?? null;
  const profileImage = raw && !raw.startsWith("http") ? `${API_ORIGIN}${raw}` : raw;
  return profileImage ? { ...u, profileImage } : u;
}

function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

function authLog(event, detail = {}) {
  try {
    const logs = JSON.parse(localStorage.getItem("snl_auth_log") || "[]");
    logs.push({ t: new Date().toISOString(), event, ...detail });
    if (logs.length > 50) logs.splice(0, logs.length - 50);
    localStorage.setItem("snl_auth_log", JSON.stringify(logs));
  } catch {}
}

function clearSession() {
  lsRemove("snl_user");
  lsRemove("snl_login_time");
  // Nettoyage tokens stales (ancienne version pré-HttpOnly)
  lsRemove("snl_access_token");
  lsRemove("snl_refresh_token");
  document.cookie = "snl_user_role=; path=/; max-age=0";
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    // Purge tokens stales de l'ancienne version pré-HttpOnly
    lsRemove("snl_access_token");
    lsRemove("snl_refresh_token");

    const stored = lsGet("snl_user");
    const loginTime = parseInt(lsGet("snl_login_time") ?? "0", 10);
    const elapsed = loginTime ? Date.now() - loginTime : null;
    const expired = !loginTime || elapsed > SESSION_DURATION_MS;

    authLog("mount", {
      hasStored: !!stored,
      loginTime: loginTime ? new Date(loginTime).toISOString() : null,
      elapsedMin: elapsed ? Math.round(elapsed / 60000) : null,
      expired,
      cookies: document.cookie ? document.cookie.split(";").map((c) => c.trim().split("=")[0]) : [],
    });

    if (stored && !expired) {
      try { setUser(normalizeUser(JSON.parse(stored))); } catch {}
      // Valide silencieusement — cookie HttpOnly envoyé automatiquement
      authApi.getMe()
        .then(({ data }) => {
          const fresh = normalizeUser(data?.data?.data ?? data?.data ?? data);
          if (fresh?.id) {
            const st = (fresh.status ?? "").toLowerCase();
            if (st === "banned" || st === "suspended") {
              authLog("logout_banned_or_suspended", { status: st });
              authApi.logout().catch(() => {});
              clearSession();
              setUser(null);
              if (typeof window !== "undefined") window.location.href = "/login?reason=" + st;
              return;
            }
            setUser(fresh);
            lsSet("snl_user", JSON.stringify(fresh));
          }
        })
        .catch((err) => {
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            authLog("logout_getme_401");
            authApi.logout().catch(() => {});
            clearSession();
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      if (stored) {
        authLog("logout_session_expired", { elapsedMin: elapsed ? Math.round(elapsed / 60000) : null });
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
    const cookieOpts = `path=/; max-age=18000; SameSite=Lax${secure}`;
    const norm = normalizeUser(u);
    lsSet("snl_user", JSON.stringify(norm));
    lsSet("snl_login_time", String(Date.now()));
    document.cookie = `snl_user_role=${(norm?.role ?? "user").toLowerCase()}; ${cookieOpts}`;
    setUser(norm);
    // Sync locale préférence avec le backend (pour les notifications push)
    if (typeof window !== "undefined") {
      const locale = window.location.pathname.startsWith("/fr") ? "fr" : "en";
      usersApi.updateLocale(locale).catch(() => {});
    }
  }, []);

  const login = useCallback(async (credentials) => {
    authLog("login_attempt");
    const { data } = await authApi.login(credentials);
    const d = data?.data ?? data;
    if (d?.requiresTwoFactor || d?.twoFactorRequired || d?.mfaRequired) return data;
    saveSession(data);
    authLog("login_success", {
      cookies: typeof document !== "undefined"
        ? document.cookie.split(";").map((c) => c.trim().split("=")[0]).filter(Boolean)
        : [],
    });
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
    const u = normalizeUser(data?.data?.data ?? data?.data ?? data);
    const secure = typeof window !== "undefined" && window.location.hostname !== "localhost" ? "; Secure" : "";
    lsSet("snl_user", JSON.stringify(u));
    lsSet("snl_login_time", String(Date.now()));
    document.cookie = `snl_user_role=${(u?.role ?? "user").toLowerCase()}; path=/; max-age=18000; SameSite=Lax${secure}`;
    setUser(u);
    return u;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      const u = normalizeUser(data?.data?.data ?? data?.data ?? data);
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
