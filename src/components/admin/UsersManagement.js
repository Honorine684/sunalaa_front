"use client";

import { useState, useRef, useEffect } from "react";

const users = [
  { id: 1, initials: "CR", name: "crypto_master",  email: "crypto@example.com",   points: "12,500", refs: 45,  status: "Actif",    date: "2025-12-30" },
  { id: 2, initials: "MO", name: "moon_walker",    email: "moon@example.com",     points: "8,900",  refs: 23,  status: "Actif",    date: "2025-12-30" },
  { id: 3, initials: "HO", name: "hodl_king",      email: "hodl@example.com",     points: "23,400", refs: 67,  status: "Actif",    date: "2025-12-29" },
  { id: 4, initials: "DE", name: "degen_trader",   email: "degen@example.com",    points: "4,500",  refs: 12,  status: "Suspendu", date: "2025-12-25" },
  { id: 5, initials: "SN", name: "snl_collector",  email: "snl@example.com",      points: "9,800",  refs: 34,  status: "Actif",    date: "2025-12-28" },
  { id: 6, initials: "WH", name: "whale_player",   email: "whale@example.com",    points: "45,600", refs: 123, status: "Actif",    date: "2025-12-30" },
  { id: 7, initials: "SC", name: "scam_account",   email: "scam@example.com",     points: "0",      refs: 0,   status: "Banni",    date: "2025-12-20" },
  { id: 8, initials: "DI", name: "diamond_hands",  email: "diamond@example.com",  points: "34,200", refs: 56,  status: "Actif",    date: "2025-12-30" },
];

const statusStyle = {
  Actif:    { bg: "#ECFDF5", text: "#059669", border: "#D1FAE5" },
  Suspendu: { bg: "#FFF7ED", text: "#D97706", border: "#FED7AA" },
  Banni:    { bg: "#FFF1F2", text: "#E11D48", border: "#FFE4E6" },
};

function StatusBadge({ status }) {
  const s = statusStyle[status] ?? statusStyle.Actif;
  return (
    <span
      className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[12px] font-normal border whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      {status}
    </span>
  );
}

function ActionMenu({ userId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 bg-white rounded-xl border border-slate-100 shadow-lg py-1 w-36">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] hover:bg-slate-50 transition cursor-pointer"
            style={{ color: "#0F172B" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Modifier
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-[13px] hover:bg-red-50 transition cursor-pointer"
            style={{ color: "#E11D48" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}

const COLS = ["UTILISATEUR", "EMAIL", "POINTS SNL", "PARRAINAGES", "STATUT", "DERNIÈRE ACTIVITÉ", "ACTIONS"];

export default function UsersManagement() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tous" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: users.length,
    actifs: users.filter((u) => u.status === "Actif").length,
    suspendus: users.filter((u) => u.status === "Suspendu").length,
    bannis: users.filter((u) => u.status === "Banni").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page title */}
      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Gestion des utilisateurs</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Contrôler et modérer les comptes utilisateurs</p>
      </div>

      {/* Search + filter + stats — même card */}
      <div className="bg-white rounded-2xl border border-slate-100">
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom d'utilisateur ou email..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[14px] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-secondary/30 transition"
              style={{ color: "#45556C" }}
            />
          </div>
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white cursor-pointer hover:bg-slate-50 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#45556C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-[14px] outline-none cursor-pointer"
              style={{ color: "#45556C" }}
            >
              {["Tous", "Actif", "Suspendu", "Banni"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-100" />

        <div className="px-5 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          {[
            { label: "Total", value: counts.total, color: "#45556C" },
            { label: "Actifs", value: counts.actifs, color: "#059669" },
            { label: "Suspendus", value: counts.suspendus, color: "#D97706" },
            { label: "Bannis", value: counts.bannis, color: "#E11D48" },
          ].map(({ label, value, color }) => (
            <span key={label} className="font-bold" style={{ color: "#45556C" }}>
              {label} :<span className="ml-1" style={{ color }}>{value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
      <div className="bg-white min-w-[700px]">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1.2fr_0.5fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
          {COLS.map((col) => (
            <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>
              {col}
            </span>
          ))}
        </div>

        {filtered.map((user, i) => (
          <div
            key={user.id}
            className={[
              "grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1.2fr_0.5fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
              i < filtered.length - 1 ? "border-b border-slate-100" : "",
            ].join(" ")}
          >
            {/* Utilisateur */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                <span className="text-white text-[12px] font-bold">{user.initials}</span>
              </div>
              <div>
                <p className="text-[14px] font-bold leading-none mb-0.5" style={{ color: "#0F172B" }}>{user.name}</p>
                <p className="text-[11px]" style={{ color: "#62748E" }}>ID: {user.id}</p>
              </div>
            </div>
            {/* Email */}
            <span className="text-[14px]" style={{ color: "#45556C" }}>{user.email}</span>
            {/* Points SNL */}
            <span className="text-[14px] font-normal" style={{ color: "#0F172B" }}>{user.points}</span>
            {/* Parrainages */}
            <span className="text-[14px]" style={{ color: "#45556C" }}>{user.refs}</span>
            {/* Statut */}
            <StatusBadge status={user.status} />
            {/* Date */}
            <span className="text-[14px]" style={{ color: "#45556C" }}>{user.date}</span>
            {/* Actions */}
            <ActionMenu userId={user.id} />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-[14px]" style={{ color: "#45556C" }}>
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
