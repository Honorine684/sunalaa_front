"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Container from "./Container";
import { usersApi, getApiError } from "@/lib/api";
import { useTranslations } from "next-intl";

const CIRCLE_R = 56;
const CIRCLE_C = 2 * Math.PI * CIRCLE_R;

function pad(n) { return String(Math.floor(n)).padStart(2, "0"); }
function fmt(n) { return Number(n ?? 0).toLocaleString(); }

function MiningRing({ nextCollect, onReady }) {
  const [mined, setMined] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!nextCollect) return;
    const nextTime = new Date(nextCollect).getTime();
    const lastTime = nextTime - 24 * 3_600_000;

    function tick() {
      const now = Date.now();
      const pct = Math.min(100, ((now - lastTime) / (24 * 3_600_000)) * 100);
      setMined(pct);
      setRemaining(Math.max(0, nextTime - now));
      if (pct >= 100 && onReady) onReady();
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextCollect, onReady]);

  const isReady = mined >= 100;
  const offset = CIRCLE_C * (1 - mined / 100);
  const arcColor = isReady ? "#3FAE8C" : "#E6B84C";
  const rh = remaining / 3_600_000;
  const rm = (remaining % 3_600_000) / 60_000;
  const rs = (remaining % 60_000) / 1_000;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Status label */}
      <div className="flex items-center gap-2">
        {!isReady && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#E6B84C" }} />}
        <p className="text-[11px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
          {isReady ? "Ready to collect" : "Mining in progress"}
        </p>
      </div>

      {/* Circle */}
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={CIRCLE_R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="8" />
          <circle
            cx="70" cy="70" r={CIRCLE_R}
            fill="none"
            stroke={arcColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_C}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-black tabular-nums leading-none text-[24px]" style={{ color: arcColor }}>
            {Math.min(100, mined).toFixed(2)}
          </span>
          <span className="font-bold text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>SNL</span>
          {!isReady && (
            <span className="tabular-nums text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {pad(rh)}:{pad(rm)}:{pad(rs)}
            </span>
          )}
        </div>
      </div>

      {!isReady && (
        <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
          Come back in {pad(rh)}h {pad(rm)}m to collect
        </p>
      )}
    </div>
  );
}

export default function HomeHero({ onCollected }) {
  const t = useTranslations("CollecteModal");
  const [state, setState]      = useState("checking");
  const [result, setResult]    = useState(null);
  const [nextCollect, setNext] = useState(null);
  const [errMsg, setErrMsg]    = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("snl_next_collect");
    if (stored && new Date(stored).getTime() > Date.now()) {
      setNext(stored);
      setState("already");
      return;
    }
    usersApi.collectStatus()
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (data?.collectedToday) {
          const nc = data.nextCollect ?? new Date(Date.now() + 24 * 3_600_000).toISOString();
          setNext(nc);
          localStorage.setItem("snl_next_collect", nc);
          setState("already");
        } else {
          setState("idle");
        }
      })
      .catch(() => setState("idle"));
  }, []);

  async function handleCollect() {
    setState("loading");
    try {
      const res  = await usersApi.collect();
      const data = res.data?.data ?? res.data;
      const nc   = data.nextCollect ?? new Date(Date.now() + 24 * 3_600_000).toISOString();
      setResult(data);
      setNext(nc);
      localStorage.setItem("snl_next_collect", nc);
      setState("success");
      onCollected?.(data.newBalance);
    } catch (err) {
      const msg  = getApiError(err);
      const body = err?.response?.data?.data ?? err?.response?.data ?? {};
      if (err?.response?.status === 400) {
        setErrMsg(msg);
        const nc = body.nextCollect ?? new Date(Date.now() + 24 * 3_600_000).toISOString();
        setNext(nc);
        localStorage.setItem("snl_next_collect", nc);
        setState("already");
      } else {
        setErrMsg(msg);
        setState("error");
      }
    }
  }

  const handleReady = useCallback(() => setState("idle"), []);

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a] min-h-screen lg:min-h-[90vh]">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/image 2.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,78,70,0.65)" }} />
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center pt-24 pb-16 gap-5 sm:gap-6">

        {/* Title */}
        <h1 className="text-[24px] sm:text-[36px] lg:text-[52px] font-bold text-white leading-[1.15]">
          Welcome to the<br />
          <span className="text-secondary">SUNALA</span> community
        </h1>

        {/* Paragraph — tight under title */}
        <p className="text-[14px] sm:text-[16px] max-w-md mx-auto leading-[1.6]" style={{ color: "rgba(255,255,255,0.65)" }}>
          Every day, your engagement brings you closer to more rewards.
          Keep collecting, progressing and growing with the community.
        </p>

        {/* Collect widget — inline */}
        <div
          className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 mt-2"
          style={{
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 24,
            padding: "28px 24px",
          }}
        >
          {/* Checking */}
          {state === "checking" && (
            <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeDasharray="40 20"/>
            </svg>
          )}

          {/* Already collected → mining ring */}
          {state === "already" && nextCollect && (
            <MiningRing nextCollect={nextCollect} onReady={handleReady} />
          )}

          {/* Success */}
          {state === "success" && result && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00BC7D, #00BBA7)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white font-bold text-[18px]">{t("title_success")}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-[32px] text-white">{fmt(result.amount ?? result.base ?? 100)}</span>
                <span className="text-[14px] font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>SNL</span>
              </div>
              <div className="w-full flex justify-between text-[13px] pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.10)" }}>
                <span style={{ color: "rgba(255,255,255,0.55)" }}>New balance</span>
                <span className="text-white font-semibold">{fmt(result.newBalance)} SNL</span>
              </div>
            </div>
          )}

          {/* Idle → collect button */}
          {(state === "idle" || state === "error") && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-[36px] text-white leading-none">100</span>
                  <span className="font-bold text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>SNL</span>
                </div>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>Daily reward</p>
              </div>

              {state === "error" && errMsg && (
                <p className="text-[12px] text-center" style={{ color: "#FF6B6B" }}>{errMsg}</p>
              )}

              <button
                onClick={handleCollect}
                disabled={state === "loading"}
                className="w-full flex items-center justify-center gap-2 font-bold text-[15px] text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ height: 52, borderRadius: 14, background: "linear-gradient(135deg, #009966, #009689)" }}
              >
                {state === "loading" ? (
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5H12.5L13 2z" fill="white"/>
                  </svg>
                )}
                {state === "loading" ? t("collecting") : t("collect_btn")}
              </button>
            </div>
          )}

          <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.30)" }}>
            {t("footer_tip")}
          </p>
        </div>
      </Container>
    </section>
  );
}
