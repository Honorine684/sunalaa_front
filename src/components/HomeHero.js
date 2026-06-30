"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Container from "./Container";
import { usersApi, getApiError } from "@/lib/api";
import { useTranslations } from "next-intl";

const CIRCLE_R = 46;
const CIRCLE_C = 2 * Math.PI * CIRCLE_R;

function pad(n) { return String(Math.floor(n)).padStart(2, "0"); }
function fmt(n) { return Number(n ?? 0).toLocaleString(); }

function MiningRing({ nextCollect, onReady, t }) {
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
          {isReady ? t("mining_ready") : t("mining_active")}
        </p>
      </div>

      {/* Circle */}
      <div className="relative flex items-center justify-center" style={{ width: 112, height: 112 }}>
        <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="56" cy="56" r={CIRCLE_R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="7" />
          <circle
            cx="56" cy="56" r={CIRCLE_R}
            fill="none"
            stroke={arcColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_C}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-black tabular-nums leading-none text-[20px]" style={{ color: arcColor }}>
            {Math.min(100, mined).toFixed(2)}
          </span>
          <span className="font-bold text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>SNL</span>
          {!isReady && (
            <span className="tabular-nums text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {pad(rh)}:{pad(rm)}:{pad(rs)}
            </span>
          )}
        </div>
      </div>

      {!isReady && (
        <p className="text-[11px] text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
          {t("mining_come_back", { h: pad(rh), m: pad(rm) })}
        </p>
      )}
    </div>
  );
}

const COINS = [
  { x: "3%",  size: 30, op: 0.55, dur: 9,  del: 0   },
  { x: "10%", size: 20, op: 0.4,  dur: 11, del: 2.3 },
  { x: "17%", size: 38, op: 0.65, dur: 8,  del: 4.7 },
  { x: "24%", size: 18, op: 0.35, dur: 13, del: 1.1 },
  { x: "31%", size: 26, op: 0.5,  dur: 10, del: 6.2 },
  { x: "38%", size: 34, op: 0.6,  dur: 7,  del: 3.4 },
  { x: "45%", size: 16, op: 0.4,  dur: 12, del: 8.1 },
  { x: "52%", size: 28, op: 0.55, dur: 9,  del: 0.6 },
  { x: "59%", size: 22, op: 0.45, dur: 11, del: 5.3 },
  { x: "66%", size: 40, op: 0.7,  dur: 8,  del: 2.8 },
  { x: "73%", size: 18, op: 0.4,  dur: 14, del: 7.5 },
  { x: "80%", size: 32, op: 0.6,  dur: 10, del: 1.9 },
  { x: "87%", size: 24, op: 0.5,  dur: 9,  del: 4.1 },
  { x: "93%", size: 20, op: 0.45, dur: 12, del: 6.8 },
  { x: "7%",  size: 36, op: 0.5,  dur: 11, del: 9.2 },
  { x: "20%", size: 22, op: 0.55, dur: 8,  del: 3.7 },
  { x: "42%", size: 16, op: 0.35, dur: 13, del: 7   },
  { x: "63%", size: 30, op: 0.6,  dur: 10, del: 0.3 },
  { x: "76%", size: 20, op: 0.45, dur: 9,  del: 5.6 },
  { x: "96%", size: 26, op: 0.5,  dur: 11, del: 2   },
];

export default function HomeHero({ onCollected }) {
  const t = useTranslations("CollecteModal");
  const [state, setState]      = useState("checking");
  const [result, setResult]    = useState(null);
  const [nextCollect, setNext] = useState(null);
  const [errMsg, setErrMsg]    = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snl_next_collect");
      if (stored && new Date(stored).getTime() > Date.now()) {
        setNext(stored);
        setState("already");
        return;
      }
    } catch {}
    usersApi.collectStatus()
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (data?.collectedToday) {
          const nc = data.nextCollect ?? new Date(Date.now() + 24 * 3_600_000).toISOString();
          setNext(nc);
          try { localStorage.setItem("snl_next_collect", nc); } catch {}
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
      try { localStorage.setItem("snl_next_collect", nc); } catch {}
      setState("success");
      onCollected?.(data.newBalance);
    } catch (err) {
      const msg  = getApiError(err);
      const body = err?.response?.data?.data ?? err?.response?.data ?? {};
      if (err?.response?.status === 400) {
        setErrMsg(msg);
        const nc = body.nextCollect ?? new Date(Date.now() + 24 * 3_600_000).toISOString();
        setNext(nc);
        try { localStorage.setItem("snl_next_collect", nc); } catch {}
        setState("already");
      } else {
        setErrMsg(msg);
        setState("error");
      }
    }
  }

  const handleReady = useCallback(() => setState("idle"), []);

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a]">
      <style>{`
        @keyframes collectFall {
          0%   { transform: translateY(-50px) rotate(0deg);    opacity: 0; }
          8%   { opacity: var(--coin-op); }
          92%  { opacity: var(--coin-op); }
          100% { transform: translateY(600px) rotate(540deg); opacity: 0; }
        }
      `}</style>

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

      {/* Falling coins */}
      {COINS.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: 0,
            width: c.size,
            height: c.size,
            "--coin-op": c.op,
            animation: `collectFall ${c.dur}s ${c.del}s linear infinite`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <svg viewBox="0 0 40 40" width={c.size} height={c.size} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id={`cg${i}`} cx="36%" cy="32%" r="65%">
                <stop offset="0%" stopColor="#F7DC78" />
                <stop offset="55%" stopColor="#E6B84C" />
                <stop offset="100%" stopColor="#B8882A" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="19" fill={`url(#cg${i})`} />
            <circle cx="20" cy="20" r="15.5" fill="none" stroke="#C99A2E" strokeWidth="1.2" opacity="0.6" />
            <text x="20" y="24" textAnchor="middle" fontSize="8.5" fontWeight="800" fontFamily="Arial, sans-serif" fill="#7A5618" letterSpacing="0.8">SNL</text>
          </svg>
        </div>
      ))}

      <Container className="relative z-10 flex flex-col items-center text-center pt-10 pb-10 gap-4">

        {/* Title */}
        <h1 className="text-[22px] sm:text-[32px] lg:text-[46px] font-bold text-white leading-[1.15]">
          {t("hero_title_pre")}<br />
          <span className="text-secondary">SUNALA</span> {t("hero_title_post")}
        </h1>

        {/* Paragraph — tight under title */}
        <p className="text-[13px] sm:text-[15px] max-w-sm mx-auto leading-[1.6]" style={{ color: "rgba(255,255,255,0.65)" }}>
          {t("hero_subtitle")}
        </p>

        {/* Collect widget — inline */}
        <div
          className="w-full max-w-xs mx-auto flex flex-col items-center gap-3"
          style={{
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 20,
            padding: "20px 20px",
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
            <MiningRing nextCollect={nextCollect} onReady={handleReady} t={t} />
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
                <span style={{ color: "rgba(255,255,255,0.55)" }}>{t("new_balance")}</span>
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
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>{t("daily_reward")}</p>
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
