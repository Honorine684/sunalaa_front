"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `il y a ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  return `il y a ${Math.floor(m / 60)}h`;
}

function initials(name, email) {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

const AVATAR_COLORS = ["#3FAE8C", "#1F4E46", "#E6B84C", "#3B82F6", "#8B5CF6", "#EF4444"];

function avatarColor(userId) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) sum += userId.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export default function OnlineUsersPage() {
  const [data, setData]       = useState({ count: 0, users: [] });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = () => {
    fetch("/api/presence")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLastRefresh(Date.now());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold" style={{ color: "#0F172B" }}>Présence en direct</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "#94A3B8" }}>
            Membres connectés dans les 5 dernières minutes · rafraîchissement toutes les 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[12px] font-bold text-green-600">Live</span>
          {lastRefresh && (
            <span className="text-[11px] ml-2" style={{ color: "#94A3B8" }}>
              Mis à jour {timeAgo(lastRefresh)}
            </span>
          )}
        </div>
      </div>

      {/* Count card */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 flex items-center gap-5 w-fit">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="#059669" strokeWidth="2"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-[28px] font-bold leading-none" style={{ color: "#1F4E46" }}>
            {loading ? "—" : data.count}
          </p>
          <p className="text-[13px] mt-0.5" style={{ color: "#45556C" }}>connectés maintenant</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>
            Liste des membres en ligne
          </p>
          <p className="text-[12px]" style={{ color: "#94A3B8" }}>
            {data.users.length} membre{data.users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0">
                <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-2.5 w-48 bg-slate-50 rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : data.users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-[14px]" style={{ color: "#94A3B8" }}>Aucun membre connecté actuellement</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.users.map((u) => {
              const ini = initials(u.displayName, u.email);
              const color = avatarColor(u.userId);
              const secsAgo = Math.floor((Date.now() - u.lastSeen) / 1000);
              const isRecent = secsAgo < 45;

              return (
                <div key={u.userId} className="flex items-center gap-4 px-6 py-4">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[12px]"
                    style={{ backgroundColor: color }}
                  >
                    {ini}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: "#0F172B" }}>
                      {u.displayName || <span style={{ color: "#94A3B8" }}>Nom inconnu</span>}
                    </p>
                    <p className="text-[12px] truncate" style={{ color: "#94A3B8" }}>
                      {u.email || `ID: ${u.userId}`}
                    </p>
                  </div>

                  {/* Last seen */}
                  <p className="text-[12px] shrink-0" style={{ color: "#94A3B8" }}>
                    {timeAgo(u.lastSeen)}
                  </p>

                  {/* Online dot */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`w-2 h-2 rounded-full ${isRecent ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
                    />
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: isRecent ? "#059669" : "#94A3B8" }}
                    >
                      {isRecent ? "En ligne" : "Récent"}
                    </span>
                  </div>

                  {/* Link to user profile */}
                  <Link
                    href={`/admin/utilisateurs/${u.userId}`}
                    className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                    style={{ backgroundColor: "#F1F5F9", color: "#45556C" }}
                  >
                    Voir
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-[11px]" style={{ color: "#CBD5E1" }}>
        La présence est stockée en mémoire vive — elle se réinitialise à chaque redémarrage du serveur.
      </p>
    </div>
  );
}
