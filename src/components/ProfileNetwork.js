"use client";

import { useEffect, useState } from "react";
import { networkApi, getApiError } from "@/lib/api";

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];

function resolve(node) {
  // le backend peut imbriquer les données dans node.user ou node.profile
  return node?.user ?? node?.profile ?? node ?? {};
}

function getInitials(node) {
  const u = resolve(node);
  if (u?.username) return u.username[0].toUpperCase();
  const first = u?.firstName?.[0] ?? u?.first_name?.[0] ?? u?.name?.[0] ?? "?";
  const last = u?.lastName?.[0] ?? u?.last_name?.[0] ?? "";
  return (first + last).toUpperCase();
}

function getColor(node) {
  const u = resolve(node);
  const name = u?.username ?? u?.firstName ?? u?.first_name ?? u?.name ?? "A";
  return COLORS[name.charCodeAt(0) % COLORS.length];
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

function getUserName(node) {
  const u = resolve(node);
  return u?.username
    || [u?.firstName ?? u?.first_name, u?.lastName ?? u?.last_name].filter(Boolean).join(" ")
    || u?.name || u?.email || "—";
}

function isUserActive(user) {
  if (user?.isActive != null) return Boolean(user.isActive);
  if (user?.active != null) return Boolean(user.active);
  if (user?.status) return ["active", "verified", "enabled", "actif"].includes(String(user.status).toLowerCase());
  return true;
}

function StatCard({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
      <span className="text-[20px] font-bold" style={{ color: color ?? "#0F172B" }}>{fmt(value)}</span>
      <span className="text-[12px]" style={{ color: "#64748B" }}>{label}</span>
    </div>
  );
}

function UserRow({ user, index, total }) {
  const active = isUserActive(user);
  const snl = user?.points ?? user?.totalPoints ?? user?.snlBalance ?? 0;
  return (
    <div className={`flex items-center gap-3 py-2.5 ${index < total - 1 ? "border-b border-slate-100" : ""}`}>
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
          style={{ backgroundColor: getColor(user) }}>
          {getInitials(user)}
        </div>
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${active ? "bg-emerald-400" : "bg-slate-300"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-[13px] font-medium" style={{ color: "#0F172B" }}>{getUserName(user)}</p>
        <p className="text-[11px]" style={{ color: "#94A3B8" }}>{active ? "Active" : "Inactive"}</p>
      </div>
      <span className="text-[11px] font-medium shrink-0" style={{ color: "#94A3B8" }}>{fmt(snl)} SNL</span>
    </div>
  );
}

function normalizeList(raw) {
  const arr = raw?.data ?? raw?.items ?? raw?.members ?? raw?.users ?? raw?.referrals ?? raw?.directs ?? raw;
  return Array.isArray(arr) ? arr : [];
}

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);
  const children = node?.children ?? node?.downlines ?? node?.referrals ?? [];
  const isRoot = depth === 0;
  const name = isRoot && getUserName(node) === "—" ? "You" : getUserName(node);
  const initials = isRoot && getInitials(node) === "?" ? "Me" : getInitials(node);

  return (
    <div className={depth > 0 ? "ml-4 border-l border-slate-100 pl-3" : ""}>
      <div className="flex items-center gap-2 py-1.5">
        {children.length > 0 ? (
          <button onClick={() => setOpen(o => !o)}
            className="shrink-0 w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              {open
                ? <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M3.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
            </svg>
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
          style={{ backgroundColor: isRoot ? "#1F4E46" : getColor(node) }}>
          {initials}
        </div>
        <span className="text-[12px] truncate flex-1" style={{ color: isRoot ? "#1F4E46" : "#0F172B", fontWeight: isRoot ? 600 : 400 }}>
          {name}
        </span>
        {children.length > 0 && (
          <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#94A3B8" }}>
            {children.length}
          </span>
        )}
      </div>
      {open && children.map((child, i) => (
        <TreeNode key={child?.id ?? i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function ProfileNetwork() {
  const [stats, setStats]           = useState(null);
  const [upline, setUpline]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  const [activeLevel, setActiveLevel]   = useState(1);
  const [levelCache, setLevelCache]     = useState({});
  const [levelLoading, setLevelLoading] = useState(false);

  const [tree, setTree]             = useState(null);
  const [showTree, setShowTree]     = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError]   = useState("");

  useEffect(() => {
    Promise.allSettled([
      networkApi.getStats(),
      networkApi.getUpline(),
      networkApi.getLevel(1, { limit: 10 }),
    ]).then(([statsRes, uplineRes, level1Res]) => {
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data?.data ?? statsRes.value.data);
      } else if (statsRes.reason?.response?.status !== 404) {
        setError(getApiError(statsRes.reason));
      }
      if (uplineRes.status === "fulfilled") {
        const raw = uplineRes.value.data?.data ?? uplineRes.value.data ?? [];
        setUpline(Array.isArray(raw) ? raw : (raw?.items ?? raw?.upline ?? []));
      }
      if (level1Res.status === "fulfilled") {
        const raw = level1Res.value.data?.data ?? level1Res.value.data;
        setLevelCache({ 1: normalizeList(raw) });
      }
    }).finally(() => setLoading(false));
  }, []);

  async function loadLevel(level) {
    setActiveLevel(level);
    if (levelCache[level]) return;
    setLevelLoading(true);
    try {
      const res = await networkApi.getLevel(level, { limit: 10 });
      const raw = res.data?.data ?? res.data;
      setLevelCache(prev => ({ ...prev, [level]: normalizeList(raw) }));
    } catch {
      setLevelCache(prev => ({ ...prev, [level]: [] }));
    } finally {
      setLevelLoading(false);
    }
  }

  async function toggleTree() {
    if (tree) { setShowTree(v => !v); return; }
    setShowTree(true);
    setTreeLoading(true);
    setTreeError("");
    try {
      const res = await networkApi.getTree();
      setTree(res.data?.data ?? res.data);
    } catch (err) {
      setTreeError(getApiError(err));
    } finally {
      setTreeLoading(false);
    }
  }

  const totalMembers  = stats?.totalMembers  ?? stats?.total        ?? stats?.membersCount ?? null;
  const activeMembers = stats?.activeMembers ?? stats?.active       ?? stats?.activeCount  ?? null;
  const totalLevels   = stats?.totalLevels   ?? stats?.levels       ?? stats?.depth        ?? null;
  const directCount   = stats?.directReferrals ?? stats?.directs    ?? levelCache[1]?.length ?? null;

  const currentMembers = levelCache[activeLevel] ?? [];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold" style={{ color: "#0F172B" }}>Your network</h3>
        {!loading && totalMembers !== null && (
          <span className="text-[13px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F0FDF4", color: "#059669" }}>
            {fmt(totalMembers)} members
          </span>
        )}
      </div>

      {error && <p className="text-red-400 text-[13px]">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />)}
          </div>
          {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 gap-2">
              {totalMembers  !== null && <StatCard label="Total members" value={totalMembers}  color="#1F4E46" />}
              {activeMembers !== null && <StatCard label="Active"        value={activeMembers} color="#059669" />}
              {directCount   !== null && <StatCard label="Direct"        value={directCount}   color="#3B82F6" />}
              {totalLevels   !== null && <StatCard label="Levels"        value={totalLevels}   color="#8B5CF6" />}
            </div>
          )}

          {/* Upline */}
          {upline.length > 0 && (
            <div>
              <p className="text-[13px] font-semibold mb-2" style={{ color: "#64748B" }}>Your referrer</p>
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: getColor(upline[0]) }}>
                  {getInitials(upline[0])}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "#0F172B" }}>{getUserName(upline[0])}</p>
                  <p className="text-[11px]" style={{ color: "#94A3B8" }}>Level 1</p>
                </div>
              </div>
            </div>
          )}

          {/* Membres par niveau */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold" style={{ color: "#64748B" }}>
                Members
                {currentMembers.length > 0 && <span className="ml-1 font-normal text-[12px]">({currentMembers.length})</span>}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3].map(lvl => (
                  <button key={lvl} onClick={() => loadLevel(lvl)}
                    className="px-2.5 py-1 rounded-lg text-[12px] font-medium transition cursor-pointer"
                    style={activeLevel === lvl
                      ? { backgroundColor: "#1F4E46", color: "#fff" }
                      : { backgroundColor: "#F1F5F9", color: "#64748B" }}>
                    Lv.{lvl}
                  </button>
                ))}
              </div>
            </div>

            {levelLoading ? (
              <div className="flex flex-col gap-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : currentMembers.length === 0 ? (
              <p className="text-slate-400 text-[13px] text-center py-4">No members at this level.</p>
            ) : (
              <div className="flex flex-col">
                {currentMembers.map((user, i) => (
                  <UserRow key={user?.id ?? i} user={user} index={i} total={currentMembers.length} />
                ))}
              </div>
            )}
          </div>

          {/* Arborescence */}
          <div className="border-t border-slate-100 pt-4">
            <button onClick={toggleTree}
              className="flex items-center justify-between w-full cursor-pointer"
              style={{ color: "#64748B" }}>
              <span className="text-[13px] font-semibold">Network tree</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                className={`transition-transform duration-200 ${showTree ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showTree && (
              <div className="mt-3 max-h-64 overflow-y-auto">
                {treeLoading ? (
                  <div className="flex flex-col gap-2">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-7 rounded-lg bg-slate-100 animate-pulse" />)}
                  </div>
                ) : treeError ? (
                  <p className="text-red-400 text-[13px]">{treeError}</p>
                ) : tree ? (
                  <TreeNode node={tree} depth={0} />
                ) : (
                  <p className="text-slate-400 text-[13px] text-center py-2">No data.</p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
