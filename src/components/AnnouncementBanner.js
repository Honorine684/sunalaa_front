"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { settingsApi } from "@/lib/api";

const FALLBACK = { bonusPoints: 500, spotsRemaining: 5000, maxMembers: 5000 };

// Formatage simple sans Intl.NumberFormat pour compatibilité maximale
function fmtNum(n) {
  return String(Math.max(0, Math.floor(n))).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default function AnnouncementBanner() {
  const t = useTranslations("AnnouncementBanner");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";
  const [visible, setVisible] = useState(true);
  const [stats, setStats] = useState(FALLBACK);

  useEffect(() => {
    settingsApi.getPreLaunchStats()
      .then((res) => {
        const d = res?.data?.data ?? res?.data ?? {};
        setStats({
          bonusPoints: Number(d.bonusPoints) || FALLBACK.bonusPoints,
          spotsRemaining: Number(d.spotsRemaining) || FALLBACK.spotsRemaining,
          maxMembers: Number(d.maxMembers) || FALLBACK.maxMembers,
        });
      })
      .catch(() => {});
  }, []);

  if (!visible) return null;

  return (
    <div
      className="relative z-50 w-full flex items-center justify-center gap-3 px-4 py-2.5 text-center"
      style={{ backgroundColor: "#E6B84C" }}
    >
      <span className="text-[13px] sm:text-[14px] font-semibold text-[#1A3A34] leading-snug">
        {t("text", { maxMembers: fmtNum(stats.maxMembers), points: fmtNum(stats.bonusPoints) })}{" "}
        <span className="font-bold">{t("spots", { count: fmtNum(stats.spotsRemaining) })}</span>{" "}—{" "}
        <Link href={`${prefix}/register`} className="underline underline-offset-2 hover:opacity-80 transition whitespace-nowrap">
          {t("cta")}
        </Link>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A3A34]/60 hover:text-[#1A3A34] transition cursor-pointer"
        aria-label={t("close")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
