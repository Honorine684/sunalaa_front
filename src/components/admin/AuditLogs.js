"use client";

import { useEffect, useState, useCallback } from "react";
import { adminApi, getApiError } from "@/lib/api";

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.logs ?? raw?.items ?? raw?.auditLogs ?? [];
}

const ACTION_COLORS = {
  CREATE: { bg: "#D1FAE5", color: "#065F46" },
  UPDATE: { bg: "#DBEAFE", color: "#1E40AF" },
  DELETE: { bg: "#FEE2E2", color: "#7F1D1D" },
  LOGIN:  { bg: "#F3F4F6", color: "#374151" },
  LOGOUT: { bg: "#F3F4F6", color: "#374151" },
  APPROVE:{ bg: "#D1FAE5", color: "#065F46" },
  REJECT: { bg: "#FEE2E2", color: "#7F1D1D" },
  REVIEW: { bg: "#FEF3C7", color: "#92400E" },
  VIEW:   { bg: "#F3F4F6", color: "#374151" },
  EXPORT: { bg: "#EDE9FE", color: "#4C1D95" },
};
function ActionBadge({ action }) {
  const a = String(action ?? "").toUpperCase().split("_")[0];
  const info = ACTION_COLORS[a] ?? { bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: info.bg, color: info.color }}>{action ?? "—"}</span>
  );
}

function DetailModal({ log, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[16px] font-bold" style={{ color: "#1F4E46" }}>Détail du log</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "ID", value: <span className="font-mono text-[11px]">{log.id ?? "—"}</span> },
              { label: "Action", value: <ActionBadge action={log.action} /> },
              { label: "Ressource", value: log.resource ?? log.entity ?? log.entityType ?? "—" },
              { label: "ID Ressource", value: <span className="font-mono text-[11px]">{log.resourceId ?? log.entityId ?? "—"}</span> },
              { label: "Date", value: fmtDate(log.createdAt ?? log.timestamp) },
              { label: "IP", value: <span className="font-mono text-[11px]">{log.ipAddress ?? log.ip ?? "—"}</span> },
            ].map((row) => (
              <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 mb-0.5">{row.label}</p>
                <div className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* User */}
          {log.user && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[11px] text-slate-400 mb-1">Utilisateur</p>
              <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                {log.user.username || [log.user.firstName, log.user.lastName].filter(Boolean).join(" ") || log.user.email || log.userId || "—"}
              </p>
              {log.user.email && <p className="text-[11px] text-slate-400">{log.user.email}</p>}
            </div>
          )}

          {/* Metadata / changes */}
          {(log.metadata ?? log.changes ?? log.details) && (
            <div>
              <p className="text-[11px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Données</p>
              <pre className="bg-slate-900 text-green-400 rounded-xl px-4 py-3 text-[11px] overflow-auto max-h-48 leading-relaxed">
                {JSON.stringify(log.metadata ?? log.changes ?? log.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuditLogs() {
  const [logs, setLogs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [actionFilter, setFilter]   = useState("");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit };
      if (actionFilter) params.action = actionFilter;
      if (search.trim()) params.search = search.trim();
      const res = await adminApi.getAuditLogs(params);
      const raw = res.data?.data ?? res.data;
      const list = normalizeList(raw);
      setLogs(list);
      setTotal(raw?.meta?.total ?? raw?.total ?? raw?.count ?? list.length);
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  }, [page, actionFilter, search]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Journaux d&apos;audit</h2>
        <p className="text-[13px] text-slate-400 mt-0.5">{total.toLocaleString("fr-FR")} entrée{total !== 1 ? "s" : ""}, lecture seule</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher utilisateur, ressource…"
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-secondary w-72" />
        </div>
        <select value={actionFilter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-secondary bg-white cursor-pointer">
          <option value="">Toutes les actions</option>
          {["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "APPROVE", "REJECT", "REVIEW", "EXPORT"].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button onClick={() => { setSearch(""); setFilter(""); setPage(1); }}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-[13px] text-slate-400 hover:bg-slate-50 transition cursor-pointer">
          Réinitialiser
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {["Date", "Utilisateur", "Action", "Ressource", "IP", "Détail"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    {[...Array(6)].map((__, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>)}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-[14px]">Aucun log trouvé</td></tr>
              ) : logs.map((log) => {
                const user = log.user ?? {};
                return (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-[12px] text-slate-400">{fmtDate(log.createdAt ?? log.timestamp)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                          {user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || log.userId || "—"}
                        </p>
                        {user.email && <p className="text-[11px] text-slate-400">{user.email}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><ActionBadge action={log.action} /></td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px]" style={{ color: "#334155" }}>
                        {log.resource ?? log.entity ?? log.entityType ?? "—"}
                      </span>
                      {(log.resourceId ?? log.entityId) && (
                        <span className="text-[11px] text-slate-400 font-mono ml-1.5">
                          #{String(log.resourceId ?? log.entityId).slice(-8)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-mono text-slate-400">{log.ipAddress ?? log.ip ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(log)}
                        className="text-[13px] font-semibold text-secondary hover:underline cursor-pointer">
                        Voir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-[13px] text-slate-400">Page {page} / {totalPages} · {total.toLocaleString("fr-FR")} entrées</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default">← Précédent</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default">Suivant →</button>
            </div>
          </div>
        )}
      </div>

      {selected && <DetailModal log={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
