"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { leaderboardApi, usersApi } from "@/lib/api";

/* ── Helpers ──────────────────────────────────────────────────────── */
function getInitials(u) {
  const first = u?.firstName?.[0] ?? u?.first_name?.[0] ?? u?.username?.[0] ?? u?.name?.[0] ?? "?";
  const last  = u?.lastName?.[0]  ?? u?.last_name?.[0]  ?? "";
  return (first + last).toUpperCase();
}

function getDisplayName(u) {
  const full = [u?.firstName ?? u?.first_name, u?.lastName ?? u?.last_name].filter(Boolean).join(" ");
  return full || u?.username || u?.name || u?.email || "—";
}

function getPoints(u) {
  return Number(u?.snlBalance ?? u?.points ?? u?.totalPoints ?? 0);
}

function getReferrals(u) {
  return u?.totalReferrals ?? u?.referralCount ?? u?.referrals ?? u?.directReferrals ?? 0;
}

function getLevelName(u) {
  return u?.level?.name ?? u?.levelName ?? u?.badge ?? null;
}

function getLevelColor(u) {
  return u?.level?.color ?? u?.levelColor ?? u?.badgeColor ?? "#94A3B8";
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("fr-FR");
}

function parseList(res) {
  const body = res?.data?.data ?? res?.data;
  const raw  = body?.data ?? body?.items ?? body?.users ?? body;
  return Array.isArray(raw) ? raw : [];
}

/* ── UI atoms ─────────────────────────────────────────────────────── */
function CrownIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#E5B858">
      <path d="M2 19h20v2H2v-2zM2 7l5 5 5-7 5 7 5-5v10H2V7z" />
    </svg>
  );
}

function Avatar({ user, size = 36, rank }) {
  const color = rank === 1 ? "#E5B858" : rank === 2 ? "#94A3B8" : rank === 3 ? "#CD7F32" : "#3FAE8C";
  const photo = user?.avatar ?? user?.profileImage ?? user?.profilePicture ?? user?.picture ?? null;
  if (photo) {
    return (
      <img
        src={photo}
        alt={getDisplayName(user)}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.35 }}
    >
      {getInitials(user)}
    </div>
  );
}

function RankCell({ rank, isMe }) {
  if (rank === 1) return <CrownIcon size={22} />;
  if (rank === 2) return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: "#94A3B8" }}>2</div>
  );
  if (rank === 3) return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: "#CD7F32" }}>3</div>
  );
  return <span className="text-[14px] font-semibold" style={{ color: isMe ? "white" : "#45556C" }}>{rank}</span>;
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

/* ── Podium ───────────────────────────────────────────────────────── */
function PodiumSlot({ user, rank, height, avatarSize = 56 }) {
  const podiumColor = rank === 1 ? "#E5B858" : "#1A3A34";
  return (
    <div className="flex flex-col items-center gap-2">
      {rank === 1 && <CrownIcon size={28} />}
      <Avatar user={user} size={avatarSize} rank={rank} />
      <div className="font-bold text-sm text-center max-w-22.5 truncate" style={{ color: "#1A3A34" }}>
        {getDisplayName(user)}
      </div>
      <div className="text-slate-500 text-xs">{fmt(getPoints(user))} SNL</div>
      <div
        className="flex items-center justify-center rounded-t-2xl font-black text-2xl text-white"
        style={{ backgroundColor: podiumColor, width: rank === 1 ? 112 : 96, height }}
      >
        {rank}
      </div>
    </div>
  );
}

