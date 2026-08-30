"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { useAuth, SESSION_DURATION_MS, SESSION_WARNING_MS } from "@/context/AuthContext";

const TEXT = {
  en: {
    title: "Your session is about to expire",
    desc: "You will be automatically logged out in 10 minutes. Save your work.",
    stay: "OK, got it",
    logout: "Log out now",
  },
  fr: {
    title: "Votre session va bientôt expirer",
    desc: "Vous serez automatiquement déconnecté dans 10 minutes. Sauvegardez votre travail.",
    stay: "OK, compris",
    logout: "Se déconnecter",
  },
};

function getLoginTime() {
  try { return parseInt(localStorage.getItem("snl_login_time") ?? "0", 10) || 0; }
  catch { return 0; }
}

export default function SessionWarning() {
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.en;
  const { isAuthenticated, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  function schedule() {
    clearTimeout(timerRef.current);
    const loginTime = getLoginTime();
    if (!loginTime) return;
    const expiresAt   = loginTime + SESSION_DURATION_MS;
    const warnAt      = expiresAt - SESSION_WARNING_MS;
    const delay       = warnAt - Date.now();
    if (delay <= 0) {
      setVisible(true);
    } else {
      timerRef.current = setTimeout(() => setVisible(true), delay);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) { setVisible(false); return; }
    schedule();
    return () => clearTimeout(timerRef.current);
  }, [isAuthenticated]);

  function handleStay() {
    setVisible(false);
  }

  async function handleLogout() {
    setVisible(false);
    await logout();
    window.location.href = locale === "fr" ? "/fr/login" : "/login";
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-6"
      style={{ filter: "drop-shadow(0 -4px 24px rgba(0,0,0,0.18))" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden border border-slate-100">
        <div className="h-1 w-full" style={{ backgroundColor: "#E6B84C" }} />
        <div className="px-5 pt-4 pb-5">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(230,184,76,0.10)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#E6B84C" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-[14px]" style={{ color: "#0F172B" }}>{t.title}</p>
              <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: "#64748B" }}>{t.desc}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 rounded-xl text-[13px] border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
            >
              {t.logout}
            </button>
            <button
              onClick={handleStay}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition cursor-pointer hover:brightness-90"
              style={{ backgroundColor: "#E6B84C" }}
            >
              {t.stay}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
