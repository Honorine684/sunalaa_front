"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import PodiumItem from "./PodiumItem";
import { leaderboardApi } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://api.sunalaa.com";

function buildAvatarUrl(raw) {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${API_BASE}${raw}`;
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

function clean(v) {
  if (!v) return "";
  const s = String(v).trim();
  if (/^(null|undefined)(\s*(null|undefined))*$/i.test(s)) return "";
  return s;
}

function getDisplayName(u) {
  const username = clean(u?.username ?? u?.pseudo ?? u?.displayName ?? u?.display_name ?? u?.handle);
  if (username) return username;
  const first = clean(u?.firstName ?? u?.first_name);
  const last  = clean(u?.lastName  ?? u?.last_name);
  const full  = [first, last].filter(Boolean).join(" ");
  if (full) return full;
  return clean(u?.name) || "—";
}

function getPoints(u) {
  return Number(u?.snlBalance ?? u?.points ?? u?.totalPoints ?? 0);
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

export default function PodiumSection() {
  const [top3, setTop3] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardApi.getTop({ limit: 3 })
      .then((res) => {
        const body = res?.data?.data ?? res?.data;
        const raw  = body?.data ?? body?.items ?? body?.users ?? body;
        setTop3(Array.isArray(raw) ? raw.slice(0, 3) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const rank1 = top3.find((u, i) => (u.rank ?? u.position ?? i + 1) === 1) ?? top3[0];
  const rank2 = top3.find((u, i) => (u.rank ?? u.position ?? i + 1) === 2) ?? top3[1];
  const rank3 = top3.find((u, i) => (u.rank ?? u.position ?? i + 1) === 3) ?? top3[2];

  return (
    <section className="relative bg-white pt-6 lg:pt-24 pb-8 overflow-hidden">
      {/* Cercles déco gauche */}
      <div className="absolute top-[45%] -translate-y-1/2 pointer-events-none hidden lg:block" style={{ left: 188 }}>
        {[338, 260, 180, 100].map((size) => (
          <div key={size} className="absolute rounded-full"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2, border: "1px solid rgba(32,180,134,0.25)" }} />
        ))}
      </div>

      {/* Cercles déco droite */}
      <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block" style={{ right: 169 }}>
        {[338, 260, 180, 100].map((size) => (
          <div key={size} className="absolute rounded-full"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2, border: "1px solid rgba(32,180,134,0.25)" }} />
        ))}
      </div>

      <Container className="relative z-10">
        <div
          className="max-w-216 mx-auto bg-white rounded-2xl border flex flex-col"
          style={{ borderColor: "#E2E8F0", paddingTop: 25, paddingRight: 25, paddingBottom: 1, paddingLeft: 25, gap: 24, minHeight: 266 }}
        >
          <h2 className="text-[15px] lg:text-[17px] font-normal text-gray-800 text-center">Podium</h2>

          {loading ? (
            <div className="flex items-end justify-between pb-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-end justify-between">
              {[rank2, rank1, rank3].map((u, i) => {
                if (!u) return <div key={i} className="flex-1" />;
                const rankNum = [2, 1, 3][i];
                return (
                  <PodiumItem
                    key={rankNum}
                    rank={rankNum}
                    username={getDisplayName(u)}
                    score={fmt(getPoints(u))}
                    avatar={buildAvatarUrl(u?.avatar ?? u?.profileImage ?? u?.profilePicture ?? null)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
