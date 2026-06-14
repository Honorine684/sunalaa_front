"use client";

import { useEffect, useState } from "react";
import { commissionsApi, getApiError } from "@/lib/api";

const STATUS_INFO = {
  PENDING:  { label: "Pending",  bg: "#FEF9C3", color: "#854D0E" },
  APPROVED: { label: "Approved", bg: "#D1FAE5", color: "#065F46" },
  REJECTED: { label: "Rejected", bg: "#FEE2E2", color: "#7F1D1D" },
  PAID:     { label: "Paid",     bg: "#DCFCE7", color: "#14532D" },
};

function StatusBadge({ status }) {
  const info = STATUS_INFO[status] ?? { label: status, bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: info.bg, color: info.color }}>
      {info.label}
    </span>
  );
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.commissions ?? raw?.items ?? [];
}

export default function ProfileCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [summary, setSummary]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    Promise.allSettled([
      commissionsApi.getMy({ limit: 10 }),
      commissionsApi.getSummary(),
    ]).then(([listRes, summaryRes]) => {
      if (listRes.status === "fulfilled") {
        const raw = listRes.value.data?.data ?? listRes.value.data;
        setCommissions(normalizeList(raw));
      }
      if (summaryRes.status === "fulfilled") {
        const raw = summaryRes.value.data?.data ?? summaryRes.value.data;
        setSummary(raw);
      }
      if (listRes.status === "rejected") setError(getApiError(listRes.reason));
    }).finally(() => setLoading(false));
  }, []);

  const totalEarned  = summary?.totalEarned  ?? summary?.total  ?? summary?.approved ?? null;
  const totalPending = summary?.totalPending ?? summary?.pending ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-[18px] font-bold mb-4" style={{ color: "#0F172B" }}>My commissions</h3>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-primary rounded-xl p-4">
            <p className="text-white/60 text-[11px] mb-1">Total earned</p>
            <p className="text-white text-[18px] font-bold">{fmt(totalEarned)} SNL</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-slate-400 text-[11px] mb-1">Pending</p>
            <p className="text-[18px] font-bold" style={{ color: "#854D0E" }}>{fmt(totalPending)} SNL</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl" />)}
        </div>
      )}

      {error && <p className="text-[13px] text-red-500">{error}</p>}

      {!loading && !error && commissions.length === 0 && (
        <div className="flex flex-col items-center py-6 gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="5" stroke="#CBD5E1" strokeWidth="2"/>
              <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[13px] text-slate-400">No commissions yet</p>
        </div>
      )}

      {!loading && commissions.length > 0 && (
        <div className="flex flex-col divide-y divide-slate-50">
          {commissions.map((c) => (
            <div key={c.id} className="py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="5" stroke="#3FAE8C" strokeWidth="2"/>
                  <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
                  {c.type ?? c.reason ?? "Network commission"}
                </p>
                <p className="text-[11px] text-slate-400">{fmtDate(c.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[13px] font-bold" style={{ color: "#1F4E46" }}>
                  +{fmt(c.amount ?? c.value)} SNL
                </span>
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
