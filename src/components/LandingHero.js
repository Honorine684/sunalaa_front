"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import LaunchCountdown from "./LaunchCountdown";
import { useAuth } from "@/context/AuthContext";

function fmtMembers(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, "0")}`;
  return n.toLocaleString("en-US");
}

function fmtPoints(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k+`;
  return `${n}+`;
}

export default function LandingHero() {
  const t = useTranslations("LandingHero");
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [liveStats, setLiveStats] = useState({ members: null, totalPoints: null });

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    fetch("/api/platform-stats")
      .then((r) => r.json())
      .then((d) => setLiveStats(d))
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#1F4E46" }}>
      <Image src="/images/Group.png" alt="" aria-hidden="true" width={160} height={360} loading="lazy"
        className="absolute select-none pointer-events-none hidden lg:block"
        style={{ opacity: 0.75, left: 160, top: 535 }} />
      <Image src="/images/Group.png" alt="" aria-hidden="true" width={280} height={420} loading="lazy"
        className="absolute select-none pointer-events-none hidden lg:block"
        style={{ opacity: 0.75, right: -40, bottom: -220 }} />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-10 lg:pt-16 pb-20 lg:pb-40">
          <div className="relative z-10 text-center lg:text-left">
            <h1 className="font-black text-[32px] sm:text-[44px] lg:text-[64px] text-white leading-none mb-6">
              {t("h1_1")}<br />
              <span style={{ color: "#3FAE8C" }}>SUNALA</span><br />{t("h1_2")}
            </h1>
            <p className="text-[16px] mb-10 leading-relaxed max-w-md mx-auto lg:mx-0" style={{ color: "rgba(255,255,255,0.70)" }}>
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              {mounted && user ? (
                <Link href={`${prefix}/bonus`}
                  className="inline-flex items-center gap-6 rounded-full font-bold text-[16px] text-white pl-6 pr-4 py-4 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#3FAE8C" }}>
                  {locale === "fr" ? "Accumuler plus" : "Earn more"}
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              ) : (
                <Link href={`${prefix}/login`}
                  className="inline-flex items-center gap-6 rounded-full font-bold text-[16px] text-white pl-6 pr-4 py-4 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#3FAE8C" }}>
                  {t("cta_primary")}
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              )}
              <Link href={`${prefix}/snl`}
                className="inline-flex items-center gap-2 rounded-full font-semibold text-[15px] text-white px-6 py-4 transition-all hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.35)" }}>
                {t("cta_secondary")}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <LaunchCountdown />
          </div>

          <div className="relative hidden lg:block mt-6">
            <Image src="/images/Group 164.png" alt="SUNALA coin" width={500} height={500}
              priority sizes="(max-width: 1024px) 0px, 50vw"
              style={{ objectFit: "contain", width: "100%", height: "auto" }} />

            <div className="absolute bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4"
              style={{ top: "18%", left: "-40px", minWidth: 230 }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 36, lineHeight: "40px", fontWeight: 700, color: "#000000" }}>{fmtMembers(liveStats.members) ?? "—"}</div>
                <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "rgba(0,0,0,0.50)" }}>{t("stat_members")}</div>
              </div>
            </div>

            <div className="absolute bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4"
              style={{ bottom: "-6%", left: "50%", transform: "translateX(-50%)", minWidth: 250 }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="5"/><circle cx="16" cy="15" r="5"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-2xl leading-none" style={{ color: "#0F172B" }}>{fmtPoints(liveStats.totalPoints) ?? "—"}</div>
                <div className="text-sm text-slate-500 mt-1">{t("stat_points")}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-6 sm:gap-4 pb-14 lg:pb-20 mb-10 lg:mb-20 relative z-10 lg:-mt-21.25">
          {[
            { label: t("trust_free"), icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> },
            { label: t("trust_no_invest"), icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            { label: t("trust_community"), icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
          ].map(({ label, icon }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                {icon}
              </div>
              <span className="font-bold text-[16px] lg:text-[30px] text-white">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-8 left-0 w-full h-32 bg-white"
        style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%, 32% 100%)" }} />
    </section>
  );
}
