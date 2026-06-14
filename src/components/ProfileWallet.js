"use client";

import { useEffect, useState } from "react";
import { walletApi, getApiError } from "@/lib/api";

function fmt(n) { return Number(n ?? 0).toLocaleString("fr-FR"); }
function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.transactions ?? raw?.items ?? [];
}

const TX_TYPE = {
  COMMISSION: { label: "Commission réseau", color: "#059669", credit: true },
  WITHDRAWAL: { label: "Retrait",           color: "#DC2626", credit: false },
  TRANSFER:   { label: "Transfert",         color: "#7C3AED", credit: false },
  DEPOSIT:    { label: "Dépôt",             color: "#2563EB", credit: true },
  REFUND:     { label: "Remboursement",     color: "#D97706", credit: true },
};

export default function ProfileWallet() {
  const [wallet, setWallet]             = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    Promise.allSettled([
      walletApi.getWallet(),
      walletApi.getTransactions({ limit: 10 }),
    ]).then(([walletRes, txRes]) => {
      if (walletRes.status === "fulfilled") {
        const raw = walletRes.value.data?.data ?? walletRes.value.data;
        setWallet(raw);
      }
      if (txRes.status === "fulfilled") {
        const raw = txRes.value.data?.data ?? txRes.value.data;
        setTransactions(normalizeList(raw));
      }
      if (walletRes.status === "rejected") setError(getApiError(walletRes.reason));
    }).finally(() => setLoading(false));
  }, []);

  const balance      = wallet?.balance ?? wallet?.availableBalance ?? 0;
  const totalEarned  = wallet?.totalEarned ?? wallet?.totalReceived ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-primary p-6 relative overflow-hidden">
        <div className="absolute pointer-events-none" style={{ right: -40, top: -40 }}>
          {[180, 130, 85].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/10"
              style={{ width: s, height: s, right: -s / 2, top: -s / 2 }} />
          ))}
        </div>
        <p className="text-white/60 text-[13px] mb-1 relative z-10">Solde SNL</p>
        {loading ? (
          <div className="h-10 w-40 bg-white/20 rounded-xl animate-pulse mb-3" />
        ) : (
          <p className="text-white text-[36px] font-bold leading-none mb-3 relative z-10">
            {fmt(balance)} <span className="text-[20px] font-normal text-white/60">SNL</span>
          </p>
        )}
        {totalEarned !== null && !loading && (
          <div className="relative z-10">
            <p className="text-white/50 text-[11px]">Total gagné</p>
            <p className="text-white text-[14px] font-semibold">{fmt(totalEarned)} SNL</p>
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="p-5">
        <h3 className="text-[15px] font-bold mb-4" style={{ color: "#0F172B" }}>Historique des transactions</h3>

        {error && <p className="text-[13px] text-red-500 mb-3">{error}</p>}

        {loading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M19 12l-7 7-7-7" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-[13px] text-slate-400">Aucune transaction pour l&apos;instant</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            {transactions.map((tx) => {
              const info = TX_TYPE[tx.type] ?? { label: tx.type ?? "Transaction", color: "#475569", credit: true };
              const isCredit = info.credit || tx.direction === "credit";
              return (
                <div key={tx.id} className="py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isCredit ? "#D1FAE5" : "#FEE2E2" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      {isCredit
                        ? <path d="M12 19V5M5 12l7-7 7 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        : <path d="M12 5v14M19 12l-7 7-7-7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      }
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{info.label}</p>
                    <p className="text-[11px] text-slate-400">{fmtDate(tx.createdAt)}</p>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: isCredit ? "#059669" : "#DC2626" }}>
                    {isCredit ? "+" : "-"}{fmt(Math.abs(tx.amount ?? tx.value))} SNL
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
