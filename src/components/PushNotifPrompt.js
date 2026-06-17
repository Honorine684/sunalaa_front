"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const DISMISSED_KEY = "snl_push_prompt_dismissed";
const DELAY_MS = 12000; // 12s après le chargement

const TEXT = {
  en: {
    title: "Stay in the loop",
    desc: "Get notified when you earn SNL points, when a referral joins, or when there's a new mission.",
    cta: "Enable notifications",
    skip: "Maybe later",
    granted: "Notifications enabled!",
    denied: "Notifications blocked — enable them in your browser settings.",
  },
  fr: {
    title: "Restez informé",
    desc: "Recevez des alertes quand vous gagnez des points SNL, quand un filleul s'inscrit ou qu'une nouvelle mission est disponible.",
    cta: "Activer les notifications",
    skip: "Plus tard",
    granted: "Notifications activées !",
    denied: "Notifications bloquées — activez-les dans les paramètres de votre navigateur.",
  },
};

export default function PushNotifPrompt() {
  const locale = useLocale();
  const { isAuthenticated } = useAuth();
  const { supported, permission, subscribed, loading, subscribe } = usePushNotifications();
  const t = TEXT[locale] ?? TEXT.en;

  const [visible, setVisible]   = useState(false);
  const [feedback, setFeedback] = useState(null); // null | "granted" | "denied"

  useEffect(() => {
    if (!isAuthenticated || !supported) return;
    if (permission === "granted" || subscribed) return;
    if (permission === "denied") return;

    try {
      if (localStorage.getItem(DISMISSED_KEY)) return;
    } catch {}

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [isAuthenticated, supported, permission, subscribed]);

  function dismiss() {
    try { localStorage.setItem(DISMISSED_KEY, "1"); } catch {}
    setVisible(false);
  }

  async function handleEnable() {
    const result = await subscribe();
    if (result.ok) {
      setFeedback("granted");
      setTimeout(() => { setVisible(false); }, 2500);
    } else if (result.reason === "denied") {
      setFeedback("denied");
    } else {
      dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
      style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.18))" }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden border border-slate-100"
      >
        {/* Barre colorée top */}
        <div className="h-1 w-full" style={{ backgroundColor: "#1F4E46" }} />

        <div className="px-5 py-4 flex gap-4 items-start">
          {/* Icône */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(31,78,70,0.1)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#1F4E46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Texte */}
          <div className="flex-1 min-w-0">
            {feedback === "granted" ? (
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[14px] font-semibold" style={{ color: "#065F46" }}>{t.granted}</p>
              </div>
            ) : feedback === "denied" ? (
              <p className="text-[13px]" style={{ color: "#94A3B8" }}>{t.denied}</p>
            ) : (
              <>
                <p className="text-[14px] font-bold mb-0.5" style={{ color: "#0F172B" }}>{t.title}</p>
                <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#64748B" }}>{t.desc}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleEnable}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl text-white text-[13px] font-semibold transition hover:brightness-90 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#1F4E46" }}
                  >
                    {loading && (
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                    )}
                    {t.cta}
                  </button>
                  <button
                    onClick={dismiss}
                    className="px-4 py-2.5 rounded-xl text-[13px] border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {t.skip}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Fermer */}
          {!feedback && (
            <button
              onClick={dismiss}
              className="text-slate-300 hover:text-slate-500 transition cursor-pointer shrink-0 -mt-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
