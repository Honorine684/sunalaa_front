"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { leaderboardApi } from "@/lib/api";
import LeaderboardRow from "./LeaderboardRow";
import { useTranslations } from "next-intl";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://api.sunalaa.com";

function buildAvatarUrl(raw) {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${API_BASE}${raw}`;
}

function TableHeader({ t }) {
  return (
    <div className="flex items-center px-6 py-3 gap-4 border-b border-gray-100">
      <div className="w-14 shrink-0" />
      <div className="flex-1">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">{t("col_name")}</p>
      </div>
      <div className="w-32 hidden sm:block">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">{t("col_country")}</p>
      </div>
      <div className="w-28 text-right shrink-0">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">{t("col_total")}</p>
      </div>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center px-6 py-4 gap-4 border-b border-gray-100 last:border-0">
      <div className="w-14 shrink-0 flex justify-center">
        <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
      </div>
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-32 bg-slate-200 animate-pulse rounded" />
          <div className="h-2.5 w-20 bg-slate-200 animate-pulse rounded" />
        </div>
      </div>
      <div className="w-32 hidden sm:block">
        <div className="h-3 w-16 bg-slate-200 animate-pulse rounded" />
      </div>
      <div className="w-28 flex justify-end">
        <div className="h-3 w-20 bg-slate-200 animate-pulse rounded" />
      </div>
    </div>
  );
}

function clean(v) {
  if (!v) return "";
  const s = String(v).trim();
  // Reject "null", "nullnull", "null null", "undefined", combinations, etc.
  if (/^(null\s*|undefined\s*)+$/i.test(s)) return "";
  return s;
}

function isValidDisplay(s) {
  // Reject strings with no alphanumeric chars at all (_, —, --, __, ..., etc.)
  return /[a-zA-Z0-9]/.test(s);
}

function getDisplayName(u) {
  // Flatten nested user object (leaderboard API returns { rank, totalSnl, user: {...} })
  const p = u?.user ?? u;
  const username = clean(p?.username ?? p?.pseudo ?? p?.displayName ?? p?.display_name ?? p?.handle ?? p?.login ?? p?.nickname);
  if (username && isValidDisplay(username)) return username;
  const first = clean(p?.firstName ?? p?.first_name);
  const last  = clean(p?.lastName  ?? p?.last_name);
  const full  = [first, last].filter(Boolean).join(" ");
  if (full) return full;
  const name = clean(p?.name);
  if (name && isValidDisplay(name)) return name;
  const refCode = clean(p?.referralCode ?? p?.referral_code);
  if (refCode && isValidDisplay(refCode)) return refCode;
  return "Anonyme";
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

export default function LeaderboardTable({ search = "", levelFilter = "" }) {
  const t = useTranslations("LeaderboardTable");
  const { user: authUser, isAuthenticated } = useAuth();
  const myId = authUser?.id ?? authUser?.userId;

  const [players, setPlayers] = useState([]);
  const [myRank, setMyRank]   = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);

    const rankPromise = isAuthenticated
      ? leaderboardApi.getMyRank().then((r) => {
          const d = r?.data?.data ?? r?.data;
          return d?.rank ?? d?.position ?? d?.leaderboardRank ?? null;
        }).catch(() => null)
      : Promise.resolve(null);

    rankPromise.then((rank) => {
      setMyRank(rank);
      const isDefault = !search.trim() && (!levelFilter || levelFilter === "All");
      const limit = (isAuthenticated && rank && isDefault) ? rank : 100;

      const params = { limit };
      if (search.trim()) params.search = search.trim();
      if (levelFilter && levelFilter !== "All") params.level = levelFilter;

      return leaderboardApi.getTop(params).then((res) => ({ res, rank, isDefault }));
    }).then(({ res, rank, isDefault }) => {
      const body = res?.data?.data ?? res?.data;
      const raw  = body?.data ?? body?.items ?? body?.users ?? body;
      let list = Array.isArray(raw) ? raw : [];

      // Slice to current user's position — nothing below the user should appear
      if (isAuthenticated && rank && isDefault) {
        const myIdx = list.findIndex((u) => {
          const uid = u.id ?? u.userId ?? u.user?.id ?? u.user?.userId;
          return uid === myId;
        });
        if (myIdx !== -1) list = list.slice(0, myIdx + 1);
      }

      setPlayers(list);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, [isAuthenticated, search, levelFilter]); // eslint-disable-line

  useEffect(() => {
    setPlayers([]);
    load();
  }, [search, levelFilter, isAuthenticated]); // eslint-disable-line

  return (
    <div>
      {/* Compteur */}
      {!loading && (
        <p className="text-[13px] text-gray-400 mb-3">
          {players.length > 0
            ? myRank
              ? `Votre rang : #${myRank}, ${fmt(players.length)} participants affichés`
              : `${fmt(players.length)} participants`
            : search ? t("no_results_search") : t("no_participants")}
        </p>
      )}

      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <TableHeader t={t} />
        <div className="overflow-x-auto">
          {loading
            ? [...Array(8)].map((_, i) => <RowSkeleton key={i} />)
            : players.length === 0
              ? <p className="text-center text-gray-400 text-sm py-10">{t("no_results")}</p>
              : players.map((u, i) => {
                  const rank = u.rank ?? u.position ?? i + 1;
                  const uid  = u.id ?? u.userId ?? u.user?.id ?? u.user?.userId;
                  const isMe = Boolean(myId && uid === myId);
                  return (
                    <LeaderboardRow
                      key={u.id ?? i}
                      rank={rank}
                      username={isMe
                        ? (() => { const n = clean(authUser?.username ?? authUser?.pseudo ?? authUser?.displayName ?? authUser?.display_name); return (n && isValidDisplay(n)) ? n : getDisplayName(u); })()
                        : getDisplayName(u)
                      }
                      subtitle={u?.level?.name ?? u?.levelName ?? ""}
                      country={u?.country ?? u?.countryCode ?? ""}
                      score={fmt(Number(u?.snlBalance ?? u?.points ?? u?.totalPoints ?? 0))}
                      avatar={buildAvatarUrl(u?.avatar ?? u?.profileImage ?? null)}
                      isMe={isMe}
                    />
                  );
                })
          }
        </div>
      </div>
    </div>
  );
}
