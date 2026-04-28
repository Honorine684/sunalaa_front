"use client";

/* ── Data ── */
const lineData = [
  { label: "01/12", value: 8500 },
  { label: "05/12", value: 9200 },
  { label: "10/12", value: 9800 },
  { label: "15/12", value: 10500 },
  { label: "20/12", value: 11400 },
  { label: "25/12", value: 12600 },
  { label: "30/12", value: 13400 },
];

const barData = [
  { label: "Lun", value: 7200 },
  { label: "Mar", value: 8100 },
  { label: "Mer", value: 7800 },
  { label: "Jeu", value: 8600 },
  { label: "Ven", value: 9300 },
  { label: "Sam", value: 9100 },
  { label: "Dim", value: 8400 },
];

const pieData = [
  { label: "Collectes quotidiennes", pct: 51, value: "1,245,678 SNL", color: "#3B82F6" },
  { label: "Bonus parrainage",       pct: 35, value: "856,234 SNL",   color: "#8B5CF6" },
  { label: "Récompenses admin",      pct: 14, value: "357,009 SNL",   color: "#3FAE8C" },
];

const referralData = [
  { level: "Niveau 1",  users: "4,250", pct: 45 },
  { level: "Niveau 2",  users: "3,180", pct: 33 },
  { level: "Niveau 3",  users: "1,890", pct: 20 },
  { level: "Niveau 4+", users: "580",   pct: 2  },
];

/* ── Line Chart SVG ── */
function LineChart() {
  const W = 480, H = 220;
  const padL = 52, padR = 20, padT = 16, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxV = 14000, minV = 0;
  const yLabels = [0, 3500, 7000, 10500, 14000];

  const px = (i) => padL + (i / (lineData.length - 1)) * plotW;
  const py = (v) => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const points = lineData.map((d, i) => `${px(i)},${py(d.value)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {/* Y grid + labels */}
      {yLabels.map((y) => (
        <g key={y}>
          <line x1={padL} y1={py(y)} x2={W - padR} y2={py(y)} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"/>
          <text x={padL - 6} y={py(y) + 4} textAnchor="end" fontSize="10" fill="#94A3B8">{y === 0 ? "0" : `${y/1000*1}`.replace(".", ",")}</text>
        </g>
      ))}
      {/* X labels */}
      {lineData.map((d, i) => (
        <text key={i} x={px(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#94A3B8">{d.label}</text>
      ))}
      {/* Line */}
      <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Dots */}
      {lineData.map((d, i) => (
        <circle key={i} cx={px(i)} cy={py(d.value)} r="4" fill="#3B82F6" stroke="white" strokeWidth="2"/>
      ))}
    </svg>
  );
}

/* ── Bar Chart ── */
function BarChart() {
  const maxV = Math.max(...barData.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-2 h-[190px] px-2">
      {barData.map((d) => {
        const heightPct = (d.value / maxV) * 100;
        return (
          <div key={d.label} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:brightness-110"
              style={{ height: `${heightPct}%`, backgroundColor: "#3FAE8C" }}
            />
            <span className="text-[10px]" style={{ color: "#94A3B8" }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Y axis labels for bar chart ── */
function BarChartWithAxis() {
  const maxV = 10000;
  const yLabels = [0, 2500, 5000, 7500, 10000];
  return (
    <div className="flex gap-2 h-[230px]">
      {/* Y axis */}
      <div className="flex flex-col-reverse justify-between pb-6 shrink-0">
        {yLabels.map((y) => (
          <span key={y} className="text-[10px] text-right w-10" style={{ color: "#94A3B8" }}>{y === 0 ? "0" : `${y/1000}`.replace(".", ",")}00</span>
        ))}
      </div>
      {/* Bars */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-between gap-1.5 border-l border-b border-slate-100 pl-2 pb-1">
          {barData.map((d) => {
            const heightPct = (d.value / maxV) * 100;
            return (
              <div key={d.label} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                <div
                  className="w-full rounded-t-md hover:brightness-110 transition-all duration-300"
                  style={{ height: `${heightPct}%`, backgroundColor: "#3FAE8C" }}
                />
              </div>
            );
          })}
        </div>
        {/* X labels */}
        <div className="flex justify-between pl-2 pt-1">
          {barData.map((d) => (
            <span key={d.label} className="flex-1 text-center text-[10px]" style={{ color: "#94A3B8" }}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Pie Chart ── */
function PieChart() {
  const cx = 130, cy = 120, r = 100;
  let cur = -Math.PI / 2;

  const slices = pieData.map((d) => {
    const start = cur;
    const sweep = (d.pct / 100) * 2 * Math.PI;
    cur += sweep;
    return { ...d, start, end: cur, mid: start + sweep / 2 };
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
      {/* SVG pie */}
      <div className="flex justify-center">
        <svg viewBox="0 0 260 240" className="w-full max-w-[260px]">
          {slices.map((s) => (
            <path key={s.label} d={arcPath(s)} fill={s.color} />
          ))}
          {/* White slice separators */}
          {slices.map((s) => {
            const [x, y] = pt(s.start, r);
            return (
              <line key={s.label + "sep"} x1={cx} y1={cy} x2={x} y2={y}
                stroke="white" strokeWidth="2.5" />
            );
          })}
          {/* Percentage labels inside slices */}
          {slices.map((s) => {
            const [lx, ly] = pt(s.mid, r * 0.62);
            return (
              <text key={s.label + "pct"} x={lx} y={ly}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="13" fontWeight="700" fill="white" fontFamily="Inter, sans-serif">
                {s.pct}%
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3">
        {pieData.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[13px]" style={{ color: "#45556C" }}>{d.label}</span>
            </div>
            <span className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Progress Bar ── */
function ReferralProgress() {
  return (
    <div className="flex flex-col gap-4">
      {referralData.map((r) => (
        <div key={r.level}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[14px]" style={{ color: "#0F172B" }}>{r.level}</span>
            <div className="flex items-center gap-3">
              <span className="text-[13px]" style={{ color: "#45556C" }}>{r.users} utilisateurs</span>
              <span className="text-[13px] font-normal w-8 text-right" style={{ color: "#45556C" }}>{r.pct}%</span>
            </div>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#EDE9FE" }}>
            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${r.pct}%`, backgroundColor: "#8B5CF6" }} />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
        <span className="text-[14px]" style={{ color: "#45556C" }}>Total parrainages actifs</span>
        <span className="text-[20px] font-bold" style={{ color: "#0F172B" }}>9,900</span>
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

