"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usersApi, getApiError } from "@/lib/api";
import { getTransactionLabel } from "@/lib/transactionLabel";

const COLORS = ["#3FAE8C", "#8B5CF6", "#3B82F6", "#F59E0B", "#EF4444", "#1F4E46"];

function getColor(username) {
  if (!username) return COLORS[0];
  return COLORS[username.charCodeAt(0) % COLORS.length];
}

function getInitials(user) {
  if (user?.username) return user.username[0].toUpperCase();
  const first = user?.firstName?.[0] ?? user?.first_name?.[0] ?? "";
  const last  = user?.lastName?.[0]  ?? user?.last_name?.[0]  ?? "";
  return (first + last).toUpperCase() || "?";
}

function getDisplayName(user) {
  if (!user) return "";
  if (user.username) return user.username;
  const full = [user.firstName ?? user.first_name, user.lastName ?? user.last_name].filter(Boolean).join(" ");
  return full || user.email || "—";
}

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ user, size = 36 }) {
  const color = getColor(user?.username);
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-bold text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
    >
      {getInitials(user)}
    </div>
  );
}

/* ─── RecipientSearch ────────────────────────────────────────────── */
function RecipientSearch({ selected, onSelect, onClear, error, onErrorClear }) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen]         = useState(false);
  const [noResult, setNoResult] = useState(false);
  const timer  = useRef(null);
  const wrapRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function handleInput(e) {
    const val = e.target.value;
    setQuery(val);
    onErrorClear();
    setNoResult(false);
    setResults([]);
    if (timer.current) clearTimeout(timer.current);

    if (val.trim().length < 2) { setOpen(false); setSearching(false); return; }

    setSearching(true);
    setOpen(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await usersApi.searchByUsername(val.trim());
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : (raw?.users ?? raw?.results ?? []);
        setResults(list);
        setNoResult(list.length === 0);
      } catch {
        setResults([]);
        setNoResult(true);
      } finally {
        setSearching(false);
      }
    }, 500);
  }

  function pick(user) {
    onSelect(user);
    setQuery("");
    setOpen(false);
    setResults([]);
  }

  // If already selected → show confirmation card
  if (selected) {
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{ borderColor: "#3FAE8C", backgroundColor: "rgba(63,174,140,0.06)" }}
      >
        <Avatar user={selected} size={38} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold truncate" style={{ color: "#0F172B" }}>
            @{getDisplayName(selected)}
          </p>
          {selected.email && (
            <p className="text-[11px] text-slate-400 truncate">{selected.email}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
          title="Change recipient"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          width="15" height="15" viewBox="0 0 24 24" fill="none"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by username…"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className={`w-full border rounded-xl pl-10 pr-10 py-3 text-[14px] outline-none focus:border-primary transition ${error ? "border-red-300 bg-red-50/30" : "border-slate-200"}`}
        />
        {searching && (
          <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        )}
        {query && !searching && (
          <button
            type="button"
            onClick={() => { setQuery(""); setResults([]); setOpen(false); setNoResult(false); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <ul className="py-1 max-h-52 overflow-y-auto">
              {results.map((u) => (
                <li key={u.id ?? u.username}>
                  <button
                    type="button"
                    onClick={() => pick(u)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <Avatar user={u} size={34} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "#0F172B" }}>
                        @{u.username ?? getDisplayName(u)}
                      </p>
                      {(u.firstName || u.lastName) && (
                        <p className="text-[11px] text-slate-400 truncate">
                          {[u.firstName, u.lastName].filter(Boolean).join(" ")}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : noResult ? (
            <div className="px-4 py-4 text-center text-[13px] text-slate-400">
              No user found for <strong>"{query}"</strong>
            </div>
          ) : (
            <div className="px-4 py-4 text-center text-[13px] text-slate-400">
              Searching…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Token Countdown ────────────────────────────────────────────── */
function useCountdown() {
  const exchangeDate = new Date(process.env.NEXT_PUBLIC_SNL_EXCHANGE_DATE || "2026-10-18");
  const launchDate   = new Date(process.env.NEXT_PUBLIC_SNL_LAUNCH_DATE   || "2026-06-18");

  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0, progress: 0, done: false, exchangeDate, ready: false };

  const total     = exchangeDate - launchDate;
  const elapsed   = Math.max(0, now - launchDate);
  const remaining = Math.max(0, exchangeDate - now);
  const progress  = Math.min(100, (elapsed / total) * 100);

  const days    = Math.floor(remaining / 86400000);
  const hours   = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return { days, hours, minutes, seconds, progress, done: remaining === 0, exchangeDate, ready: true };
}

function TokenCountdown() {
  const { days, hours, minutes, seconds, progress, done, exchangeDate, ready } = useCountdown();

  const dateStr = exchangeDate.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

  if (!ready) return (
    <div className="mx-6 mt-5 mb-1 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3A34 0%, #1F4E46 100%)" }}>
      <div className="px-5 py-4 h-30 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
    </div>
  );

  return (
    <div className="mx-6 mt-5 mb-1 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3A34 0%, #1F4E46 100%)" }}>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(230,184,76,0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-bold text-white">Token Exchange</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{dateStr}</p>
            </div>
          </div>
          {done ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: "rgba(63,174,140,0.2)", color: "#3FAE8C" }}>
              Live
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={{ backgroundColor: "rgba(230,184,76,0.15)", color: "#E6B84C" }}>
              Upcoming
            </span>
          )}
        </div>

        {done ? (
          <p className="text-[13px] font-semibold text-center py-1" style={{ color: "#3FAE8C" }}>
            🎉 Token exchange is now live!
          </p>
        ) : (
          <>
            {/* Countdown */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { value: days,    label: "Days" },
                { value: hours,   label: "Hours" },
                { value: minutes, label: "Min" },
                { value: seconds, label: "Sec" },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center py-2 px-1 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                  <span className="text-[22px] font-bold tabular-nums leading-none text-white">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Progress</span>
                <span className="text-[11px] font-semibold" style={{ color: "#E6B84C" }}>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3FAE8C, #E6B84C)" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function ProfileTransfer({ onTransferComplete }) {
  const locale = useLocale();
  const t = useTranslations("transactions");
  const [recipientUser, setRecipientUser] = useState(null);
  const [amount, setAmount]   = useState("");
  const [note, setNote]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(null);

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
    if (!recipientUser || !amount) return;
    setLoading(true); setError(""); setSuccess(null);
    try {
      const res = await usersApi.transferPoints({
        recipient: recipientUser.username ?? recipientUser.id,
        amount:    Number(amount),
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      const data = res.data?.data ?? res.data;
      setSuccess({ ...data, recipientUser });
      setRecipientUser(null); setAmount(""); setNote("");
      fetchHistory();
      if (onTransferComplete && data?.newBalance != null) onTransferComplete(data.newBalance);
    } catch (err) {
      const msg = err?.response?.data?.message;
      const code = (msg && typeof msg === "object") ? msg.code : msg;
      if (code === "KYC_REQUIRED_SENDER") {
        setError(locale === "fr"
          ? "Vous devez vérifier votre identité pour envoyer des points"
          : "You must verify your identity to send points");
      } else if (code === "KYC_REQUIRED_RECIPIENT") {
        setError(locale === "fr"
          ? "Ce destinataire n'a pas encore vérifié son identité"
          : "This recipient has not verified their identity yet");
      } else {
        setError(getApiError(err));
      }
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
                    Transfer sent to @{getDisplayName(success.recipientUser)} !
                  </p>
                  <p className="text-[12px] text-green-600">New balance: {fmt(success.newBalance)} SNL</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Recipient search */}
              <div>
                <label className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Recipient
                </label>
                <RecipientSearch
                  selected={recipientUser}
                  onSelect={(u) => { setRecipientUser(u); setError(""); setSuccess(null); }}
                  onClear={() => { setRecipientUser(null); setError(""); setSuccess(null); }}
                  error={!!error && !recipientUser}
                  onErrorClear={() => setError("")}
                />
              </div>

              {/* Amount */}
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

              {/* Note */}
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
                disabled={loading || !recipientUser || !amount}
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
                    <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
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
                {history.map((tx, i) => {
                  const isSent = tx.source === "transfer_out" || tx.type === "TRANSFER_OUT" || (tx.amount < 0);
                  return (
                    <div key={tx.id ?? i} className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
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
                          {getTransactionLabel(tx.source ?? tx.type, tx.description ?? "", t)}
                        </p>
                        <p className="text-[11px] text-slate-400">{fmtDate(tx.createdAt)}</p>
                      </div>
                      <span
                        className="text-[13px] font-bold shrink-0"
                        style={{ color: isSent ? "#EF4444" : "#10B981" }}
                      >
                        {isSent ? "-" : "+"}{fmt(Math.abs(tx.amount))} SNL
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Token conversion countdown */}
      <div className="mt-4 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A3A34 0%, #1F4E46 100%)" }}>
        <div className="px-5 pt-5 pb-2 text-center">
          <p className="text-[13px] font-semibold text-white mb-0.5">
            {locale === "fr"
              ? "Conversion des points SNL en token SUNALA"
              : "SNL points conversion to SUNALA token"}
          </p>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {locale === "fr"
              ? "À la fin du compte à rebours, vos points SNL seront convertis en tokens SUNALA réels."
              : "When the countdown ends, your SNL points will be converted into real SUNALA tokens."}
          </p>
        </div>
        <TokenCountdown />
      </div>
    </div>
  );
}
