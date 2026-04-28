export default function StatCard({ icon, iconBg, trend, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-6">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        {/* Trend */}
        <div className="flex items-center gap-1 text-[13px] font-normal" style={{ color: "#3FAE8C" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {trend}
        </div>
      </div>
      <p className="text-[13px] mb-1" style={{ color: "#45556C" }}>{label}</p>
      <p className="text-[28px] font-bold leading-none" style={{ color: "#1F4E46" }}>{value}</p>
    </div>
  );
}
