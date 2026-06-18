"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "./Container";
import { usersApi, getApiError } from "@/lib/api";
import { useTranslations } from "next-intl";

const STREAK_DAYS = [
  { day: 1, snl: 10  },
  { day: 2, snl: 20  },
  { day: 3, snl: 30  },
  { day: 4, snl: 40  },
  { day: 5, snl: 50  },
  { day: 6, snl: 70  },
  { day: 7, snl: 80  },
];

export default function BonusHero() {
  const t = useTranslations("BonusHero");
  const [streak, setStreak]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [claiming, setClaiming]   = useState(false);
  const [claimResult, setResult]  = useState(null);
  const [err, setErr]             = useState("");

  useEffect(() => {
    usersApi.getStreak()
      .then((res) => setStreak(res.data?.data ?? res.data))
      .catch(() => setStreak(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleClaim() {
    setClaiming(true); setErr("");
    try {
      const res  = await usersApi.claimStreak();
      const data = res.data?.data ?? res.data;
      setResult(data);
      setStreak((prev) => prev ? { ...prev, currentDay: data.nextDay ?? (prev.currentDay < 7 ? prev.currentDay + 1 : 1), todayClaimed: true } : prev);
    } catch (e) {
      setErr(getApiError(e));
    } finally {
      setClaiming(false);
    }
  }

  const currentDay    = streak?.currentDay ?? 1;
  const todayClaimed  = streak?.todayClaimed ?? false;

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a] min-h-120 lg:min-h-180">
      <div className="absolute inset-0">
        <Image src="/images/image 2.png" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,78,70,0.65)" }} />
      </div>

      <Container className="relative z-10 pt-16 pb-20 text-center">
        <h1 className="text-white text-[32px] lg:text-[64px] font-bold leading-none mb-4" style={{ fontFamily: "Rubik, sans-serif" }}>
          {t("title_1")}{" "}
          <span style={{ color: "#3FAE8C" }}>{t("title_amount")}</span>
          <br />
          {t("title_2")}
        </h1>

        <p className="text-[15px] mb-12 whitespace-pre-line" style={{ color: "rgba(255,255,255,0.60)" }}>
          {t("subtitle")}
        </p>

        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          {STREAK_DAYS.map(({ day, snl }) => {
            const isClaimed  = day < currentDay;
            const isToday    = day === currentDay && !todayClaimed;
            const isWaiting  = day === currentDay && todayClaimed;
            const isLocked   = day > currentDay;

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <div
                  className={[
                    "flex flex-col items-center justify-center gap-2 w-25 py-5 rounded-2xl transition-all duration-200 border-2",
                    isToday    ? "bg-gold border-gold shadow-[0_4px_20px_rgba(230,184,76,0.4)]" : "",
                    isClaimed  ? "border-secondary bg-[#0d1f1c]" : "",
                    isWaiting  ? "border-secondary/40 bg-[#0d1f1c] opacity-70" : "",
                    isLocked   ? "border-white/20 bg-[#0d1f1c] opacity-50" : "",
                  ].join(" ")}
                >
                  {isClaimed ? (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className={`relative ${isToday ? "w-14 h-14" : "w-12 h-12"}`}>
                      <Image src="/images/4.png" alt="coins" fill className="object-contain" />
                    </div>
                  )}
                  <span className="text-[22px] font-bold leading-none text-white">
                    {snl}
                  </span>
                </div>
                <span className="text-white text-[14px] font-normal leading-[150%]">{t("day", { n: day })}</span>
              </div>
            );
          })}
        </div>

        {claimResult && (
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full text-[14px] font-semibold" style={{ backgroundColor: "rgba(63,174,140,0.20)", color: "#3FAE8C" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t("claim_success", { bonus: claimResult.bonus, balance: Number(claimResult.newBalance).toLocaleString() })}
          </div>
        )}

        {err && (
          <p className="mt-4 text-[13px]" style={{ color: "#F87171" }}>{err}</p>
        )}

        <div className="flex justify-center mt-10">
          {loading ? (
            <div className="flex items-center gap-2 text-white/60 text-[15px]">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20"/>
              </svg>
              {t("loading")}
            </div>
          ) : todayClaimed ? (
            <button
              disabled
              className="bg-secondary text-white font-bold text-[16px] px-16 py-5 rounded-4xl opacity-70 cursor-default"
            >
              {t("claimed")}
            </button>
          ) : (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="bg-gold text-white font-bold text-[16px] px-16 py-5 rounded-4xl hover:brightness-110 transition cursor-pointer shadow-lg disabled:opacity-60"
            >
              {claiming ? t("claiming") : t("claim_btn", { snl: STREAK_DAYS[(currentDay - 1) % 7]?.snl ?? 10 })}
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
