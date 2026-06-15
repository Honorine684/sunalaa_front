"use client";

import { useEffect, useState, useCallback } from "react";
import { commissionsApi, getApiError } from "@/lib/api";

const STATUS_INFO = {
  PENDING:  { label: "En attente", bg: "#FEF9C3", color: "#854D0E" },
  APPROVED: { label: "Approuvée",  bg: "#D1FAE5", color: "#065F46" },
  REJECTED: { label: "Rejetée",    bg: "#FEE2E2", color: "#7F1D1D" },
  PAID:     { label: "Payée",      bg: "#DCFCE7", color: "#14532D" },
};

function StatusBadge({ status }) {
  const info = STATUS_INFO[status] ?? { label: status, bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold"
      style={{ backgroundColor: info.bg, color: info.color }}>
      {info.label}
    </span>
  );
}

function fmt(n) { return Number(n ?? 0).toLocaleString("fr-FR"); }
function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.commissions ?? raw?.items ?? [];
}

export default function CommissionsManagement() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [successMsg, setSuccessMsg]   = useState("");
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await commissionsApi.adminGetAll(params);
      const raw = res.data?.data ?? res.data;
      setCommissions(normalizeList(raw));
      setTotal(raw?.total ?? raw?.count ?? normalizeList(raw).length);
    } catch (e) {
      setError(getApiError(e));
    } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleApprove(id) {
    setActionLoading(id + "_approve");
    try {
      await commissionsApi.adminApprove(id);
      setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, status: "APPROVED" } : c));
      showSuccess("Commission approuvée, wallet crédité !");
    } catch (e) {
      setError(getApiError(e));
    } finally { setActionLoading(null); }
  }

  async function handleReject(id) {
    setActionLoading(id + "_reject");
    try {
      await commissionsApi.adminReject(id);
      setCommissions((prev) => prev.map((c) => c.id === id ? { ...c, status: "REJECTED" } : c));
      showSuccess("Commission rejetée.");
    } catch (e) {
      setError(getApiError(e));
    } finally { setActionLoading(null); }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Commissions</h2>
          <p className="text-[13px] text-slate-400 mt-0.5">{total} commission{total !== 1 ? "s" : ""} au total</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-secondary min-w-[180px]"
          style={{ color: statusFilter ? "#0F172B" : "#94A3B8" }}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_INFO).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-[13px] font-semibold text-green-700">
          {successMsg}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {["Utilisateur", "Type", "Montant", "Date", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : commissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-[14px]">
                    Aucune commission trouvée
                  </td>
                </tr>
              ) : commissions.map((c) => {
                const user = c.user ?? c.earner ?? {};
                return (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                          {user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "—"}
                        </p>
                        {user.email && (
                          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{user.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px]" style={{ color: "#334155" }}>
                        {c.type ?? c.reason ?? "Réseau"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-bold" style={{ color: "#1F4E46" }}>
                        +{fmt(c.amount ?? c.value)} SNL
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-slate-400">{fmtDate(c.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {c.status === "PENDING" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(c.id)}
                            disabled={!!actionLoading}
                            className="px-3 py-1.5 bg-secondary text-white text-[12px] font-semibold rounded-lg hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading === c.id + "_approve" ? "…" : "Approuver"}
                          </button>
                          <button
                            onClick={() => handleReject(c.id)}
                            disabled={!!actionLoading}
                            className="px-3 py-1.5 border border-red-200 text-red-500 text-[12px] font-semibold rounded-lg hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading === c.id + "_reject" ? "…" : "Rejeter"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12px] text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-[13px] text-slate-400">Page {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default">
                ← Précédent
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default">
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
