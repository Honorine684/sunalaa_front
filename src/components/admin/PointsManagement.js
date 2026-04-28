"use client";

import { useState } from "react";

const history = [
  { id: 1, date: "2025-12-30", time: "14:32", initials: "CR", name: "crypto_master",   amount: +5000,  justification: "Bonus de parrainage exceptionnel",          admin: "Admin" },
  { id: 2, date: "2025-12-30", time: "12:15", initials: "MO", name: "moon_walker",     amount: -2000,  justification: "Correction - activité suspecte détectée",    admin: "Admin" },
  { id: 3, date: "2025-12-29", time: "18:45", initials: "HO", name: "hodl_king",       amount: +10000, justification: "Récompense ambassadeur communautaire",        admin: "Admin" },
  { id: 4, date: "2025-12-29", time: "10:20", initials: "AI", name: "airdrop_hunter",  amount: +3000,  justification: "Compensation technique suite à un bug",       admin: "Admin" },
  { id: 5, date: "2025-12-28", time: "16:00", initials: "DE", name: "degen_trader",    amount: -5000,  justification: "Violation des conditions d'utilisation",      admin: "Admin" },
  { id: 6, date: "2025-12-28", time: "09:30", initials: "WH", name: "whale_player",    amount: +7500,  justification: "Promotion spéciale fidélité",                 admin: "Admin" },
];

const COLS = ["DATE &\nHEURE", "UTILISATEUR", "MONTANT", "JUSTIFICATION", "ADMINISTRATEUR"];

export default function PointsManagement() {
  const [search, setSearch] = useState("");

  const filtered = history.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.justification.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Gestion des points SNL</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Ajuster les soldes de points et consulter l&apos;historique des modifications</p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl px-5 py-4 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="text-[14px] font-bold mb-1" style={{ color: "#D97706" }}>Attention</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "#92400E" }}>
            Toute modification de points SNL doit être justifiée et sera enregistrée dans l&apos;historique. Assurez-vous de la légitimité de l&apos;action avant de confirmer.
          </p>
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Ajouter */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#ECFDF5" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold" style={{ color: "#0F172B" }}>Ajouter des points</p>
              <p className="text-[13px]" style={{ color: "#45556C" }}>Créditer le compte d&apos;un utilisateur</p>
            </div>
          </div>
          <button className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer" style={{ backgroundColor: "#3FAE8C" }}>
            Ajouter des points SNL
          </button>
        </div>

        {/* Retirer */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#FFF1F2" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold" style={{ color: "#0F172B" }}>Retirer des points</p>
              <p className="text-[13px]" style={{ color: "#45556C" }}>Débiter le compte d&apos;un utilisateur</p>
            </div>
          </div>
          <button className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer" style={{ backgroundColor: "#E11D48" }}>
            Retirer des points SNL
          </button>
        </div>
      </div>

      {/* Historique */}
      <div>
        {/* Section title */}
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M1 4v6h6" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7v5l4 2" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-[18px] font-bold" style={{ color: "#0F172B" }}>Historique des modifications</h3>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans l'historique..."
            className="w-full rounded-xl pl-10 pr-4 py-3 text-[14px] placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-secondary/30 transition border border-slate-300"
            style={{ backgroundColor: "#CAD5E2", color: "#45556C" }}
            style={{ color: "#45556C" }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
        <div className="bg-white min-w-[640px]">
          {/* Head */}
          <div className="grid grid-cols-[1.2fr_2fr_1fr_2.5fr_1fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
            {COLS.map((col) => (
              <span key={col} className="text-[11px] font-bold tracking-wider uppercase whitespace-pre-line" style={{ color: "#45556C" }}>
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((row, i) => (
            <div
              key={row.id}
              className={[
                "grid grid-cols-[1.2fr_2fr_1fr_2.5fr_1fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
                i < filtered.length - 1 ? "border-b border-slate-100" : "",
              ].join(" ")}
            >
              {/* Date & Heure */}
              <div>
                <p className="text-[13px]" style={{ color: "#45556C" }}>{row.date}</p>
                <p className="text-[13px]" style={{ color: "#45556C" }}>{row.time}</p>
              </div>

              {/* Utilisateur */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                  <span className="text-white text-[12px] font-bold">{row.initials}</span>
                </div>
                <span className="text-[14px] font-normal" style={{ color: "#0F172B" }}>{row.name}</span>
              </div>

              {/* Montant */}
              <div className="flex items-baseline gap-1">
                <span className="text-[13px] font-bold" style={{ color: row.amount > 0 ? "#059669" : "#E11D48" }}>
                  {row.amount > 0 ? "+" : "−"}
                </span>
                <div>
                  <p className="text-[14px] font-bold leading-none" style={{ color: row.amount > 0 ? "#059669" : "#E11D48" }}>
                    {Math.abs(row.amount).toLocaleString()}
                  </p>
                  <p className="text-[12px] font-bold" style={{ color: row.amount > 0 ? "#059669" : "#E11D48" }}>SNL</p>
                </div>
              </div>

              {/* Justification */}
              <span className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{row.justification}</span>

              {/* Admin */}
              <span className="text-[14px]" style={{ color: "#45556C" }}>{row.admin}</span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-[14px]" style={{ color: "#45556C" }}>
              Aucune entrée trouvée.
            </div>
          )}
        </div>
        </div>
      </div>

    </div>
  );
}
