"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "@/lib/api";

function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = lsGet("snl_user");
    const token = lsGet("snl_access_token");
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const saveSession = useCallback((raw) => {
    // API response: { success, data: { user, accessToken, refreshToken } }
    const d = raw?.data?.accessToken ? raw.data : (raw?.accessToken ? raw : raw?.data ?? raw);
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookieOpts = `path=/; max-age=86400; SameSite=Lax${secure}`;
    lsSet("snl_access_token", d.accessToken);
    lsSet("snl_refresh_token", d.refreshToken);
    lsSet("snl_user", JSON.stringify(d.user));
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
    lsRemove("snl_access_token");
    lsRemove("snl_refresh_token");
    lsRemove("snl_user");
    document.cookie = "snl_access_token=; path=/; max-age=0";
    document.cookie = "snl_user_role=; path=/; max-age=0";
    setUser(null);
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
    <AuthContext.Provider value={{ user, loading, login, verifyAndLogin, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
