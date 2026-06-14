"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

const COLORS = ["#3FAE8C", "#8B5CF6", "#3B82F6", "#F59E0B", "#EF4444"];

function getInitials(user) {
  const first = user?.firstName?.[0] ?? user?.first_name?.[0] ?? user?.name?.[0] ?? "?";
  const last = user?.lastName?.[0] ?? user?.last_name?.[0] ?? "";
  return (first + last).toUpperCase();
}

function getColor(user) {
  const name = user?.firstName ?? user?.first_name ?? user?.email ?? "A";
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("fr-FR");
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getUsers({ limit: 5, page: 1 })
      .then((res) => {
        const raw = res.data?.data ?? res.data;
        const list = raw?.users ?? raw?.data ?? (Array.isArray(raw) ? raw : []);
        setUsers(Array.isArray(list) ? list.slice(0, 5) : []);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-bold" style={{ color: "#1F4E46" }}>Utilisateurs récents</h2>
        <Link href="/admin/utilisateurs" className="flex items-center gap-1 text-[13px] text-secondary hover:opacity-70 transition">
          Voir tout
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <div className="bg-white min-w-140">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
            {["UTILISATEUR", "EMAIL", "POINTS SNL", "STATUT", "INSCRIPTION"].map((col) => (
              <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>{col}</span>
            ))}
          </div>

          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-slate-100 gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400 text-sm">Aucun utilisateur trouvé.</div>
          ) : (
            users.map((user, i) => {
              const statusStr = (user?.status ?? "").toLowerCase();
              const isActive = user?.isActive === true || statusStr === "active";
              const points = user?.points ?? user?.totalPoints ?? user?.snlBalance ?? 0;
              const createdAt = user?.createdAt ?? user?.created_at ?? user?.joinedAt;
              const displayName = [user?.firstName ?? user?.first_name, user?.lastName ?? user?.last_name]
                .filter(Boolean).join(" ") || user?.username || user?.email?.split("@")[0] || "—";
              return (
                <div
                  key={user?.id ?? i}
                  className={[
                    "grid grid-cols-[2fr_2fr_1fr_1fr_1fr] px-6 py-4 items-center hover:bg-slate-50 transition-colors",
                    i < users.length - 1 ? "border-b border-slate-100" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: getColor(user) }}>
                      <span className="text-white text-[12px] font-bold">{getInitials(user)}</span>
                    </div>
                    <span className="text-[14px] font-normal truncate" style={{ color: "#45556C" }}>{displayName}</span>
                  </div>
                  <span className="text-[14px] truncate" style={{ color: "#45556C" }}>{user?.email ?? "—"}</span>
                  <span className="text-[14px]" style={{ color: "#45556C" }}>{fmt(points)}</span>
                  <span
                    className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[12px] font-normal border"
                    style={isActive
                      ? { backgroundColor: "#ECFDF5", color: "#059669", borderColor: "#D1FAE5" }
                      : { backgroundColor: "#F8FAFC", color: "#94A3B8", borderColor: "#E2E8F0" }}
                  >
                    {isActive ? "Actif" : "Inactif"}
                  </span>
                  <span className="text-[14px]" style={{ color: "#45556C" }}>
                    {createdAt ? new Date(createdAt).toLocaleDateString("fr-FR") : "—"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
