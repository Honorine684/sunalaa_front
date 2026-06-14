"use client";

import { useState, useEffect, useCallback } from "react";
import { usersApi, getApiError } from "@/lib/api";

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

export default function ProfileTransfer({ onTransferComplete }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount]       = useState("");
  const [note, setNote]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(null);

  const [history, setHistory]         = useState([]);
  const [histLoading, setHistLoading] = useState(true);

  const fetchHistory = useCallback(() => {
    setHistLoading(true);
    usersApi.getPointsHistory({ limit: 20 })
      .then((res) => {
        const payload = res?.data?.data ?? res?.data;
        const raw     = payload?.data ?? payload;
        const list    = Array.isArray(raw) ? raw : [];
        setHistory(list.filter((t) =>
          t.source === "transfer_out" || t.source === "transfer_in" ||
          t.type   === "TRANSFER_OUT" || t.type   === "TRANSFER_IN" ||
          String(t.source ?? t.type ?? "").toLowerCase().includes("transfer")
        ));
      })
      .catch(() => {})
      .finally(() => setHistLoading(false));
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!recipient.trim() || !amount) return;
    setLoading(true); setError(""); setSuccess(null);
    try {
      const res  = await usersApi.transferPoints({
        recipient: recipient.trim(),
        amount:    Number(amount),
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      const data = res.data?.data ?? res.data;
      setSuccess(data);
      setRecipient(""); setAmount(""); setNote("");
      fetchHistory();
      if (onTransferComplete && data?.newBalance != null) onTransferComplete(data.newBalance);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="col-span-12">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EEF2FF" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7-7 7 7" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[16px] font-bold" style={{ color: "#0F172B" }}>SNL Transfer</h3>
            <p className="text-[12px] text-slate-400">Send SNL points to another member</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

          {/* Left — formulaire */}
          <div className="p-6">
            <h4 className="text-[14px] font-semibold text-slate-700 mb-4">Send SNL</h4>

            {success && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <circle cx="12" cy="12" r="10" fill="#D1FAE5"/>
                  <path d="M7 12l4 4 6-6" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <p className="text-[13px] font-semibold text-green-700">
                    Transfer sent to {success.recipient?.username ?? success.recipient?.firstName ?? "the user"} !
                  </p>
                  <p className="text-[12px] text-green-600">New balance: {fmt(success.newBalance)} SNL</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Recipient
                </label>
                <input
                  value={recipient}
                  onChange={(e) => { setRecipient(e.target.value); setError(""); setSuccess(null); }}
                  placeholder="Username or email"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Amount (SNL)
                </label>
                <div className="relative">
                  <input
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setError(""); setSuccess(null); }}
                    type="number"
                    min="1"
                    step="1"
                    placeholder="0"
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-16 text-[14px] outline-none focus:border-primary transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-slate-400">SNL</span>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Note <span className="font-normal normal-case text-slate-400">(optional)</span>
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Transfer reason…"
                  maxLength={100}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary transition"
                />
              </div>

              {error && (
                <p className="text-[13px] text-red-500 bg-red-50 px-3 py-2.5 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !recipient.trim() || !amount}
                className="w-full py-3 rounded-xl text-white font-semibold text-[14px] transition hover:brightness-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#1F4E46" }}
              >
                {loading ? "Sending…" : "Send SNL"}
              </button>
            </form>
          </div>

          {/* Right — historique */}
          <div className="p-6">
            <h4 className="text-[14px] font-semibold text-slate-700 mb-4">Transfer history</h4>

            {histLoading ? (
              <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                    <div className="h-4 bg-slate-100 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mb-3 text-slate-200">
                  <path d="M8 7h12M8 12h8M8 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-[13px] text-slate-400">No transfers yet</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((t, i) => {
                  const isSent = t.source === "transfer_out" || t.type === "TRANSFER_OUT" || (t.amount < 0);
                  return (
                    <div key={t.id ?? i} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: isSent ? "#FEE2E2" : "#D1FAE5" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          {isSent
                            ? <path d="M12 19V5M5 12l7-7 7 7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            : <path d="M12 5v14M5 12l7 7 7-7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          }
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold truncate" style={{ color: "#0F172B" }}>
                          {t.description ?? (isSent ? "Transfer sent" : "Transfer received")}
                        </p>
                        <p className="text-[11px] text-slate-400">{fmtDate(t.createdAt)}</p>
                      </div>
                      <span
                        className="text-[13px] font-bold shrink-0"
                        style={{ color: isSent ? "#EF4444" : "#10B981" }}
                      >
                        {isSent ? "-" : "+"}{fmt(Math.abs(t.amount))} SNL
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
