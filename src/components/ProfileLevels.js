const levels = [
  {
    id: "bronze",
    label: "Bronze",
    sub: "Niveau de départ",
    state: "unlocked",
    iconBg: "#BB4D00",
    iconGradient: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
        <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "silver",
    label: "Silver",
    sub: "Requis : 5,000 SNL",
    state: "active",
    iconBg: null,
    iconGradient: "linear-gradient(135deg, #90A1B9, #45556C)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 21h8m-4-4v4m0-4c-4.418 0-8-3.582-8-8V5h16v4c0 4.418-3.582 8-8 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 9H2a1 1 0 01-1-1V7a1 1 0 011-1h2M20 9h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "gold",
    label: "Gold",
    sub: "Requis : 15,000 SNL",
    state: "locked",
    iconBg: "#E6B84C",
    iconGradient: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "platinum",
    label: "Platinum",
    sub: "Requis : 30,000 SNL",
    state: "locked",
    iconBg: "#00D3F2",
    iconGradient: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 7h6v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "diamond",
    label: "Diamond",
    sub: "Requis : 50,000 SNL",
    state: "locked",
    iconBg: null,
    iconGradient: "linear-gradient(135deg, #C27AFF, #E60076)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M2 19h20M3 9l4 5 5-8 5 8 4-5v10H3V9z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function ProfileLevels() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <h3 className="mb-5" style={{ fontSize: 18, fontWeight: 700, lineHeight: "28px", color: "#0F172B" }}>
        Tous les niveaux
      </h3>
      <div className="flex flex-col gap-3">
        {levels.map((level) => (
          <div
            key={level.id}
            className={[
              "flex items-center gap-4 p-3 rounded-xl border transition-all",
              level.state === "active"
                ? "border-blue-200 bg-blue-50/40"
                : "border-transparent",
            ].join(" ")}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center shrink-0"
              style={{ width: 56, height: 56, borderRadius: 14, ...(level.iconGradient ? { background: level.iconGradient } : { backgroundColor: level.iconBg }) }}
            >
              {level.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] lg:text-[18px]" style={{ fontWeight: 400, lineHeight: "28px", color: "#1E293B" }}>{level.label}</span>
                {level.state === "active" && (
                  <span className="bg-blue-500 text-white text-[10px] font-normal px-2 py-0.5 rounded-full">
                    Actuel
                  </span>
                )}
              </div>
              {level.state === "unlocked" ? (
                <span className="text-[12px] text-emerald-500 font-normal flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Débloqué
                </span>
              ) : (
                <span className="text-[12px] text-slate-400">{level.sub}</span>
              )}
              {level.state === "unlocked" && (
                <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "20px", color: "#94A3B8" }}>Niveau de départ</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
