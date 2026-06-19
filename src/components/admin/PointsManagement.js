"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

function fmt(n) { return Number(n ?? 0).toLocaleString("fr-FR"); }

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

/* ── Modal ── */
function AdjustModal({ type, onClose, onSuccess }) {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isAdd = type === "add";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userId.trim() || !amount || !justification.trim()) {
      setError("Tous les champs sont requis.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await adminApi.adjustPoints(userId.trim(), {
        amount: Math.abs(Number(amount)),
        justification: justification.trim(),
        type: isAdd ? "credit" : "debit",
      });
      onSuccess();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-bold" style={{ color: "#0F172B" }}>
            {isAdd ? "Ajouter des points SNL" : "Retirer des points SNL"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-[13px]" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "#45556C" }}>ID utilisateur</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ex: caeea2cb-ada7-..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-secondary/30 transition"
              style={{ color: "#0F172B" }}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "#45556C" }}>Montant SNL</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="ex: 500"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-secondary/30 transition"
              style={{ color: "#0F172B" }}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium mb-1.5 block" style={{ color: "#45556C" }}>Justification</label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Raison de l'ajustement..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-secondary/30 transition resize-none"
              style={{ color: "#0F172B" }}
            />
          </div>

          <div className="flex gap-3 mt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-[14px] font-semibold border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              style={{ color: "#45556C" }}>
              Annuler
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-3 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: isAdd ? "#3FAE8C" : "#E11D48" }}>
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {loading ? "En cours..." : isAdd ? "Ajouter" : "Retirer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const COLS = ["DATE & HEURE", "UTILISATEUR", "MONTANT", "JUSTIFICATION", "ADMIN"];

export default function PointsManagement() {
  const [modal, setModal]       = useState(null);
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError]       = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await adminApi.getPointsHistory({ page: 1, limit: 50 });
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
      console.log("[PointsHistory] first item:", JSON.stringify(list[0], null, 2));
      setHistory(list);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  function handleSuccess() {
    setModal(null);
    setSuccessMsg("Opération effectuée avec succès.");
    setTimeout(() => setSuccessMsg(""), 4000);
    loadHistory();
  }

  const filtered = history.filter((h) => {
    const name = (h?.user?.username ?? h?.user?.firstName ?? h?.userName ?? h?.name ?? "").toLowerCase();
    const just = (h?.justification ?? h?.reason ?? "").toLowerCase();
    return !search || name.includes(search.toLowerCase()) || just.includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6">

      {modal && <AdjustModal type={modal} onClose={() => setModal(null)} onSuccess={handleSuccess} />}

      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Gestion des points SNL</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Ajuster les soldes de points et consulter l&apos;historique</p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px]" style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #D1FAE5" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {successMsg}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl px-5 py-4 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#FDE68A" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-[13px] leading-relaxed" style={{ color: "#92400E" }}>
          Toute modification est enregistrée dans l&apos;historique. Assurez-vous de la légitimité de l&apos;action avant de confirmer.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-[13px]" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5">
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
          <button onClick={() => setModal("add")}
            className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
            style={{ backgroundColor: "#3FAE8C" }}>
            Ajouter des points
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-5">
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
          <button onClick={() => setModal("remove")}
            className="w-full py-3.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
            style={{ backgroundColor: "#E11D48" }}>
            Retirer des points
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M1 4v6h6" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7v5l4 2" stroke="#0F172B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className="text-[18px] font-bold" style={{ color: "#0F172B" }}>Historique des modifications</h3>
        </div>

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
            className="w-full rounded-xl pl-10 pr-4 py-3 text-[14px] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-secondary/30 transition border border-slate-200"
            style={{ color: "#45556C" }}
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <div className="bg-white min-w-[640px]">
            <div className="grid grid-cols-[1.2fr_2fr_1fr_2.5fr_1fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
              {COLS.map((col) => (
                <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>{col}</span>
              ))}
            </div>

            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-[1.2fr_2fr_1fr_2.5fr_1fr] px-6 py-4 items-center border-b border-slate-100 gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-36" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="px-6 py-12 text-center text-[14px]" style={{ color: "#45556C" }}>
                Aucune modification enregistrée.
              </div>
            ) : (
              filtered.map((row, i) => {
                const amount = row?.amount ?? 0;
                const isCredit = row?.type === "credit";
                const name = row?.user?.username || [row?.user?.firstName, row?.user?.lastName].filter(Boolean).join(" ") || "—";
                const initials = name[0]?.toUpperCase() || "?";
                const createdAt = row?.createdAt ?? row?.date;
                return (
                  <div key={row?.id ?? i}
                    className={["grid grid-cols-[1.2fr_2fr_1fr_2.5fr_1fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors", i < filtered.length - 1 ? "border-b border-slate-100" : ""].join(" ")}>
                    <div>
                      <p className="text-[13px]" style={{ color: "#45556C" }}>
                        {createdAt ? new Date(createdAt).toLocaleDateString("fr-FR") : "—"}
                      </p>
                      <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                        {createdAt ? new Date(createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                        <span className="text-white text-[12px] font-bold">{initials}</span>
                      </div>
                      <span className="text-[14px] font-normal" style={{ color: "#0F172B" }}>{name}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[13px] font-bold" style={{ color: isCredit ? "#059669" : "#E11D48" }}>
                        {isCredit ? "+" : "−"}
                      </span>
                      <div>
                        <p className="text-[14px] font-bold leading-none" style={{ color: isCredit ? "#059669" : "#E11D48" }}>
                          {fmt(Math.abs(amount))}
                        </p>
                        <p className="text-[11px] font-bold" style={{ color: isCredit ? "#059669" : "#E11D48" }}>SNL</p>
                      </div>
                    </div>
                    <span className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>
                      {row?.justification ?? row?.reason ?? "—"}
                    </span>
                    <span className="text-[14px]" style={{ color: "#45556C" }}>
                      {row?.adminUser?.username || [row?.adminUser?.firstName, row?.adminUser?.lastName].filter(Boolean).join(" ") || "Admin"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
