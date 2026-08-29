"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePromptSlot } from "@/context/PromptContext";

const DISMISS_KEY = "snl_pwa_install_dismissed";
const COOLDOWN_DAYS = 7;

const TEXT = {
  en: {
    title: "Install SUNALA",
    desc: "Quick access to your SNL points from your home screen.",
    install: "Install",
    later: "Not now",
  },
  fr: {
    title: "Installer SUNALA",
    desc: "Accédez rapidement à vos points SNL depuis votre écran d'accueil.",
    install: "Installer",
    later: "Plus tard",
  },
};

export default function PwaInstallPrompt() {
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.en;
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const allowed = usePromptSlot("install-android", visible);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw) {
        const { dismissedAt } = JSON.parse(raw);
        const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
        if (daysSince < COOLDOWN_DAYS) return;
      }
    } catch {}

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, JSON.stringify({ dismissedAt: Date.now() }));
    } catch {}
  }

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") setVisible(false);
    else dismiss();
  }

  if (!visible || !allowed) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6"
      style={{ filter: "drop-shadow(0 -4px 24px rgba(0,0,0,0.15))" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden border border-slate-100">
        <div className="h-1 w-full" style={{ backgroundColor: "#1F4E46" }} />
        <div className="px-5 pt-4 pb-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: "#1F4E46" }}>
                <img src="/icon-192.png" alt="SUNALA" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-[15px]" style={{ color: "#0F172B" }}>{t.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "#64748B" }}>{t.desc}</p>
              </div>
            </div>
            <button
              onClick={dismiss}
              className="text-slate-300 hover:text-slate-500 transition cursor-pointer shrink-0 ml-2 -mt-0.5"
              aria-label="Fermer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={dismiss}
              className="flex-1 py-2.5 rounded-xl text-[13px] border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
            >
              {t.later}
            </button>
            <button
              onClick={install}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white transition cursor-pointer hover:brightness-90"
              style={{ backgroundColor: "#1F4E46" }}
            >
              {t.install}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
