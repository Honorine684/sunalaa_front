"use client";

import { useState, useEffect, useCallback } from "react";
import api, { getApiError } from "@/lib/api";

async function downloadCsv(type) {
  const res = await api.get(`/admin/exports/${type}`, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const typeToTitle = {
  users: "Données utilisateurs",
  points: "Historique des points SNL",
  referral: "Activité de parrainage",
};

/* ── Export card data ── */
const exportCards = [
  {
    id: "users",
    title: "Données utilisateurs",
    desc: "Liste complète des utilisateurs avec informations de profil",
    iconBg: "#EFF6FF",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    fields: ["ID", "Nom d'utilisateur", "Email", "+4"],
  },
  {
    id: "points",
    title: "Historique des points SNL",
    desc: "Toutes les transactions et modifications de points",
    iconBg: "#FEF3C7",
    icon: (
      <div className="relative w-6 h-5 shrink-0">
        <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
        <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
      </div>
    ),
    fields: ["ID Transaction", "Utilisateur", "Montant", "+4"],
  },
  {
    id: "referral",
    title: "Activité de parrainage",
    desc: "Données complètes du système de parrainage multi-niveaux",
    iconBg: "#EDE9FE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    fields: ["Parrain", "Filleul", "Niveau", "+3"],
  },
];

const COLS = ["TYPE D'EXPORT", "DATE & HEURE", "ADMINISTRATEUR", "ENREGISTREMENTS", "STATUT"];

/* ── ExportCard ── */
function ExportCard({ card, loading, onExport }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: card.iconBg }}
        >
          {card.icon}
        </div>
        <div>
          <p className="text-[15px] font-bold leading-snug" style={{ color: "#0F172B" }}>{card.title}</p>
          <p className="text-[13px] leading-snug mt-0.5" style={{ color: "#45556C" }}>{card.desc}</p>
        </div>
      </div>

      {/* Fields */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#45556C" }}>
          Champs exportés
        </p>
        <div className="flex flex-wrap gap-1.5">
          {card.fields.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-md text-[12px]"
              style={{ backgroundColor: "#F1F5F9", color: "#45556C" }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => onExport(card)}
        disabled={loading}
        className="w-full py-3 rounded-xl text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#3FAE8C" }}
      >
        {loading ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {loading ? "Exportation…" : "Exporter en CSV"}
      </button>
    </div>
  );
}

/* ── ReussiBadge ── */
function ReussiBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-normal border whitespace-nowrap w-fit"
      style={{ backgroundColor: "#ECFDF5", color: "#059669", borderColor: "#D1FAE5" }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 4L12 14.01l-3-3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Réussi
    </span>
  );
}

/* ── Main component ── */
export default function ExportsPage() {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/exports/history");
      const rows = data?.data ?? data ?? [];
      setHistory(
        rows.map((r) => {
          const d = new Date(r.createdAt ?? r.exportedAt ?? r.date);
          const valid = !isNaN(d.getTime());
          return {
            id: r.id ?? r._id ?? Math.random(),
            type: typeToTitle[r.exportType ?? r.type] ?? r.exportType ?? r.type ?? "Export",
            date: valid ? d.toLocaleDateString("fr-FR") : (r.date ?? "—"),
            time: valid ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : (r.time ?? ""),
            admin: r.adminName ?? r.adminUsername ?? r.admin ?? "Admin",
            records: r.recordsCount ?? r.records ?? null,
          };
        })
      );
    } catch {
      // Non-critical — leave history empty on error
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  async function handleExport(card) {
    setLoadingId(card.id);
    setError("");
    try {
      await downloadCsv(card.id);
      await fetchHistory();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Exports de données</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Exporter les données de la plateforme au format CSV</p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-5 py-4 border text-[13px]" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>
          {error}
        </div>
      )}

      {/* Security banner */}
      <div
        className="flex items-start gap-3 rounded-xl px-5 py-4 border"
        style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <p className="text-[14px] font-bold mb-1" style={{ color: "#3FAE8C" }}>Confidentialité et sécurité</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "#1E40AF" }}>
            Les données exportées contiennent des informations sensibles. Assurez-vous de respecter les règles de confidentialité et
            de stocker les fichiers en toute sécurité. Ne partagez jamais ces données avec des personnes non autorisées.
          </p>
        </div>
      </div>

      {/* Export cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {exportCards.map((card) => (
          <ExportCard
            key={card.id}
            card={card}
            loading={loadingId === card.id}
            onExport={handleExport}
          />
        ))}
      </div>

      {/* History */}
      <div>
        <h3 className="text-[20px] font-bold mb-4" style={{ color: "#0F172B" }}>Historique des exports</h3>

        {historyLoading ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-10 flex justify-center">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#E2E8F0" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0110 10" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-10 text-center">
            <p className="text-[14px]" style={{ color: "#94A3B8" }}>Aucun export effectué pour le moment.</p>
          </div>
        ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
        <div className="bg-white min-w-145">
          {/* Table head */}
          <div className="grid grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
            {COLS.map((col) => (
              <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {history.map((row, i) => (
            <div
              key={row.id}
              className={[
                "grid grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors duration-150",
                i < history.length - 1 ? "border-b border-slate-100" : "",
              ].join(" ")}
            >
              {/* Type */}
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px]" style={{ color: "#0F172B" }}>{row.type}</span>
              </div>
              {/* Date */}
              <div>
                <p className="text-[13px]" style={{ color: "#45556C" }}>{row.date}</p>
                <p className="text-[13px]" style={{ color: "#45556C" }}>{row.time}</p>
              </div>
              {/* Admin */}
              <span className="text-[14px]" style={{ color: "#45556C" }}>{row.admin}</span>
              {/* Records */}
              <span className="text-[13px]" style={{ color: "#45556C" }}>
                {row.records != null ? row.records.toLocaleString("fr-FR") : "—"}
              </span>
              {/* Status */}
              <ReussiBadge />
            </div>
          ))}
        </div>
        </div>
        )}
      </div>

      {/* Best practices banner */}
      <div
        className="rounded-xl border px-5 py-5"
        style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
      >
        <div className="flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" stroke="#45556C" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="#45556C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className="text-[14px] font-bold mb-3" style={{ color: "#0F172B" }}>Bonnes pratiques d&apos;utilisation</p>
            <ul className="flex flex-col gap-2">
              {[
                "Effectuez des exports réguliers pour maintenir des sauvegardes à jour",
                "Stockez les fichiers CSV dans un environnement sécurisé et chiffré",
                "Ne transmettez jamais les données par email ou services non sécurisés",
                "Supprimez les fichiers après utilisation conformément aux politiques de rétention",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-[13px]" style={{ color: "#45556C" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#3FAE8C" }} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
