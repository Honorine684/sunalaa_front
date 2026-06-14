"use client";

import { useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function fmt(n) {
  if (n == null) return "—";
  return Number(n).toLocaleString("fr-FR");
}

/* ── Stat card ── */
function StatCard({ iconBg, iconColor, icon, trend, label, value, loading }) {
  if (loading) return <Skeleton className="h-36" />;
  const positive = typeof trend === "string" ? !trend.startsWith("-") : trend >= 0;
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          {icon(iconColor)}
        </div>
        {trend != null && (
          <div className="flex items-center gap-1 text-[13px]" style={{ color: positive ? "#3FAE8C" : "#E11D48" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              {positive
                ? <><path d="M22 7l-9.5 9.5-5-5L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>
                : <><path d="M22 17l-9.5-9.5-5 5L1 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17h6v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>
              }
            </svg>
            {trend}
          </div>
        )}
      </div>
      <p className="text-[13px] mb-1" style={{ color: "#45556C" }}>{label}</p>
      <p className="text-[28px] font-bold" style={{ color: "#1F4E46" }}>{value}</p>
    </div>
  );
}

/* ── Line Chart SVG ── */
function LineChart({ data, loading }) {
  if (loading) return <Skeleton className="h-[230px] w-full" />;
  if (!data?.length) return <div className="h-[230px] flex items-center justify-center text-slate-400 text-sm">Pas de données</div>;

  const W = 480, H = 220;
  const padL = 52, padR = 20, padT = 16, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const values = data.map((d) => d.value);
  const maxV = Math.max(...values) || 1;
  const minV = 0;

  const px = (i) => padL + (i / Math.max(data.length - 1, 1)) * plotW;
  const py = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;
  const points = data.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");

  const yCount = 5;
  const yLabels = Array.from({ length: yCount }, (_, i) => Math.round((maxV / (yCount - 1)) * i));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {yLabels.map((y, i) => (
        <g key={i}>
          <line x1={padL} y1={py(y)} x2={W - padR} y2={py(y)} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
          <text x={padL - 6} y={py(y) + 4} textAnchor="end" fontSize="10" fill="#94A3B8">
            {y >= 1000 ? `${(y / 1000).toFixed(0)}k` : y}
          </text>
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={px(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94A3B8">{d.label}</text>
      ))}
      <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((d, i) => (
        <circle key={i} cx={px(i)} cy={py(d.value)} r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
      ))}
    </svg>
  );
}

/* ── Bar Chart ── */
function BarChart({ data, loading }) {
  if (loading) return <Skeleton className="h-[230px] w-full" />;
  if (!data?.length) return <div className="h-[230px] flex items-center justify-center text-slate-400 text-sm">Pas de données</div>;

  const maxV = Math.max(...data.map((d) => d.value)) || 1;
  const yLabels = [0, 25, 50, 75, 100].map((p) => Math.round((maxV * p) / 100));

  return (
    <div className="flex gap-2 h-[230px]">
      <div className="flex flex-col-reverse justify-between pb-6 shrink-0">
        {yLabels.map((y, i) => (
          <span key={i} className="text-[10px] text-right w-10" style={{ color: "#94A3B8" }}>
            {y >= 1000 ? `${(y / 1000).toFixed(0)}k` : y}
          </span>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-between gap-1.5 border-l border-b border-slate-100 pl-2 pb-1">
          {data.map((d) => (
            <div key={d.label} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
              <div className="w-full rounded-t-md hover:brightness-110 transition-all duration-300"
                style={{ height: `${(d.value / maxV) * 100}%`, backgroundColor: "#3FAE8C" }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between pl-2 pt-1">
          {data.map((d) => (
            <span key={d.label} className="flex-1 text-center text-[10px]" style={{ color: "#94A3B8" }}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Pie Chart ── */
function PieChart({ data, loading }) {
  if (loading) return <Skeleton className="h-[260px] w-full" />;
  if (!data?.length) return <div className="h-[260px] flex items-center justify-center text-slate-400 text-sm">Pas de données</div>;

  const COLORS = ["#3B82F6", "#8B5CF6", "#3FAE8C", "#F59E0B", "#EF4444"];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  const cx = 130, cy = 120, r = 100;
  let cur = -Math.PI / 2;

  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const start = cur;
    const sweep = pct * 2 * Math.PI;
    cur += sweep;
    return { ...d, start, end: cur, mid: start + sweep / 2, pct, color: COLORS[i % COLORS.length] };
  });

  const pt = (a, rad) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  const arcPath = (s) => {
    const [x1, y1] = pt(s.start, r);
    const [x2, y2] = pt(s.end, r);
    const large = s.end - s.start > Math.PI ? 1 : 0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}Z`;
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-center">
        <svg viewBox="0 0 260 240" className="w-full max-w-[260px]">
          {slices.map((s) => <path key={s.label} d={arcPath(s)} fill={s.color} />)}
          {slices.map((s) => {
            const [x, y] = pt(s.start, r);
            return <line key={s.label + "sep"} x1={cx} y1={cy} x2={x} y2={y} stroke="white" strokeWidth="2.5" />;
          })}
          {slices.filter((s) => s.pct > 0.05).map((s) => {
            const [lx, ly] = pt(s.mid, r * 0.62);
            return (
              <text key={s.label + "pct"} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fontSize="13" fontWeight="700" fill="white" fontFamily="Inter, sans-serif">
                {Math.round(s.pct * 100)}%
              </text>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-[13px]" style={{ color: "#45556C" }}>{s.label}</span>
            </div>
            <span className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{fmt(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Progress bars (rank distribution) ── */
function RankProgress({ data, loading }) {
  if (loading) return <div className="flex flex-col gap-4">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>;
  if (!data?.length) return <div className="text-slate-400 text-sm py-4">Pas de données</div>;

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="flex flex-col gap-4">
      {data.map((r) => {
        const pct = Math.round((r.value / total) * 100);
        return (
          <div key={r.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[14px]" style={{ color: "#0F172B" }}>{r.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-[13px]" style={{ color: "#45556C" }}>{fmt(r.value)} utilisateurs</span>
                <span className="text-[13px] font-normal w-8 text-right" style={{ color: "#45556C" }}>{pct}%</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#EDE9FE" }}>
              <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#8B5CF6" }} />
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
        <span className="text-[14px]" style={{ color: "#45556C" }}>Total membres</span>
        <span className="text-[20px] font-bold" style={{ color: "#0F172B" }}>{fmt(total)}</span>
      </div>
    </div>
  );
}

/* ── Chart card shell ── */
function ChartCard({ icon, iconBg, iconColor, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          {icon(iconColor)}
        </div>
        <div>
          <p className="text-[15px] font-bold" style={{ color: "#0F172B" }}>{title}</p>
          <p className="text-[12px]" style={{ color: "#45556C" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Helpers to normalise API data ── */
function resolveFirst(obj, keys) {
  if (!obj) return null;
  for (const k of keys) if (obj[k] != null) return obj[k];
  return null;
}

function parseGrowthData(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : (raw.data ?? raw.items ?? raw.growth ?? []);
  if (!arr.length) return [];
  return arr.slice(-10).map((d) => ({
    label: d.date ? new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) : d.period ?? d.label ?? "—",
    value: resolveFirst(d, ["newUsers", "users", "count", "total", "value"]) ?? 0,
  }));
}

function parseCollectData(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : (raw.data ?? raw.items ?? []);
  if (!arr.length) return [];
  return arr.slice(-7).map((d) => ({
    label: d.label ?? (d.date ? new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" }) : "—"),
    value: d.snlDistributed ?? d.collectsCount ?? resolveFirst(d, ["amount", "total", "count", "value"]) ?? 0,
  }));
}

function parseRankData(raw) {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : (raw.data ?? raw.items ?? raw.distribution ?? raw.ranks ?? []);
  if (!arr.length) return [];
  return arr.map((d) => ({
    label: d.rank ?? d.name ?? d.label ?? "—",
    value: resolveFirst(d, ["count", "users", "total", "value"]) ?? 0,
  }));
}

/* ── Main component ── */
export default function StatisticsPage() {
  const [dash, setDash] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [collectActivity, setCollectActivity] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.allSettled([
      adminApi.getDashboard(),
      adminApi.getNetworkGrowth(),
      adminApi.getCollectActivity({ period: "week" }),
      adminApi.getRankDistribution(),
    ]).then(([dashRes, growthRes, revenueRes, rankRes]) => {
      if (dashRes.status === "fulfilled") {
        setDash(dashRes.value.data?.data ?? dashRes.value.data);
      } else {
        setError(getApiError(dashRes.reason));
      }
      if (growthRes.status === "fulfilled") setGrowth(parseGrowthData(growthRes.value.data?.data ?? growthRes.value.data));
      if (revenueRes.status === "fulfilled") setCollectActivity(parseCollectData(revenueRes.value.data?.data ?? revenueRes.value.data));
      if (rankRes.status === "fulfilled") setRanks(parseRankData(rankRes.value.data?.data ?? rankRes.value.data));
    }).finally(() => setLoading(false));
  }, []);

  const r = (keys) => resolveFirst(dash, keys);

  const statCards = [
    {
      iconBg: "#EFF6FF", iconColor: "#3FAE8C",
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke={c} strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Utilisateurs totaux",
      value: fmt(r(["totalUsers", "usersCount", "users"])),
      trend: r(["totalUsersGrowth", "usersGrowth"]) != null ? `${r(["totalUsersGrowth", "usersGrowth"]) >= 0 ? "+" : ""}${r(["totalUsersGrowth", "usersGrowth"])}%` : null,
    },
    {
      iconBg: "#ECFDF5", iconColor: "#059669",
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Utilisateurs actifs",
      value: fmt(r(["activeUsers", "activeUsersCount", "active"])),
      trend: null,
    },
    {
      iconBg: "#FEF3C7", iconColor: "#D97706",
      icon: () => (
        <div className="relative w-6 h-5 shrink-0">
          <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
          <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
        </div>
      ),
      label: "Points SNL distribués",
      value: fmt(r(["totalPoints", "snlDistributed", "pointsDistributed"])),
      trend: null,
    },
    {
      iconBg: "#EDE9FE", iconColor: "#7C3AED",
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 7l-9.5 9.5-5-5L1 17" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 7h6v6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Taux d'activité",
      value: r(["activeRate", "activityRate"]) != null ? `${fmt(r(["activeRate", "activityRate"]))}%` : "—",
      trend: null,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Statistiques globales</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Analyser la santé et la performance de la plateforme</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((s) => <StatCard key={s.label} loading={loading} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          iconBg="#EFF6FF" iconColor="#3FAE8C"
          icon={(c) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke={c} strokeWidth="2"/>
            </svg>
          )}
          title="Croissance des utilisateurs"
          subtitle="Évolution par période"
        >
          <div className="h-[230px] w-full">
            <LineChart data={growth} loading={loading} />
          </div>
        </ChartCard>

        <ChartCard
          iconBg="#ECFDF5" iconColor="#059669"
          icon={(c) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          title="Collectes SNL / Activité"
          subtitle="SNL distribués par jour (7 derniers jours)"
        >
          <BarChart data={collectActivity} loading={loading} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          iconBg="#FEF3C7" iconColor="#D97706"
          icon={() => (
            <div className="relative w-6 h-5 shrink-0">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
              <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
            </div>
          )}
          title="Distribution des collectes SNL"
          subtitle="Par jour de la semaine"
        >
          <PieChart data={collectActivity.length ? collectActivity.map((d) => ({ label: d.label, value: d.value })) : []} loading={loading} />
        </ChartCard>

        <ChartCard
          iconBg="#EDE9FE" iconColor="#8B5CF6"
          icon={(c) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          title="Distribution par rang"
          subtitle="Répartition des membres"
        >
          <RankProgress data={ranks} loading={loading} />
        </ChartCard>
      </div>

      {!loading && dash && (
        <div className="rounded-2xl px-8 py-7" style={{ backgroundColor: "#3FAE8C" }}>
          <p className="text-white text-[16px] font-bold mb-5">Résumé de la plateforme</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Utilisateurs totaux", value: fmt(r(["totalUsers", "usersCount", "users"])) },
              { label: "Points SNL distribués", value: fmt(r(["totalPoints", "snlDistributed", "pointsDistributed"])) },
              { label: "Taux d'activité", value: r(["activeRate", "activityRate"]) != null ? `${fmt(r(["activeRate", "activityRate"]))}%` : "—" },
            ].map((kpi) => (
              <div key={kpi.label}>
                <p className="text-white/80 text-[13px] mb-1">{kpi.label}</p>
                <p className="text-white text-[36px] font-bold leading-none">{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
