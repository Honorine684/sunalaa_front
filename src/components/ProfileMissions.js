"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { missionsApi, getApiError } from "@/lib/api";

/* ── Platform icon backgrounds ── */
const PLATFORM_COLORS = {
  telegram:  "#26A5E4",
  twitter:   "#1A3C34",
  youtube:   "#FF0000",
  discord:   "#5865F2",
  facebook:  "#1877F2",
  instagram: "#E1306C",
  whatsapp:  "#25D366",
};

const PLATFORM_ICONS = {
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  ),
  discord: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
    </svg>
  ),
  whatsapp: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
    </svg>
  ),
};

function getPlatformIcon(platform) {
  const key = platform?.toLowerCase();
  return { icon: PLATFORM_ICONS[key] ?? PLATFORM_ICONS.telegram, bg: PLATFORM_COLORS[key] ?? "#1A3C34" };
}

/* ── Mission card ── */
function MissionCard({ mission, onStart, onComplete }) {
  const [loading, setLoading] = useState(false);
  const status     = mission.userStatus ?? (mission.completed === true ? "COMPLETED" : null);
  const claimed    = status === "COMPLETED";
  const pending    = status === "PENDING";
  const inReview   = status === "UNDER_REVIEW";
  const rejected   = status === "REJECTED";
  const { icon, bg } = getPlatformIcon(mission.platform);

  async function handleStart() {
    if (mission.actionUrl) window.open(mission.actionUrl, "_blank", "noopener");
    setLoading(true);
    try { await onStart(mission.id); }
    finally { setLoading(false); }
  }

  async function handleVerify() {
    setLoading(true);
    try { await onComplete(mission.id); }
    finally { setLoading(false); }
  }

  return (
    <div
      className="flex flex-col justify-between bg-white hover:scale-[1.01] transition-transform duration-200"
      style={{ minHeight: 140, borderRadius: 8, border: "1px solid rgba(7,58,3,0.16)", padding: 16, gap: 12, opacity: claimed ? 0.7 : 1 }}
    >
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center shrink-0" style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: bg }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] sm:text-[18px]" style={{ fontWeight: 600, lineHeight: "22px", color: "#0F172B" }}>
              {mission.title}
            </p>
            <div className={`relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 ${claimed ? "opacity-40" : ""}`}>
              <Image src="/images/4.png" alt="coins" fill className="object-contain" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-[12px] sm:text-[14px]" style={{ fontWeight: 400, lineHeight: "22.75px", color: "#45556C" }}>
              {mission.description}
            </p>
            <span className="font-bold shrink-0 text-[14px] sm:text-[18px]" style={{ lineHeight: "21px", color: claimed ? "#CBD5E1" : "#0A3706" }}>
              {mission.reward} SNL
            </span>
          </div>
        </div>
      </div>

      {/* Button — 5 états */}
      {claimed ? (
        <button disabled className="w-full py-3 rounded-xl text-white text-[14px] font-normal cursor-default" style={{ backgroundColor: "#E6B84C" }}>
          Claimed ✓
        </button>
      ) : inReview ? (
        <button disabled className="w-full py-3 rounded-xl text-[14px] font-normal cursor-default flex items-center justify-center gap-2" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>
          <svg className="animate-spin shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="3" strokeDasharray="40 20"/></svg>
          Validation in progress…
        </button>
      ) : rejected ? (
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-3 rounded-xl text-[14px] font-normal hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 border"
          style={{ backgroundColor: "#FEF2F2", color: "#EF4444", borderColor: "#FECACA" }}
        >
          {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="3" strokeDasharray="40 20"/></svg>}
          {loading ? "…" : "Rejected — Retry"}
        </button>
      ) : pending ? (
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white text-[14px] font-normal hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#E17100" }}
        >
          {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20"/></svg>}
          {loading ? "Verifying…" : "Verify and claim"}
        </button>
      ) : (
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white text-[14px] font-normal hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#344054" }}
        >
          {loading && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20"/></svg>}
          {loading ? "Starting…" : "Start"}
        </button>
      )}
    </div>
  );
}

export default function ProfileMissions({ onMissionComplete }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await missionsApi.getMyMissions();
      const raw = res.data?.data ?? res.data;
      setMissions(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleStart(id) {
    try {
      await missionsApi.start(id);
      setMissions((prev) => prev.map((m) => m.id === id ? { ...m, userStatus: "PENDING" } : m));
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function handleComplete(id) {
    try {
      const res = await missionsApi.complete(id);
      const { newBalance, completedAt } = res.data?.data ?? {};
      setMissions((prev) => prev.map((m) => m.id === id ? { ...m, userStatus: "COMPLETED", completedAt: completedAt ?? new Date().toISOString() } : m));
      if (newBalance != null) onMissionComplete?.(newBalance);
    } catch (err) {
      setError(getApiError(err));
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-[13px] text-red-500">{error}</p>}
      {missions.length === 0 && !error && (
        <p className="text-[14px] text-center py-8" style={{ color: "#94A3B8" }}>No missions available at the moment.</p>
      )}
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} onStart={handleStart} onComplete={handleComplete} />
      ))}
    </div>
  );
}
