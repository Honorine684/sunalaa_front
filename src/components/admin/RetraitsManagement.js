"use client";

import { useEffect, useState, useCallback } from "react";
import { walletApi, getApiError } from "@/lib/api";

const STATUS_INFO = {
  PENDING:    { label: "En attente",  bg: "#FEF9C3", color: "#854D0E" },
  PROCESSING: { label: "En cours",    bg: "#DBEAFE", color: "#1E40AF" },
  COMPLETED:  { label: "Complété",    bg: "#D1FAE5", color: "#065F46" },
  REJECTED:   { label: "Rejeté",      bg: "#FEE2E2", color: "#7F1D1D" },
};

function StatusBadge({ status }) {
  const info = STATUS_INFO[status] ?? { label: status, bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold"
      style={{ backgroundColor: info.bg, color: info.color }}>{info.label}</span>
  );
}

function fmt(n) { return Number(n ?? 0).toLocaleString("fr-FR"); }
function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.withdrawals ?? raw?.items ?? [];
}

export default function RetraitsManagement() {
  const [withdrawals, setWithdrawals] = useState([]);
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
      const res = await walletApi.adminGetWithdrawals(params);
      const raw = res.data?.data ?? res.data;
      setWithdrawals(normalizeList(raw));
      setTotal(raw?.total ?? raw?.count ?? normalizeList(raw).length);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404 || status === 501) {
        setError("L'endpoint GET /wallets/admin/withdrawals n'est pas encore disponible. Demande au backend dev de l'ajouter.");
      } else {
        setError(getApiError(e));
      }
    } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  async function handleAction(id, action) {
    setActionLoading(id + "_" + action);
    setError("");
    try {
      if (action === "process")   await walletApi.adminProcessWithdrawal(id);
      if (action === "complete")  await walletApi.adminCompleteWithdrawal(id);
      if (action === "reject")    await walletApi.adminRejectWithdrawal(id);

      const newStatus = action === "process" ? "PROCESSING" : action === "complete" ? "COMPLETED" : "REJECTED";
      setWithdrawals((prev) => prev.map((w) => w.id === id ? { ...w, status: newStatus } : w));
      showSuccess(
        action === "process"  ? "Retrait marqué en cours." :
        action === "complete" ? "Retrait complété — solde mis à jour !" :
        "Retrait rejeté — solde remboursé."
      );
    } catch (e) {
      setError(getApiError(e));
    } finally { setActionLoading(null); }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Retraits</h2>
          <p className="text-[13px] text-slate-400 mt-0.5">{total} demande{total !== 1 ? "s" : ""} au total</p>
        </div>
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-secondary min-w-[180px]"
          style={{ color: statusFilter ? "#0F172B" : "#94A3B8" }}>
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_INFO).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {successMsg && (
        <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-[13px] font-semibold text-green-700">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {["Membre", "Méthode", "Compte", "Montant", "Date", "Statut", "Actions"].map((h) => (
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
                    {[...Array(7)].map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-[14px]">
                    Aucune demande de retrait
                  </td>
                </tr>
              ) : withdrawals.map((w) => {
                const user = w.user ?? w.member ?? {};
                return (
                  <tr key={w.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                          {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "—"}
                        </p>
                        {user.email && <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{user.email}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px]" style={{ color: "#334155" }}>{w.method ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-mono" style={{ color: "#334155" }}>{w.accountNumber ?? w.account ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-bold text-red-500">-{fmt(w.amount)} SNL</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-slate-400">{fmtDate(w.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {w.status === "PENDING" && (
                          <button onClick={() => handleAction(w.id, "process")}
                            disabled={!!actionLoading}
                            className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-lg hover:bg-blue-100 transition cursor-pointer disabled:opacity-50">
                            {actionLoading === w.id + "_process" ? "…" : "En cours"}
                          </button>
                        )}
                        {(w.status === "PENDING" || w.status === "PROCESSING") && (
                          <button onClick={() => handleAction(w.id, "complete")}
                            disabled={!!actionLoading}
                            className="px-2.5 py-1 bg-green-50 text-green-600 text-[11px] font-semibold rounded-lg hover:bg-green-100 transition cursor-pointer disabled:opacity-50">
                            {actionLoading === w.id + "_complete" ? "…" : "Compléter"}
                          </button>
                        )}
                        {(w.status === "PENDING" || w.status === "PROCESSING") && (
                          <button onClick={() => handleAction(w.id, "reject")}
                            disabled={!!actionLoading}
                            className="px-2.5 py-1 bg-red-50 text-red-500 text-[11px] font-semibold rounded-lg hover:bg-red-100 transition cursor-pointer disabled:opacity-50">
                            {actionLoading === w.id + "_reject" ? "…" : "Rejeter"}
                          </button>
                        )}
                        {w.status === "COMPLETED" || w.status === "REJECTED" ? (
                          <span className="text-[12px] text-slate-300">—</span>
                        ) : null}
                      </div>
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
