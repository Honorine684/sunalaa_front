"use client";

import { useEffect, useState } from "react";
import { levelsApi } from "@/lib/api";

const STATIC_FALLBACK = [
  { id: "bronze",   name: "Bronze",   description: "Starting level", minPoints: 0,     color: "#BB4D00", order: 1 },
  { id: "silver",   name: "Silver",   description: "Intermediate",   minPoints: 5000,  color: "#90A1B9", order: 2 },
  { id: "gold",     name: "Gold",     description: "Advanced",       minPoints: 15000, color: "#E6B84C", order: 3 },
  { id: "platinum", name: "Platinum", description: "Expert",         minPoints: 30000, color: "#00D3F2", order: 4 },
  { id: "diamond",  name: "Diamond",  description: "Elite",          minPoints: 50000, color: "#C27AFF", order: 5 },
];

// Icônes par nom de niveau (fallback si le nom ne matche pas → médaille générique)
const LEVEL_ICONS = {
  bronze: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
      <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  silver: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8m-4-4v4m0-4c-4.418 0-8-3.582-8-8V5h16v4c0 4.418-3.582 8-8 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 9H2a1 1 0 01-1-1V7a1 1 0 011-1h2M20 9h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  gold: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  platinum: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 7h6v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  diamond: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 19h20M3 9l4 5 5-8 5 8 4-5v10H3V9z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
    <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function getIcon(name) {
  return LEVEL_ICONS[name?.toLowerCase()] ?? DEFAULT_ICON;
}

function fmt(n) { return Number(n ?? 0).toLocaleString("en-US"); }

export default function ProfileLevels({ profile }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    levelsApi.getAll()
      .then((res) => {
        // gère { data: [...] } et { data: { data: [...] } }
        const body = res.data?.data ?? res.data;
        const raw  = Array.isArray(body) ? body : (body?.data ?? []);
        setLevels(raw);
      })
      .catch(() => setLevels(STATIC_FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const snlBalance = Number(profile?.snlBalance ?? profile?.points ?? 0);

  // Déterminer le niveau actuel depuis le solde
  function computeState(level, i, sorted) {
    if (snlBalance >= level.minPoints) {
      // vérifier si c'est bien le niveau max atteint
      const next = sorted[i + 1];
      if (!next || snlBalance < next.minPoints) return "active";
      return "unlocked";
    }
    return "locked";
  }

  const sorted = [...levels].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-[18px] font-bold mb-5" style={{ color: "#0F172B" }}>All levels</h3>
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-[18px] font-bold mb-5" style={{ lineHeight: "28px", color: "#0F172B" }}>
        All levels
      </h3>
      <div className="flex flex-col gap-3">
        {sorted.map((level, i) => {
          const state = computeState(level, i, sorted);
          const icon  = getIcon(level.name);
          const color = level.color ?? "#BB4D00";

          return (
            <div
              key={level.id}
              className={[
                "flex items-center gap-4 p-3 rounded-xl border transition-all",
                state === "active" ? "border-blue-200 bg-blue-50/40" : "border-transparent",
              ].join(" ")}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: color }}
              >
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px]" style={{ fontWeight: 500, lineHeight: "28px", color: "#1E293B" }}>
                    {level.name}
                  </span>
                  {state === "active" && (
                    <span className="bg-blue-500 text-white text-[10px] font-normal px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </div>

                {state === "unlocked" ? (
                  <span className="text-[12px] text-emerald-500 font-normal flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Unlocked
                  </span>
                ) : state === "active" ? (
                  <span className="text-[12px] text-blue-500">Current level</span>
                ) : (
                  <span className="text-[12px] text-slate-400">
                    {level.minPoints > 0 ? `Required: ${fmt(level.minPoints)} SNL` : level.description ?? "Starting level"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
