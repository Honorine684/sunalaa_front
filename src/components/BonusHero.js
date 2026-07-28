"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Container from "./Container";
import { usersApi, getApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
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

// deadline = when the claim window fully closes (e.g. 27h after last claim)
// phase "wait"  → still in the 24h lock period → show wait countdown in button
// phase "claim" → 3h claim window is open      → show claim btn + 3h countdown below
// phase "expired" / null → claim immediately
const CLAIM_WINDOW_MS = 3 * 3600 * 1000;

function pad(n) { return String(n).padStart(2, "0"); }
function hms(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function useStreakPhase(deadline) {
  const [state, setState] = useState({ phase: "none", waitRemaining: "", claimRemaining: "" });

  useEffect(() => {
    if (!deadline) { setState({ phase: "none", waitRemaining: "", claimRemaining: "" }); return; }

    function tick() {
      const diff = new Date(deadline) - Date.now();
      if (diff <= 0) {
        setState({ phase: "expired", waitRemaining: "", claimRemaining: "" });
      } else if (diff > CLAIM_WINDOW_MS) {
        setState({ phase: "wait", waitRemaining: hms(diff - CLAIM_WINDOW_MS), claimRemaining: "" });
      } else {
        setState({ phase: "claim", waitRemaining: "", claimRemaining: hms(diff) });
      }
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return state;
}

export default function BonusHero() {
  const t = useTranslations("BonusHero");
  const { isAuthenticated } = useAuth();
  const [streak, setStreak]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [claiming, setClaiming]   = useState(false);
  const [claimResult, setResult]  = useState(null);
  const [err, setErr]             = useState("");

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    usersApi.getStreak()
      .then((res) => setStreak(res.data?.data ?? res.data))
      .catch(() => setStreak(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function handleClaim() {
    setClaiming(true); setErr("");
    try {
      const res  = await usersApi.claimStreak();
      const data = res.data?.data ?? res.data;
      setResult(data);
      setStreak((prev) => prev ? {
        ...prev,
        currentDay: data.nextDay ?? (prev.currentDay < 7 ? prev.currentDay + 1 : 1),
        todayClaimed: true,
        nextClaimDeadline: data.nextClaimDeadline ?? prev.nextClaimDeadline,
      } : prev);
    } catch (e) {
      setErr(getApiError(e));
    } finally {
      setClaiming(false);
    }
  }

  const currentDay        = streak?.currentDay ?? 1;
  const todayClaimed      = streak?.todayClaimed ?? false;
  const nextClaimDeadline = streak?.nextClaimDeadline ?? null;
  const { phase, waitRemaining, claimRemaining } = useStreakPhase(todayClaimed ? nextClaimDeadline : null);

  const prevPhaseRef = useRef("wait");
  useEffect(() => {
    // 24h lock ends → 3h window opens: refetch so day cards update
    if (phase === "claim" && prevPhaseRef.current === "wait") {
      usersApi.getStreak()
        .then((res) => setStreak(res.data?.data ?? res.data))
        .catch(() => {});
    }
    // 3h window closes without claiming → streak reset: refetch → Day 1
    if (phase === "expired" && prevPhaseRef.current === "claim") {
      usersApi.getStreak()
        .then((res) => setStreak(res.data?.data ?? res.data))
        .catch(() => {});
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  return (
    <section className="relative flex items-center justify-center bg-[#0d2e2a] lg:min-h-180">
      <div className="absolute inset-0">
        <Image src="/images/image 2.png" alt="" fill className="object-cover opacity-30" priority />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,78,70,0.65)" }} />
      </div>

      <Container className="relative z-10 pt-8 pb-16 lg:pt-16 lg:pb-24 text-center">
        <h1 className="text-white text-[22px] lg:text-[64px] font-bold leading-none mb-3 lg:mb-4" style={{ fontFamily: "Rubik, sans-serif" }}>
          {t("title_1")}{" "}
          <span style={{ color: "#3FAE8C" }}>{t("title_amount")}</span>
          <br />
          {t("title_2")}
        </h1>

        <p className="text-[13px] lg:text-[15px] mb-6 lg:mb-12 whitespace-pre-line" style={{ color: "rgba(255,255,255,0.60)" }}>
          {t("subtitle")}
        </p>

        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3 lg:gap-4">
          {STREAK_DAYS.map(({ day, snl }) => {
            const isClaimed  = day < currentDay;
            const isToday    = day === currentDay && !todayClaimed;
            const isWaiting  = day === currentDay && todayClaimed;
            const isLocked   = day > currentDay;

            return (
              <div key={day} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div
                  className={[
                    "flex flex-col items-center justify-center gap-1.5 sm:gap-2 w-11 sm:w-20 lg:w-25 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl transition-all duration-200 border-2",
                    isToday    ? "bg-gold border-gold shadow-[0_4px_20px_rgba(230,184,76,0.4)]" : "",
                    isClaimed  ? "border-secondary bg-[#0d1f1c]" : "",
                    isWaiting  ? "border-secondary/40 bg-[#0d1f1c] opacity-70" : "",
                    isLocked   ? "border-white/20 bg-[#0d1f1c] opacity-50" : "",
                  ].join(" ")}
                >
                  {isClaimed ? (
                    <div className="flex items-center justify-center w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-secondary">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  ) : (
                    <div className={`relative ${isToday ? "w-7 h-7 sm:w-11 sm:h-11 lg:w-14 lg:h-14" : "w-6 h-6 sm:w-9 sm:h-9 lg:w-12 lg:h-12"}`}>
                      <Image src="/images/4.png" alt="coins" fill className="object-contain" />
                    </div>
                  )}
                  <span className="text-[13px] sm:text-[18px] lg:text-[22px] font-bold leading-none text-white">
                    {snl}
                  </span>
                </div>
                <span className="text-white text-[10px] sm:text-[13px] lg:text-[14px] font-normal leading-[150%]">{t("day", { n: day })}</span>
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

        <div className="flex flex-col items-center gap-3 mt-10">
          {loading ? (
            <div className="flex items-center gap-2 text-white/60 text-[15px]">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20"/>
              </svg>
              {t("loading")}
            </div>
          ) : phase === "wait" ? (
            /* 24h lock — disabled button with countdown */
            <button
              disabled
              className="flex flex-col items-center bg-secondary text-white font-bold px-8 py-3 lg:px-16 lg:py-5 rounded-full opacity-80 cursor-default"
            >
              <span className="text-[11px] lg:text-[13px] font-normal opacity-80">{t("claimed")}</span>
              <span className="text-[18px] lg:text-[22px] tabular-nums tracking-widest leading-tight">{waitRemaining || "—:——:——"}</span>
            </button>
          ) : phase === "claim" ? (
            /* 3h window is open — big countdown at bottom + claim button */
            <>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="bg-gold text-white font-bold text-[14px] lg:text-[16px] px-8 py-3 lg:px-16 lg:py-5 rounded-full hover:brightness-110 transition cursor-pointer shadow-lg disabled:opacity-60"
              >
                {claiming ? t("claiming") : t("claim_btn", { snl: STREAK_DAYS[(currentDay - 1) % 7]?.snl ?? 10 })}
              </button>
              <div className="flex flex-col items-center gap-1 mt-2">
                <p className="text-[12px] lg:text-[13px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                  {t("next_bonus_in")}
                </p>
                <span className="text-white font-bold text-[30px] lg:text-[38px] tabular-nums tracking-widest leading-none">
                  {claimRemaining || "—:——:——"}
                </span>
              </div>
            </>
          ) : (
            /* expired or not yet claimed */
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="bg-gold text-white font-bold text-[14px] lg:text-[16px] px-8 py-3 lg:px-16 lg:py-5 rounded-full hover:brightness-110 transition cursor-pointer shadow-lg disabled:opacity-60"
            >
              {claiming ? t("claiming") : t("claim_btn", { snl: STREAK_DAYS[(currentDay - 1) % 7]?.snl ?? 10 })}
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
