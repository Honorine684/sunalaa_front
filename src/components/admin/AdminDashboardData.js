"use client";

import { useEffect, useState } from "react";
import { adminApi, healthApi, getApiError } from "@/lib/api";
import StatCard from "./StatCard";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function fmt(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString("fr-FR");
}

function pct(a, b) {
  if (!b) return null;
  return Math.round((a / b) * 100);
}

/* ── Live stat card (pulsing dot) ── */
function LiveStatCard({ count, loading }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#ECFDF5" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" fill="#059669"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#059669" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-green-600">Live</span>
        </div>
      </div>
      <p className="text-[13px] mb-1" style={{ color: "#45556C" }}>Connectés maintenant</p>
      {loading
        ? <div className="animate-pulse h-8 w-16 bg-slate-200 rounded mt-1" />
        : <p className="text-[28px] font-bold leading-none" style={{ color: "#1F4E46" }}>{fmt(count)}</p>
      }
      <p className="text-[11px] mt-1.5" style={{ color: "#94A3B8" }}>actifs dans les 5 dernières min.</p>
    </div>
  );
}

/* ── Notification stat card ── */
function NotifStatCard({ totalViews, totalRecipients, totalClicks, loading }) {
  const rate = pct(totalViews, totalRecipients);
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EFF6FF" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {rate != null && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3B82F6" }}>
            {rate}% lu
          </span>
        )}
      </div>
      <p className="text-[13px] mb-1" style={{ color: "#45556C" }}>Notifications vues</p>
      {loading
        ? <div className="animate-pulse h-8 w-20 bg-slate-200 rounded mt-1" />
        : <p className="text-[28px] font-bold leading-none" style={{ color: "#1F4E46" }}>{totalViews != null ? fmt(totalViews) : "—"}</p>
      }
      <p className="text-[11px] mt-1.5" style={{ color: "#94A3B8" }}>
        {totalClicks != null ? `${fmt(totalClicks)} clics · ` : ""}
        {fmt(totalRecipients)} destinataires au total
      </p>
    </div>
  );
}

export default function AdminDashboardData() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [apiStatus, setApiStatus] = useState("checking");

  // Presence
  const [onlineCount, setOnlineCount]     = useState(null);
  const [onlineLoading, setOnlineLoading] = useState(true);

  // Notification stats
  const [notifStats, setNotifStats]       = useState({ totalViews: null, totalRecipients: 0, totalClicks: null });
  const [notifLoading, setNotifLoading]   = useState(true);

  useEffect(() => {
    // Health check
    healthApi.check()
      .then(() => setApiStatus("up"))
      .catch(() => setApiStatus("down"));

    // Dashboard
    adminApi.getDashboard()
      .then((res) => setData(res.data?.data ?? res.data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));

    // Notification history stats
    adminApi.getNotificationsHistory({ page: 1, limit: 100 })
      .then((res) => {
        const list = res.data?.data?.data ?? res.data?.data ?? res.data ?? [];
        const items = Array.isArray(list) ? list : [];
        const totalRecipients = items.reduce((acc, n) => acc + (n.recipientCount ?? 0), 0);
        const hasViews  = items.some((n) => n.viewCount  != null);
        const hasClicks = items.some((n) => n.clickCount != null);
        const totalViews  = hasViews  ? items.reduce((acc, n) => acc + (n.viewCount  ?? 0), 0) : null;
        const totalClicks = hasClicks ? items.reduce((acc, n) => acc + (n.clickCount ?? 0), 0) : null;
        setNotifStats({ totalViews, totalRecipients, totalClicks });
      })
      .catch(() => {})
      .finally(() => setNotifLoading(false));

    // Presence — initial fetch then poll every 30s
    const fetchOnline = () => {
      fetch("/api/presence")
        .then((r) => r.json())
        .then((d) => setOnlineCount(d.count ?? 0))
        .catch(() => {})
        .finally(() => setOnlineLoading(false));
    };
    fetchOnline();
    const pollId = setInterval(fetchOnline, 30_000);
    return () => clearInterval(pollId);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  const activeRate = data?.users?.total
    ? Math.round((data.users.active / data.users.total) * 100)
    : null;

  const cards = [
    {
      label: "Utilisateurs totaux",
      value: fmt(data?.users?.total),
      trend: data?.users?.newToday != null ? `+${data.users.newToday} auj.` : null,
      iconBg: "#EFF6FF",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Utilisateurs actifs",
      value: fmt(data?.users?.active),
      trend: activeRate != null ? `${activeRate}%` : null,
      iconBg: "#D1FAE5",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      label: "Commandes totales",
      value: fmt(data?.orders?.total),
      trend: data?.orders?.pending != null ? `${fmt(data.orders.pending)} en attente` : null,
      iconBg: "#FEF3C7",
      icon: (
        <div className="relative w-8 h-5 shrink-0">
          <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
          <div className="absolute left-3 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
        </div>
      ),
    },
    {
      label: "Retraits en attente",
      value: fmt(data?.financials?.pendingWithdrawals),
      trend: data?.financials?.pendingCommissions != null ? `${fmt(data.financials.pendingCommissions)} commissions` : null,
      iconBg: "#EDE9FE",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 7h6v6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const statusConfig = {
    checking: { dot: "bg-yellow-400 animate-pulse", text: "Vérification…",     color: "text-yellow-600" },
    up:       { dot: "bg-green-500",                text: "API opérationnelle", color: "text-green-600"  },
    down:     { dot: "bg-red-500",                  text: "API inaccessible",   color: "text-red-600"    },
  };
  const s = statusConfig[apiStatus];

  return (
    <div className="flex flex-col gap-5">
      {/* API status */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
        <span className={`text-[12px] font-semibold ${s.color}`}>{s.text}</span>
      </div>

      {/* Row 1 — main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <StatCard key={card.label} icon={card.icon} iconBg={card.iconBg} trend={card.trend} label={card.label} value={card.value} />
        ))}
      </div>

      {/* Row 2 — live activity */}
      <div>
        <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#94A3B8" }}>Activité en direct</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <LiveStatCard count={onlineCount} loading={onlineLoading} />
          <NotifStatCard
            totalViews={notifStats.totalViews}
            totalRecipients={notifStats.totalRecipients}
            totalClicks={notifStats.totalClicks}
            loading={notifLoading}
          />
        </div>
      </div>
    </div>
  );
}
