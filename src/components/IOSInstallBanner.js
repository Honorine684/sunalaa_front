"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

const DAILY_KEY = "snl_ios_install_daily";
const MAX_PER_DAY = 4;
const DELAY_MS = 4000;

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function getDailyCount() {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    return date === todayStr() ? (count ?? 0) : 0;
  } catch { return 0; }
}

function incrementDailyCount() {
  try {
    const count = getDailyCount();
    localStorage.setItem(DAILY_KEY, JSON.stringify({ date: todayStr(), count: count + 1 }));
  } catch {}
}

const TEXT = {
  en: {
    title: "Install SUNALA",
    desc: "Add the app to your home screen for quick access to your SNL points.",
    step1: "Tap the",
    step1b: "Share button",
    step1c: "at the bottom of your browser",
    step2: 'Select "Add to Home Screen"',
    later: "Not now",
  },
  fr: {
    title: "Installer SUNALA",
    desc: "Ajoutez l'app sur votre écran d'accueil pour accéder rapidement à vos points SNL.",
    step1: "Appuyez sur le",
    step1b: "bouton Partager",
    step1c: "en bas de votre navigateur",
    step2: 'Sélectionnez "Sur l\'écran d\'accueil"',
    later: "Plus tard",
  },
};

export default function IOSInstallBanner() {
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.en;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone === true;
    const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(navigator.userAgent);

    if (!isIOS || isStandalone || !isSafari) return;
    if (getDailyCount() >= MAX_PER_DAY) return;

    const timer = setTimeout(() => {
      incrementDailyCount();
      setVisible(true);
    }, DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6"
      style={{ filter: "drop-shadow(0 -4px 24px rgba(0,0,0,0.15))" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden border border-slate-100">
        {/* Top bar */}
        <div className="h-1 w-full" style={{ backgroundColor: "#1F4E46" }} />

        <div className="px-5 pt-4 pb-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* App icon */}
              <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: "#1F4E46" }}>
                <img src="/icon-192.png" alt="SUNALA" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-[15px]" style={{ color: "#0F172B" }}>{t.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "#64748B" }}>{t.desc}</p>
              </div>
            </div>
            <button onClick={dismiss} className="text-slate-300 hover:text-slate-500 transition cursor-pointer shrink-0 ml-2 -mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2.5 my-4 px-1">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ backgroundColor: "#1F4E46" }}>1</span>
              <p className="text-[13px]" style={{ color: "#0F172B" }}>
                {t.step1}{" "}
                <span className="font-semibold" style={{ color: "#1F4E46" }}>{t.step1b}</span>
                {" "}{t.step1c}
              </p>
              {/* iOS Share icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" style={{ color: "#007AFF" }}>
                <path d="M8.59 5.42L12 2l3.41 3.42M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 8H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ backgroundColor: "#1F4E46" }}>2</span>
              <p className="text-[13px]" style={{ color: "#0F172B" }}>
                {t.step2}
              </p>
              {/* Plus icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0" style={{ color: "#007AFF" }}>
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Arrow indicator pointing down */}
          <div className="flex items-center justify-center gap-1.5 mt-1 mb-3">
            <div className="h-px flex-1" style={{ backgroundColor: "#E2E8F0" }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#94A3B8" }}>
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: "#E2E8F0" }} />
          </div>

          <button
            onClick={dismiss}
            className="w-full py-2.5 rounded-xl text-[13px] border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer"
          >
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
}
