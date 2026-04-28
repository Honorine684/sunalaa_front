/* Couronne pour le 1er */
function CrownIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
      <path
        d="M6 34h36M8 34L4 16l10 8 10-14 10 14 10-8-4 18H8z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.2"
      />
      <circle cx="4" cy="16" r="2.5" fill="white" />
      <circle cx="24" cy="2" r="2.5" fill="white" />
      <circle cx="44" cy="16" r="2.5" fill="white" />
    </svg>
  );
}

/* Médaille pour 2e et 3e */
function MedalIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
      {/* Ruban haut */}
      <path
        d="M18 4l6 10 6-10"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tige */}
      <line x1="24" y1="14" x2="24" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cercle médaille */}
      <circle cx="24" cy="32" r="12" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2.5" />
      {/* Étoile/détail intérieur */}
      <circle cx="24" cy="32" r="6" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

const config = {
  1: {
    gradient: "from-amber-400 to-orange-500",
    badgeBg: "bg-amber-400",
    size: "w-24 h-24",
    icon: <CrownIcon />,
  },
  2: {
    gradient: "from-slate-400 to-slate-500",
    badgeBg: "bg-slate-500",
    size: "w-20 h-20",
    icon: <MedalIcon />,
  },
  3: {
    gradient: "from-amber-600 to-orange-700",
    badgeBg: "bg-amber-700",
    size: "w-20 h-20",
    icon: <MedalIcon />,
  },
};

export default function PodiumItem({ rank, username, score }) {
  const { gradient, badgeBg, size, icon } = config[rank];

  return (
    <div className="flex flex-col items-center gap-3 flex-1">
      <div className="relative">
        <div
          className={`${size} bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
        >
          {icon}
          {/* Badge rang centré en bas */}
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${badgeBg} text-white text-xs font-normal w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow`}
          >
            {rank}
          </span>
        </div>
      </div>

      <p className="text-gray-500 text-[13px] mt-1">{username}</p>
      <p className="text-[15px] font-normal text-gray-700">
        {score} <span className="text-gray-400 text-xs">SNL</span>
      </p>
    </div>
  );
}
