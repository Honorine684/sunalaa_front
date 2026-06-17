"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { adminApi, getApiError } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1";

function AuthImage({ url, label }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const objRef = useRef(null);

  useEffect(() => {
    if (!url) return;
    const fullUrl = url.startsWith("http") ? url : `${API_BASE.replace("/api/v1", "")}${url}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("snl_access_token") : null;
    fetch(fullUrl, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); })
      .then((blob) => {
        const obj = URL.createObjectURL(blob);
        objRef.current = obj;
        setSrc(obj);
      })
      .catch(() => setSrc(null))
      .finally(() => setLoading(false));
    return () => { if (objRef.current) URL.revokeObjectURL(objRef.current); };
  }, [url]);

  if (!url) return null;
  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
        <div
          onClick={() => src && setLightbox(true)}
          className="w-full h-40 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 relative"
          style={{ cursor: src ? "zoom-in" : "default" }}>
          {loading ? (
            <svg className="animate-spin w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : src ? (
            <>
              <img src={src} alt={label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-center justify-center">
                <svg className="opacity-0 hover:opacity-100 w-7 h-7 text-white drop-shadow" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </>
          ) : (
            <p className="text-[12px] text-slate-400">Impossible de charger</p>
          )}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-[13px] font-semibold uppercase tracking-widest">{label}</p>
          <img src={src} alt={label} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

const DOC_LABELS = {
  national_id:      "Carte nationale d'identité",
  id_card:          "Carte nationale d'identité",
  passport:         "Passeport",
  driving_license:  "Permis de conduire",
  residence_permit: "Titre de séjour",
  other:            "Autre document",
};

const STATUS_INFO = {
  PENDING:   { label: "En attente",  bg: "#FEF9C3", color: "#854D0E" },
  APPROVED:  { label: "Approuvé",    bg: "#D1FAE5", color: "#065F46" },
  REJECTED:  { label: "Rejeté",      bg: "#FEE2E2", color: "#7F1D1D" },
};

function StatusBadge({ status }) {
  const info = STATUS_INFO[status] ?? { label: status, bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold"
      style={{ backgroundColor: info.bg, color: info.color }}>{info.label}</span>
  );
}

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.kyc ?? raw?.items ?? [];
}

function ReviewModal({ request, onClose, onReview }) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  async function submit(status) {
    if (status === "REJECTED" && !reason.trim()) {
      setError("Un motif est requis pour un rejet."); return;
    }
    setLoading(true); setError("");
    try {
      await adminApi.reviewKyc(request.id, { status, reason: reason.trim() || undefined });
      onReview(request.id, status);
      onClose();
    } catch (err) {
      setError(getApiError(err));
    } finally { setLoading(false); }
  }

  const user = request.user ?? {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[17px] font-bold" style={{ color: "#1F4E46" }}>Vérification KYC</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* User info */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-[13px] font-bold">
                {(user.username?.[0] ?? user.firstName?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-semibold" style={{ color: "#0F172B" }}>
                {user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
              </p>
              <p className="text-[12px] text-slate-400">{user.email ?? "—"}</p>
            </div>
          </div>

          {/* KYC fields */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Type de pièce", value: DOC_LABELS[request.documentType ?? request.idType] ?? request.documentType ?? request.idType ?? "—" },
              { label: "Numéro", value: request.documentNumber ?? request.idNumber ?? "—" },
              { label: "Soumis le", value: fmtDate(request.createdAt) },
              { label: "Statut actuel", value: <StatusBadge status={request.status} /> },
            ].map((row) => (
              <div key={row.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-400 mb-0.5">{row.label}</p>
                <div className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{row.value}</div>
              </div>
            ))}
          </div>

          {/* Documents */}
          {(request.documentFront ?? request.documentUrl ?? request.frontImage) && (
            <div>
              <p className="text-[12px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Documents soumis</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <AuthImage label="Recto" url={request.documentFront ?? request.frontImage ?? request.documentUrl} />
                <AuthImage label="Verso" url={request.documentBack ?? request.backImage} />
                <AuthImage label="Selfie" url={request.selfie ?? request.selfieImage} />
              </div>
            </div>
          )}

          {error && <p className="text-[13px] text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          {request.status === "PENDING" && (
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
              {!rejectMode ? (
                <div className="flex gap-3">
                  <button type="button" disabled={loading} onClick={() => submit("APPROVED")}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-green-500 text-white hover:brightness-110 transition cursor-pointer disabled:opacity-60">
                    {loading ? "Envoi…" : "✓ Approuver"}
                  </button>
                  <button type="button" disabled={loading} onClick={() => setRejectMode(true)}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition cursor-pointer disabled:opacity-60">
                    ✕ Rejeter
                  </button>
                </div>
              ) : (
                <>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                    placeholder="Motif du rejet (obligatoire)…"
                    rows={3}
                    className="border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-secondary resize-none" />
                  <div className="flex gap-3">
                    <button type="button" disabled={loading} onClick={() => { setRejectMode(false); setReason(""); setError(""); }}
                      className="flex-1 py-2.5 rounded-xl text-[13px] border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer disabled:opacity-60">
                      Annuler
                    </button>
                    <button type="button" disabled={loading} onClick={() => submit("REJECTED")}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-red-500 text-white hover:brightness-110 transition cursor-pointer disabled:opacity-60">
                      {loading ? "Envoi…" : "Confirmer le rejet"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KycManagement() {
  const [requests, setRequests]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [page, setPage]                 = useState(1);
  const [total, setTotal]               = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected]         = useState(null);
  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const res = await adminApi.getKycRequests(params);
      const raw = res.data?.data ?? res.data;
      setRequests(normalizeList(raw));
      setTotal(raw?.total ?? raw?.count ?? normalizeList(raw).length);
    } catch (e) { setError(getApiError(e)); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function handleReview(id, decision) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: decision } : r));
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[22px] font-bold" style={{ color: "#1F4E46" }}>Vérification KYC</h2>
        <p className="text-[13px] text-slate-400 mt-0.5">{total} demande{total !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[["", "Toutes"], ["PENDING", "En attente"], ["APPROVED", "Approuvées"], ["REJECTED", "Rejetées"]].map(([v, label]) => (
          <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition cursor-pointer border ${
              statusFilter === v ? "bg-primary text-white border-primary" : "border-slate-200 text-slate-500 hover:bg-slate-50"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {["Membre", "Type de pièce", "Numéro", "Soumis le", "Statut", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    {[...Array(6)].map((__, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>)}
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-[14px]">Aucune demande KYC</td></tr>
              ) : requests.map((r) => {
                const user = r.user ?? {};
                return (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                          {user.username || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "—"}
                        </p>
                        {user.email && <p className="text-[11px] text-slate-400">{user.email}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-[13px]" style={{ color: "#334155" }}>{DOC_LABELS[r.documentType ?? r.idType] ?? r.documentType ?? r.idType ?? "—"}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[13px] font-mono" style={{ color: "#334155" }}>{r.documentNumber ?? r.idNumber ?? "—"}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[13px] text-slate-400">{fmtDate(r.createdAt)}</span></td>
                    <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(r)}
                        className="text-[13px] font-semibold text-secondary hover:underline cursor-pointer">
                        {r.status === "PENDING" ? "Examiner" : "Voir"}
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
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default">← Précédent</button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-[13px] hover:bg-slate-50 transition disabled:opacity-40 cursor-pointer disabled:cursor-default">Suivant →</button>
            </div>
          </div>
        )}
      </div>

      {selected && <ReviewModal request={selected} onClose={() => setSelected(null)} onReview={handleReview} />}
    </div>
  );
}
