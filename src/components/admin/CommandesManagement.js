"use client";

import { useEffect, useState, useCallback } from "react";
import { ordersApi, getApiError } from "@/lib/api";

const STATUS_INFO = {
  PENDING:   { label: "En attente",  bg: "#FEF9C3", color: "#854D0E" },
  CONFIRMED: { label: "Confirmé",    bg: "#D1FAE5", color: "#065F46" },
  CANCELLED: { label: "Annulé",      bg: "#FEE2E2", color: "#7F1D1D" },
  REFUNDED:  { label: "Remboursé",   bg: "#F1F5F9", color: "#475569" },
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

function fmt(n) {
  return Number(n ?? 0).toLocaleString("fr-FR");
}

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (raw?.orders && Array.isArray(raw.orders)) return raw.orders;
  if (raw?.items && Array.isArray(raw.items)) return raw.items;
  return [];
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function AchatDetailModal({ order, onClose, onStatusChange }) {
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status ?? "PENDING");
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function applyStatus() {
    if (newStatus === order.status) return;
    setUpdating(true); setErr("");
    try {
      await ordersApi.adminUpdateStatus(order.id, { status: newStatus });
      onStatusChange(order.id, newStatus);
      setSuccessMsg("Statut mis à jour !");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setErr(getApiError(e));
    } finally { setUpdating(false); }
  }

  const user    = order.user ?? order.buyer ?? {};
  const items   = order.items ?? order.orderItems ?? [];
  const product = order.product ?? items[0]?.product ?? {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[17px] font-bold" style={{ color: "#1F4E46" }}>
            Achat #{String(order.id).slice(-6).toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

          {successMsg && (
            <div className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-green-700 bg-green-50 border border-green-200">
              {successMsg}
            </div>
          )}
          {err && (
            <div className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-red-600 bg-red-50 border border-red-200">
              {err}
            </div>
          )}

          {/* Client */}
          <div>
            <p className="text-[12px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Client</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-white text-[13px] font-bold">
                  {(user.username?.[0] ?? user.firstName?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "#0F172B" }}>
                  {user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "—"}
                </p>
                <p className="text-[12px] text-slate-400">{user.email ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Formation */}
          <div>
            <p className="text-[12px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Formation</p>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[14px] font-semibold truncate" style={{ color: "#0F172B" }}>
                  {product.name ?? order.productName ?? "—"}
                </p>
                {product.pv && (
                  <p className="text-[12px] text-slate-400">+{fmt(product.pv)} SNL</p>
                )}
              </div>
            </div>
          </div>

          {/* Infos */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Date", value: fmtDate(order.createdAt) },
              { label: "Montant", value: `${fmt(order.total ?? order.amount ?? order.price)} FCFA` },
              { label: "Statut paiement", value: order.isPaid === true ? "✓ Payé" : (order.paymentStatus ?? "En attente") },
              { label: "Via", value: order.paymentMethod ?? "Stripe" },
            ].map((row) => (
              <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 mb-0.5">{row.label}</p>
                <p className="text-[14px] font-semibold" style={{ color: "#0F172B" }}>{row.value}</p>
              </div>
            ))}
          </div>

          {/* Changer statut (remboursement, annulation manuelle) */}
          <div>
            <p className="text-[12px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Changer le statut</p>
            <div className="flex gap-2">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-secondary"
                style={{ color: "#0F172B" }}
              >
                {Object.entries(STATUS_INFO).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <button
                onClick={applyStatus}
                disabled={updating || newStatus === order.status}
                className="px-4 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-xl hover:brightness-110 transition cursor-pointer disabled:opacity-50 disabled:cursor-default"
              >
                {updating ? "…" : "Appliquer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CommandesManagement() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await ordersApi.adminGetAll(params);
      const raw = res.data?.data ?? res.data;
      setOrders(normalizeList(raw));
      setTotal(raw?.total ?? raw?.count ?? normalizeList(raw).length);
    } catch (e) {
      setError(getApiError(e));
    } finally { setLoading(false); }
  }, [page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  async function openDetail(order) {
    setSelected(order);
    setLoadingDetail(true);
    try {
      const res = await ordersApi.adminGetOne(order.id);
      setSelected(res.data?.data ?? res.data);
    } catch {
      // garde la version partielle
    } finally {
      setLoadingDetail(false);
    }
  }

  function handleStatusChange(id, newStatus) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    if (selected?.id === id) setSelected((prev) => ({ ...prev, status: newStatus }));
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Achats</h2>
        <p className="text-[13px] text-slate-400 mt-0.5">{total} achat{total !== 1 ? "s" : ""} au total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher un client ou un achat…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-secondary"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] outline-none focus:border-secondary min-w-[160px]"
          style={{ color: statusFilter ? "#0F172B" : "#94A3B8" }}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_INFO).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

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
                {["#", "Client", "Formation", "Montant", "Date", "Statut", ""].map((h) => (
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
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-[14px]">
                    Aucun achat trouvé
                  </td>
                </tr>
              ) : orders.map((order) => {
                const user = order.user ?? order.buyer ?? {};
                const items = order.items ?? order.orderItems ?? [];
                const product = order.product ?? items[0]?.product ?? {};
                const productName = product.name
                  ?? items[0]?.productName
                  ?? items[0]?.name
                  ?? order.productName
                  ?? "—";
                return (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-mono font-semibold" style={{ color: "#1F4E46" }}>
                        #{String(order.id).slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                          {user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "—"}
                        </p>
                        {user.email && (
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{user.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px]" style={{ color: "#334155" }}>{productName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                        {fmt(order.total ?? order.amount ?? order.price)} FCFA
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-slate-400">{fmtDate(order.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => openDetail(order)}
                        className="text-[13px] font-semibold text-secondary hover:underline cursor-pointer"
                      >
                        {loadingDetail && selected?.id === order.id ? "…" : "Voir"}
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
            <p className="text-[13px] text-slate-400">Page {page} / {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                ← Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <AchatDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