/* ── Main component ── */
export default function StatisticsPage() {
  const stats = [
    {
      iconBg: "#EFF6FF", iconColor: "#3FAE8C",
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke={c} strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      trend: "+12.5%", label: "Utilisateurs totaux", value: "12,847",
    },
    {
      iconBg: "#ECFDF5", iconColor: "#059669",
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      trend: "+5.1%", label: "Utilisateurs actifs (24h)", value: "8,432",
    },
    {
      iconBg: "#FEF3C7", iconColor: "#D97706",
      icon: () => (
        <div className="relative w-6 h-5 shrink-0">
          <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
          <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
        </div>
      ),
      trend: "+8.2%", label: "Points SNL distribués", value: "2,458,921",
    },
    {
      iconBg: "#EDE9FE", iconColor: "#7C3AED",
      icon: (c) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 7l-9.5 9.5-5-5L1 17" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 7h6v6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      trend: "+2.3%", label: "Taux de collecte", value: "65.6%",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Statistiques globales</h2>
        <p className="text-[14px]" style={{ color: "#45556C" }}>Analyser la santé et la performance de la plateforme</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.iconBg }}>
                {s.icon(s.iconColor)}
              </div>
              <div className="flex items-center gap-1 text-[13px]" style={{ color: "#3FAE8C" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {s.trend}
              </div>
            </div>
            <p className="text-[13px] mb-1" style={{ color: "#45556C" }}>{s.label}</p>
            <p className="text-[28px] font-bold" style={{ color: "#1F4E46" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          iconBg="#EFF6FF" iconColor="#3FAE8C"
          icon={(c) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke={c} strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          title="Croissance des utilisateurs"
          subtitle="Évolution mensuelle"
        >
          <div className="h-[230px] w-full">
            <LineChart />
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
          title="Collectes quotidiennes"
          subtitle="7 derniers jours"
        >
          <BarChartWithAxis />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          iconBg="#FEF3C7" iconColor="#D97706"
          icon={() => (
            <div className="relative w-6 h-5 shrink-0">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
              <div className="absolute left-2.5 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
            </div>
          )}
          title="Distribution des points SNL"
          subtitle="Par type d'attribution"
        >
          <PieChart />
        </ChartCard>

        <ChartCard
          iconBg="#EDE9FE" iconColor="#8B5CF6"
          icon={(c) => (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          title="Activité de parrainage"
          subtitle="Répartition par niveau"
        >
          <ReferralProgress />
        </ChartCard>
      </div>

      {/* Summary banner */}
      <div className="rounded-2xl px-8 py-7" style={{ backgroundColor: "#3FAE8C" }}>
        <p className="text-white text-[16px] font-bold mb-5">Résumé de la période</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Taux de rétention (7j)", value: "78.5%" },
            { label: "Moyenne SNL par utilisateur", value: "191" },
            { label: "Nouveaux utilisateurs (30j)", value: "4,427" },
          ].map((kpi) => (
            <div key={kpi.label}>
              <p className="text-white/80 text-[13px] mb-1">{kpi.label}</p>
              <p className="text-white text-[36px] font-bold leading-none">{kpi.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