function PodiumSkeleton() {
  return (
    <div className="flex items-end justify-center gap-3 mb-12 pt-10">
      {[{ h: 80, w: 96 }, { h: 112, w: 112 }, { h: 64, w: 96 }].map((s, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
          <div className="rounded-t-2xl bg-slate-200 animate-pulse" style={{ width: s.w, height: s.h }} />
        </div>
      ))}
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */
export default function ClassementPage() {
  const { user: authUser } = useAuth();

  const [topList, setTopList]   = useState([]);
  const [myRank, setMyRank]     = useState(null);
  const [myEntry, setMyEntry]   = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      leaderboardApi.getTop({ limit: 100 }),
      leaderboardApi.getMyRank().catch(() => null),
      usersApi.getProfile().catch(() => null),
    ]).then(([topRes, myRankRes, profileRes]) => {
      if (topRes.status === "fulfilled") {
        const list = parseList(topRes.value);
        setTopList(list);
        const body = topRes.value?.data?.data ?? topRes.value?.data;
        setTotalCount(body?.meta?.total ?? body?.total ?? body?.count ?? list.length);
      }

      // Position de l'utilisateur connecté
      const myRankData = myRankRes?.status === "fulfilled" ? myRankRes.value : null;
      if (myRankData) {
        const d = myRankData?.data?.data ?? myRankData?.data;
        setMyRank(d?.rank ?? d?.position ?? d?.myRank ?? null);
        setMyEntry(d?.user ?? d?.entry ?? d ?? null);
      }

      // Fallback : extraire le rang depuis le profil
      if (!myRankData) {
        const profile = profileRes?.status === "fulfilled"
          ? (profileRes.value?.data?.data ?? profileRes.value?.data)
          : null;
        if (profile?.rank ?? profile?.leaderboardRank) {
          setMyRank(profile?.rank ?? profile?.leaderboardRank);
          setMyEntry(profile);
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  // Est-ce que l'utilisateur connecté est déjà dans le top 100 ?
  const myId = authUser?.id ?? authUser?.userId;
  const myIndexInTop = myId
    ? topList.findIndex((u) => (u.id ?? u.userId) === myId)
    : -1;
  const meInTop = myIndexInTop !== -1;

  const rank1 = topList[0] ?? null;
  const rank2 = topList[1] ?? null;
  const rank3 = topList[2] ?? null;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1A3A34" }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          {[700, 500, 300].map((s) => (
            <div key={s} className="absolute rounded-full border" style={{ width: s, height: s, borderColor: "rgba(255,255,255,0.04)" }} />
          ))}
        </div>

        <div className="relative z-10 py-24 pb-40 text-center px-4">
          <h1 className="font-black text-4xl text-white mb-4">Classement Global</h1>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.60)" }}>
            Découvrez les meilleurs collecteurs de la communauté SUNALA
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-semibold" style={{ color: "#1A3A34" }}>
              {loading ? "…" : `${fmt(totalCount ?? topList.length)} participants`}
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-semibold" style={{ color: "#1A3A34" }}>
              Mis à jour en temps réel
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-semibold" style={{ color: "#1A3A34" }}>
              Top 100 récompensés
            </div>
          </div>
        </div>

        <div className="absolute -bottom-8 left-0 w-full h-32 bg-white"
          style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%, 32% 100%)" }} />
      </section>

      {/* ── Podium ── */}
      <section className="bg-white relative z-10 -mt-10 pb-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          {loading ? (
            <PodiumSkeleton />
          ) : rank1 && rank2 && rank3 ? (
            <div className="flex items-end justify-center gap-3 mb-12 pt-10">
              <PodiumSlot user={rank2} rank={2} height={80} />
              <PodiumSlot user={rank1} rank={1} height={112} avatarSize={64} />
              <PodiumSlot user={rank3} rank={3} height={64} />
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Table ── */}
      <section className="bg-white pb-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="font-bold text-xl mb-4" style={{ color: "#1A3A34" }}>Tableau complet</h2>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <div className="bg-white min-w-[600px]">
              {/* Header */}
              <div
                className="grid px-6 py-3 rounded-t-xl text-xs font-bold uppercase tracking-wider text-slate-500"
                style={{ gridTemplateColumns: "0.5fr 2fr 1.5fr 1fr 1fr", backgroundColor: "#E2E8F0" }}
              >
                <div>Rang</div>
                <div>Utilisateur</div>
                <div>Points SNL</div>
                <div>Parrainages</div>
                <div>Niveau</div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col gap-0">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="grid px-6 py-4 border-b border-slate-50" style={{ gridTemplateColumns: "0.5fr 2fr 1.5fr 1fr 1fr" }}>
                      <Skeleton className="h-5 w-6" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty */}
              {!loading && topList.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-12">Aucun classement disponible.</p>
              )}

              {/* Rows */}
              {!loading && topList.map((u, idx) => {
                const rank   = u.rank ?? u.position ?? idx + 1;
                const isMe   = myId && (u.id ?? u.userId) === myId;
                const level  = getLevelName(u);
                const lColor = getLevelColor(u);

                return (
                  <div
                    key={u.id ?? idx}
                    className="grid px-6 py-4 items-center border-b border-slate-50 last:border-0 transition-colors"
                    style={{
                      gridTemplateColumns: "0.5fr 2fr 1.5fr 1fr 1fr",
                      backgroundColor: isMe ? "#1A3A34" : undefined,
                    }}
                    onMouseEnter={(e) => { if (!isMe) e.currentTarget.style.backgroundColor = "#F8FAFC"; }}
                    onMouseLeave={(e) => { if (!isMe) e.currentTarget.style.backgroundColor = ""; }}
                  >
                    <div><RankCell rank={rank} isMe={isMe} /></div>

                    <div className="flex items-center gap-3">
                      <Avatar user={u} size={36} rank={rank} />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm" style={{ color: isMe ? "white" : "#0F172B" }}>
                          {getDisplayName(u)}
                        </span>
                        {isMe && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#2DD4BF", color: "#1A3A34" }}>
                            Vous
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-semibold text-sm" style={{ color: isMe ? "white" : "#0F172B" }}>
                      {fmt(getPoints(u))} SNL
                    </div>

                    <div className="text-sm" style={{ color: isMe ? "rgba(255,255,255,0.80)" : "#45556C" }}>
                      {fmt(getReferrals(u))}
                    </div>

                    <div>
                      {level ? (
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: lColor + "22", color: lColor }}>
                          {level}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Utilisateur connecté hors top 100 */}
              {!loading && !meInTop && (myRank || myEntry) && (
                <>
                  <div className="px-6 py-2 text-center text-slate-400 text-xs border-b border-slate-50">···</div>
                  <div
                    className="grid px-6 py-4 items-center"
                    style={{ gridTemplateColumns: "0.5fr 2fr 1.5fr 1fr 1fr", backgroundColor: "#1A3A34" }}
                  >
                    <div>
                      <span className="text-[14px] font-semibold text-white">{myRank ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar user={myEntry ?? authUser} size={36} rank={null} />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {getDisplayName(myEntry ?? authUser)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: "#2DD4BF", color: "#1A3A34" }}>
                          Vous
                        </span>
                      </div>
                    </div>
                    <div className="font-semibold text-sm text-white">
                      {fmt(getPoints(myEntry ?? authUser))} SNL
                    </div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.80)" }}>
                      {fmt(getReferrals(myEntry ?? authUser))}
                    </div>
                    <div>
                      {getLevelName(myEntry ?? authUser) ? (
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ backgroundColor: getLevelColor(myEntry ?? authUser) + "22", color: getLevelColor(myEntry ?? authUser) }}>
                          {getLevelName(myEntry ?? authUser)}
                        </span>
                      ) : <span className="text-xs text-slate-400/60">—</span>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
