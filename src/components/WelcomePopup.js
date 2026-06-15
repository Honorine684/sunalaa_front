"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { settingsApi } from "@/lib/api";

const FALLBACK_POINTS = 200;
const REPEAT_DELAY = 30_000;
const INITIAL_DELAY = 5_000;

function hasCollectedToday() {
  try {
    const nc = localStorage.getItem("snl_next_collect");
    return !!(nc && new Date(nc).getTime() > Date.now());
  } catch { return false; }
}

export default function WelcomePopup() {
  const t = useTranslations("WelcomePopup");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";

  const [visible, setVisible] = useState(false);
  const [points, setPoints] = useState(FALLBACK_POINTS);
  const timerRef = useRef(null);

  useEffect(() => {
    settingsApi.getPreLaunchStats()
      .then((res) => {
        const d = res?.data?.data ?? res?.data ?? {};
        const val = Number(d.bonusPoints ?? FALLBACK_POINTS);
        if (val > 0) setPoints(val);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!hasCollectedToday()) setVisible(true);
    }, INITIAL_DELAY);
    return () => clearTimeout(timerRef.current);
  }, []);

  function close() {
    setVisible(false);
    clearTimeout(timerRef.current);
    if (!hasCollectedToday()) {
      timerRef.current = setTimeout(() => {
        if (!hasCollectedToday()) setVisible(true);
      }, REPEAT_DELAY);
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#1F4E46" }}>

        {/* Close */}
        <button onClick={close}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition cursor-pointer z-10"
          aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Gold top bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: "#E6B84C" }} />

        <div className="px-8 py-8">
          {/* Badge */}
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5"
            style={{ backgroundColor: "rgba(230,184,76,0.15)", color: "#E6B84C" }}>
            {t("badge")}
          </span>

          <h2 className="text-white font-black text-[26px] leading-tight mb-3">
            {t("title")}
          </h2>
          <p className="text-white/70 text-[14px] leading-relaxed mb-2">
            {t("body1")}
          </p>
          <p className="text-white/70 text-[14px] leading-relaxed mb-6">
            {t("body2_before")}{" "}
            <strong className="text-gold">
              {t("body2_points", { points })}
            </strong>
            {t("body2_after")}
          </p>

          <Link
            href={`${prefix}/register`}
            onClick={close}
            className="flex items-center justify-between w-full rounded-full font-bold text-[15px] text-white px-6 py-4 hover:brightness-110 transition"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            {t("cta", { points })}
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>

          <button onClick={close}
            className="w-full text-center text-white/40 text-[12px] mt-4 hover:text-white/60 transition cursor-pointer">
            {t("dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
