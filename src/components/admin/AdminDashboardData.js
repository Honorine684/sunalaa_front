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

export default function AdminDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    healthApi.check()
      .then(() => setApiStatus("up"))
      .catch(() => setApiStatus("down"));

    adminApi.getDashboard()
      .then((res) => setData(res.data?.data ?? res.data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  // API: { users: { total, active, newToday }, orders: { total, pending, revenue }, financials: { pendingWithdrawals, pendingCommissions } }
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
    checking: { dot: "bg-yellow-400 animate-pulse", text: "Vérification…",   color: "text-yellow-600" },
    up:       { dot: "bg-green-500",                text: "API opérationnelle", color: "text-green-600" },
    down:     { dot: "bg-red-500",                  text: "API inaccessible",  color: "text-red-600"   },
  };
  const s = statusConfig[apiStatus];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
        <span className={`text-[12px] font-semibold ${s.color}`}>{s.text}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBg={card.iconBg}
            trend={card.trend}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>
    </div>
  );
}
