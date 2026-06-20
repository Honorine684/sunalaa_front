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
  lsRemove("snl_access_token");
  lsRemove("snl_refresh_token");
  lsRemove("snl_user");
  lsRemove("snl_login_time");
  document.cookie = "snl_access_token=; path=/; max-age=0";
  document.cookie = "snl_user_role=; path=/; max-age=0";
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount — expire after 24h, then refresh from API in background
  useEffect(() => {
    const stored = lsGet("snl_user");
    const token = lsGet("snl_access_token");
    const loginTime = parseInt(lsGet("snl_login_time") ?? "0", 10);
    const expired = !loginTime || Date.now() - loginTime > SESSION_DURATION_MS;
    if (stored && token && !expired) {
      try { setUser(JSON.parse(stored)); } catch {}
      // Refresh user data silently so stale localStorage fields (firstName, profileImage…) get updated
      authApi.getMe()
        .then(({ data }) => {
          const fresh = data?.data ?? data;
          console.log("[AuthContext] getMe() raw response:", JSON.stringify(data));
          console.log("[AuthContext] fresh user:", JSON.stringify(fresh));
          if (fresh?.id) {
            setUser(fresh);
            lsSet("snl_user", JSON.stringify(fresh));
          }
        })
        .catch((err) => { console.log("[AuthContext] getMe() error:", err?.response?.status, err?.message); })
        .finally(() => setLoading(false));
    } else {
      if (stored || token) clearSession();
      setLoading(false);
    }
  }, []);

  const saveSession = useCallback((raw) => {
    // API response: { success, data: { user, accessToken, refreshToken } }
    const d = raw?.data?.accessToken ? raw.data : (raw?.accessToken ? raw : raw?.data ?? raw);
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookieOpts = `path=/; max-age=86400; SameSite=Lax${secure}`;
    lsSet("snl_access_token", d.accessToken);
    lsSet("snl_refresh_token", d.refreshToken);
    lsSet("snl_user", JSON.stringify(d.user));
    lsSet("snl_login_time", String(Date.now()));
    document.cookie = `snl_access_token=${d.accessToken}; ${cookieOpts}`;
    document.cookie = `snl_user_role=${(d.user?.role ?? "user").toLowerCase()}; ${cookieOpts}`;
    setUser(d.user);
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await authApi.login(credentials);
    const d = data?.data ?? data;
    // 2FA required — don't save session yet, return as-is so the page can handle it
    if (d?.requiresTwoFactor || d?.twoFactorRequired || d?.mfaRequired) {
      return data;
    }
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

  const loginWithOAuth = useCallback(async ({ accessToken, refreshToken }) => {
    const isProduction = typeof window !== "undefined" && window.location.hostname !== "localhost";
    const cookieOpts = `path=/; max-age=86400; SameSite=Lax${isProduction ? "; Secure" : ""}`;
    lsSet("snl_access_token", accessToken);
    lsSet("snl_refresh_token", refreshToken);
    lsSet("snl_login_time", String(Date.now()));
    document.cookie = `snl_access_token=${accessToken}; ${cookieOpts}`;
    const { data } = await authApi.getMe();
    const user = data?.data ?? data;
    lsSet("snl_user", JSON.stringify(user));
    document.cookie = `snl_user_role=${(user?.role ?? "user").toLowerCase()}; ${cookieOpts}`;
    setUser(user);
    return user;
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      const user = data?.data ?? data;
      setUser(user);
      lsSet("snl_user", JSON.stringify(user));
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
