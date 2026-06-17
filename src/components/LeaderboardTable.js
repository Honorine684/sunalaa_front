"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { leaderboardApi } from "@/lib/api";
import LeaderboardRow from "./LeaderboardRow";

const PAGE_SIZE = 20;
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://api.sunalaa.com";

function buildAvatarUrl(raw) {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${API_BASE}${raw}`;
}

function TableHeader() {
  return (
    <div className="flex items-center px-6 py-3 gap-4 border-b border-gray-100">
      <div className="w-14 shrink-0" />
      <div className="flex-1">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">NAME</p>
      </div>
      <div className="w-32 hidden sm:block">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">COUNTRY</p>
      </div>
      <div className="w-28 text-right shrink-0">
        <p className="text-[12px] font-black text-gray-500 tracking-widest uppercase">TOTAL SNL</p>
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

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

export default function LeaderboardTable({ search = "", levelFilter = "" }) {
  const { user: authUser } = useAuth();
  const myId = authUser?.id ?? authUser?.userId;

  const [players, setPlayers]     = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore]     = useState(false);

  const fetchPage = useCallback((pageNum, replace = false) => {
    const setter = replace ? setLoading : setLoadingMore;
    setter(true);

    const params = { limit: PAGE_SIZE, page: pageNum };
    if (search.trim()) params.search = search.trim();
    if (levelFilter && levelFilter !== "All") params.level = levelFilter;

    leaderboardApi.getTop(params)
      .then((res) => {
        const body = res?.data?.data ?? res?.data;
        const raw  = body?.data ?? body?.items ?? body?.users ?? body;
        const list = Array.isArray(raw) ? raw : [];
        const tot  = body?.meta?.total ?? body?.total ?? list.length;

        setTotal(tot);
        setPlayers((prev) => replace ? list : [...prev, ...list]);
        setHasMore((replace ? list.length : players.length + list.length) < tot);
        setPage(pageNum);
      })
      .catch(() => {})
      .finally(() => setter(false));
  }, [search, levelFilter]); // eslint-disable-line

  // Reset on search/filter change
  useEffect(() => {
    setPlayers([]);
    setPage(1);
    fetchPage(1, true);
  }, [search, levelFilter]); // eslint-disable-line

  function loadMore() {
    fetchPage(page + 1, false);
  }

  return (
    <div>
      {/* Compteur */}
      {!loading && (
        <p className="text-[13px] text-gray-400 mb-3">
          {total > 0
            ? `${fmt(players.length)} / ${fmt(total)} participants`
            : search ? "No results for this search." : "No participants."}
        </p>
      )}

      <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <TableHeader />
        <div className="overflow-x-auto">
          {loading
            ? [...Array(8)].map((_, i) => <RowSkeleton key={i} />)
            : players.length === 0
              ? <p className="text-center text-gray-400 text-sm py-10">No results.</p>
              : players.map((u, i) => {
                  const rank  = u.rank ?? u.position ?? i + 1;
                  const isMe  = Boolean(myId && (u.id ?? u.userId) === myId);
                  return (
                    <LeaderboardRow
                      key={u.id ?? i}
                      rank={rank}
                      username={isMe
                        ? (clean(authUser?.username ?? authUser?.pseudo ?? authUser?.displayName ?? authUser?.display_name) || getDisplayName(u))
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

          {/* Charger plus */}
          {!loading && hasMore && (
            <div className="flex justify-center py-4 border-t border-gray-100">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 bg-[#111] text-white text-[13px] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#222] transition disabled:opacity-50 cursor-pointer"
              >
                {loadingMore ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : null}
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
