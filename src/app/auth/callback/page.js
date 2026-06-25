"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { authApi } from "@/lib/api";

function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch {}
}

function ssGet(key) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function ssRemove(key) {
  try { sessionStorage.removeItem(key); } catch {}
}

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      window.location.replace("/login?error=oauth_no_code");
      return;
    }

    (async () => {
      try {
        // Backend a déjà posé les cookies HttpOnly via /auth/oauth/exchange
        const { data } = await authApi.exchangeOAuth(code);
        const tokenData = data?.data ?? data;

        const meRes = await authApi.getMe();
        const user = meRes.data?.data?.data ?? meRes.data?.data ?? meRes.data;

        const isProduction = window.location.hostname !== "localhost";
        const cookieOpts = `path=/; max-age=86400; SameSite=Lax${isProduction ? "; Secure" : ""}`;
        lsSet("snl_user", JSON.stringify(user));
        lsSet("snl_login_time", String(Date.now()));
        document.cookie = `snl_user_role=${(user?.role ?? "user").toLowerCase()}; ${cookieOpts}`;

        const locale = ssGet("snl_oauth_locale") ?? "en";
        ssRemove("snl_oauth_locale");

        const prefix = locale === "fr" ? "/fr" : "";
        const role = (user?.role ?? "user").toLowerCase();

        const isNewUser = tokenData.isNewUser === true || tokenData.newUser === true || user?.isUsernameSet === false;
        if (isNewUser && !role.includes("admin")) {
          try { sessionStorage.setItem("snl_needs_username_setup", "1"); } catch {}
          window.location.replace(`${prefix}/setup-username`);
          return;
        }

        const target = role.includes("admin") ? "/admin" : `${prefix}/profil`;
        window.location.replace(target);
      } catch {
        setStatus("error");
        setTimeout(() => window.location.replace("/login?error=oauth_failed"), 2500);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#1A4338] flex flex-col items-center justify-center px-4 gap-6">
      <Image
        src="/images/logo Sunaala.png"
        alt="SUNALA"
        width={120}
        height={32}
        className="object-contain"
        priority
      />

      {status === "loading" ? (
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-white/60" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-white/70 text-[14px]">Signing you in...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-white font-semibold">Authentication failed</p>
          <p className="text-white/50 text-[13px]">Redirecting you back to login...</p>
        </div>
      )}
    </div>
  );
}
