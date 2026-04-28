"use client";

import { useState } from "react";

/* ── Data ── */
const missions = [
  {
    id: 1,
    platform: "telegram",
    title: "Rejoindre le canal Telegram SUNALAA",
    action: "Rejoignez notre canal officiel",
    type: "Telegram",
    reward: 25,
    status: "Actif",
    completions: "1,234",
    date: "2024-01-15",
  },
  {
    id: 2,
    platform: "twitter",
    title: "Suivre SUNALAA sur X (Twitter)",
    action: "Suivez notre compte officiel",
    type: "Twitter",
    reward: 25,
    status: "Actif",
    completions: "987",
    date: "2024-01-15",
  },
  {
    id: 3,
    platform: "twitter",
    title: "Retweeter notre post épinglé",
    action: "Aidez-nous à diffuser notre message",
    type: "Twitter",
    reward: 50,
    status: "Actif",
    completions: "456",
    date: "2024-01-20",
  },
  {
    id: 4,
    platform: "youtube",
    title: "S'abonner à la chaîne YouTube",
    action: "Abonnez-vous et activez les notifications",
    type: "YouTube",
    reward: 100,
    status: "Actif",
    completions: "234",
    date: "2024-02-01",
  },
  {
    id: 5,
    platform: "discord",
    title: "Rejoindre le serveur Discord",
    action: "Rejoignez notre communauté Discord",
    type: "Discord",
    reward: 75,
    status: "Inactif",
    completions: "123",
    date: "2024-02-10",
  },
];

/* ── Platform icons ── */
function PlatformIcon({ platform }) {
  const icons = {
    telegram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    twitter: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    youtube: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    discord: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12h.01M15 12h.01" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M8 9c0-1.1.9-2 2-2h4a2 2 0 012 2v5a2 2 0 01-2 2h-1l-2 2-2-2H8V9z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9A10 10 0 003 18l2 2s1-1 3-1M18 9a10 10 0 013 9l-2 2s-1-1-3-1" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return (
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#ECFDF5" }}>
      {icons[platform] ?? icons.telegram}
    </div>
  );
}

const COLS = ["MISSION", "TYPE", "RÉCOMPENSE", "STATUT", "COMPLÉTIONS", "DATE CRÉATION", "ACTIONS"];

export default function MissionsPage() {
  const [search, setSearch] = useState("");

  const filtered = missions.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total missions",    value: "5",       color: "#0F172B" },
    { label: "Missions actives",  value: "4",       color: "#3FAE8C" },
    { label: "Total complétions", value: "3,700",   color: "#3FAE8C" },
    { label: "SNL distribués",    value: "121,450", color: "#E6B84C" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <p className="text-[14px]" style={{ color: "#45556C" }}>
        Créez et gérez les missions pour encourager l&apos;engagement communautaire
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-[13px] mb-2" style={{ color: "#45556C" }}>{s.label}</p>
            <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action bar */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une mission..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[14px] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-secondary/30 transition"
            style={{ color: "#45556C" }}
          />
        </div>

        {/* Filter input */}
        <div className="relative sm:w-[180px] shrink-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Filtrer..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-[14px] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-secondary/30 transition"
            style={{ color: "#45556C" }}
          />
        </div>

        {/* Add mission */}
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer whitespace-nowrap shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Ajouter une mission
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
      <div className="bg-white min-w-[720px]">
        {/* Head */}
        <div className="grid grid-cols-[2.5fr_1fr_1.2fr_0.8fr_1fr_1.2fr_0.7fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
          {COLS.map((col) => (
            <span key={col} className="text-[11px] font-bold tracking-wider uppercase whitespace-pre-line" style={{ color: "#45556C" }}>
              {col === "DATE CRÉATION" ? "DATE\nCRÉATION" : col}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((m, i) => (
          <div
            key={m.id}
            className={[
              "grid grid-cols-[2.5fr_1fr_1.2fr_0.8fr_1fr_1.2fr_0.7fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
              i < filtered.length - 1 ? "border-b border-slate-100" : "",
            ].join(" ")}
          >
            {/* Mission */}
            <div className="flex items-center gap-3">
              <PlatformIcon platform={m.platform} />
              <div>
                <p className="text-[13px] font-semibold leading-snug" style={{ color: "#0F172B" }}>{m.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{m.action}</p>
              </div>
            </div>

            {/* Type */}
            <span className="text-[13px]" style={{ color: "#45556C" }}>{m.type}</span>

            {/* Récompense */}
            <div className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="6" stroke="#E6B84C" strokeWidth="2"/>
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[13px] font-semibold" style={{ color: "#E6B84C" }}>{m.reward} SNL</span>
            </div>

            {/* Statut */}
            <span
              className="inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[12px] font-normal border whitespace-nowrap"
              style={
                m.status === "Actif"
                  ? { backgroundColor: "#ECFDF5", color: "#059669", borderColor: "#D1FAE5" }
                  : { backgroundColor: "#FFF7ED", color: "#D97706", borderColor: "#FED7AA" }
              }
            >
              {m.status}
            </span>

            {/* Complétions */}
            <span className="text-[13px]" style={{ color: "#45556C" }}>{m.completions}</span>

            {/* Date */}
            <div className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#94A3B8" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[13px]" style={{ color: "#45556C" }}>{m.date}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="hover:text-red-500 transition cursor-pointer" style={{ color: "#94A3B8" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[14px]" style={{ color: "#45556C" }}>
            Aucune mission trouvée.
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
