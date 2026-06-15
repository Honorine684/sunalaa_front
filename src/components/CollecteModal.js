"use client";

import { useEffect, useState } from "react";
import { usersApi, getApiError } from "@/lib/api";
import { useTranslations } from "next-intl";

function fmt(n) { return Number(n ?? 0).toLocaleString(); }

const CIRCLE_R = 72;
const CIRCLE_C = 2 * Math.PI * CIRCLE_R;

function pad(n) { return String(Math.floor(n)).padStart(2, "0"); }

function MiningDisplay({ nextCollect, onReady, t }) {
  const [mined, setMined] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!nextCollect) return;
    const nextTime = new Date(nextCollect).getTime();
    const lastTime = nextTime - 24 * 3_600_000;

    function tick() {
      const now = Date.now();
      const elapsed = now - lastTime;
      const pct = Math.min(100, (elapsed / (24 * 3_600_000)) * 100);
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
    <div className="w-full flex flex-col items-center gap-3" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "24px 20px" }}>
      <div className="flex items-center gap-2">
        {!isReady && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#E6B84C" }} />}
        <p className="text-[12px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
          {isReady ? t("mining_done") : t("mining_active")}
        </p>
      </div>

      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="90" cy="90" r={CIRCLE_R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="10" />
          <circle
            cx="90" cy="90" r={CIRCLE_R}
            fill="none"
            stroke={arcColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_C}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="font-black tabular-nums leading-none" style={{ fontSize: 30, color: arcColor }}>
            {Math.min(100, mined).toFixed(2)}
          </span>
          <span className="font-bold text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>SNL</span>
          {!isReady && (
            <span className="tabular-nums text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
              {pad(rh)}:{pad(rm)}:{pad(rs)}
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
        {isReady
          ? t("mining_sub_done")
          : `${t("mining_sub_active")} · ${pad(rh)}h ${pad(rm)}m ${pad(rs)}s`}
      </p>
    </div>
  );
}

export default function CollecteModal({ onClose, onCollected }) {
  const t = useTranslations("CollecteModal");
  const [state, setState]       = useState("checking");
  const [result, setResult]     = useState(null);
  const [nextCollect, setNext]  = useState(null);
  const [errMsg, setErrMsg]     = useState("");

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center relative w-[90vw] mx-4"
        style={{ maxWidth: 474, borderRadius: 40, padding: 20, gap: 20, backgroundColor: "#1F4E46" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition cursor-pointer"
          aria-label={t("close")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: 128, height: 128, borderRadius: "50%", background: "linear-gradient(135deg, #00BC7D, #00BBA7)" }}
        >
          {state === "success" ? (
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : state === "already" ? (
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5H12.5L13 2z" fill="white"/>
            </svg>
          )}
        </div>

        <div className="text-center flex flex-col gap-2">
          <h2 className="text-white font-bold text-[22px] leading-snug">
            {state === "success"
              ? t("title_success")
              : state === "already"
              ? t("title_already")
              : t("title_idle")}
          </h2>
          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            {state === "success"
              ? t("subtitle_success")
              : state === "already"
              ? t("subtitle_idle")
              : state === "error"
              ? errMsg
              : t("subtitle_idle")}
          </p>
        </div>

        {state === "checking" && (
          <div className="py-6 flex items-center justify-center">
            <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeDasharray="40 20"/>
            </svg>
          </div>
        )}

        {state === "already" && nextCollect && (
          <MiningDisplay nextCollect={nextCollect} onReady={() => setState("idle")} t={t} />
        )}

        {(state === "idle" || state === "success") && state !== "checking" && (
          <div className="w-full flex flex-col gap-3" style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 20px" }}>
            {state === "success" && result ? (
              <>
                <div className="flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#E5B858"/>
                    <path d="M12 6l1.5 4H18l-3.5 2.5 1.5 4L12 14l-4 2.5 1.5-4L6 10h4.5L12 6z" fill="white"/>
                  </svg>
                  <span className="font-black text-[28px] text-white leading-none">{fmt(result.amount ?? result.base ?? 100)}</span>
                  <span className="font-bold text-[16px]" style={{ color: "rgba(255,255,255,0.60)" }}>SNL</span>
                </div>
                <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}/>
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.60)" }}>{t("daily_collect")}</span>
                  <span className="text-white font-semibold">{fmt(result.amount ?? result.base ?? 100)} SNL</span>
                </div>
                <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}/>
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.60)" }}>{t("new_balance")}</span>
                  <span className="text-white font-semibold">{fmt(result.newBalance)} SNL</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#E5B858"/>
                    <path d="M12 6l1.5 4H18l-3.5 2.5 1.5 4L12 14l-4 2.5 1.5-4L6 10h4.5L12 6z" fill="white"/>
                  </svg>
                  <span className="font-black text-[28px] text-white leading-none">100</span>
                  <span className="font-bold text-[16px]" style={{ color: "rgba(255,255,255,0.60)" }}>SNL</span>
                </div>
                <div className="h-px w-full" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}/>
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.60)" }}>{t("base_reward")}</span>
                  <span className="text-white font-semibold">100 SNL</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span style={{ color: "rgba(255,255,255,0.60)" }}>{t("loyalty_bonus")}</span>
                  <span className="font-semibold" style={{ color: "#3FAE8C" }}>{t("loyalty_value")}</span>
                </div>
              </>
            )}
          </div>
        )}

        {state === "checking" ? null : state === "success" || state === "already" ? (
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-3 font-bold text-[16px] text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ height: 68, borderRadius: 14, background: "linear-gradient(135deg, #009966, #009689)", border: "none" }}
          >
            {state === "success" ? t("close") : t("understood")}
          </button>
        ) : state === "error" ? (
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-3 font-bold text-[16px] text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{ height: 68, borderRadius: 14, background: "linear-gradient(135deg, #009966, #009689)", border: "none" }}
          >
            {t("close")}
          </button>
        ) : (
          <button
            onClick={handleCollect}
            disabled={state === "loading"}
            className="w-full flex items-center justify-center gap-3 font-bold text-[16px] text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ height: 68, borderRadius: 14, background: "linear-gradient(135deg, #009966, #009689)", border: "none" }}
          >
            {state === "loading" ? (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L4.09 12.96A1 1 0 005 14.5h6.5L11 22l8.91-10.96A1 1 0 0019 9.5H12.5L13 2z" fill="white"/>
              </svg>
            )}
            {state === "loading" ? t("collecting") : t("collect_btn")}
          </button>
        )}

        <p className="text-center text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          {t("footer_tip")}
        </p>
      </div>
    </div>
  );
}
