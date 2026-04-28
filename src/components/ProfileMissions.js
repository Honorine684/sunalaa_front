import Image from "next/image";

const missions = [
  {
    id: 1,
    title: "Rejoindre le canal Facebook SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Facebook",
    snl: 10,
    iconBg: "#1877F2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    barColor: "#344054",
    barWidth: "100%",
    btnVariant: "dark",
  },
  {
    id: 2,
    title: "Rejoindre le canal Telegram SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Telegram",
    snl: 10,
    iconBg: "#26A5E4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    barColor: "#E6B84C",
    barWidth: "80%",
    btnVariant: "gold",
  },
  {
    id: 3,
    title: "Rejoindre le canal Twitter SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Twitter",
    snl: 10,
    iconBg: "#26A5E4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    barColor: "#CBD5E1",
    barWidth: "100%",
    btnVariant: "obtained",
  },
  {
    id: 4,
    title: "Inviter 5 amis sur Telegram SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Telegram",
    snl: 10,
    iconBg: "#26A5E4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    barColor: "#344054",
    barWidth: "40%",
    btnVariant: "dark",
    invited: 2,
    remaining: 3,
  },
  {
    id: 5,
    title: "Inviter 5 amis sur Instagram SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Instagram",
    snl: 10,
    iconBg: "#26A5E4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    barColor: "#344054",
    barWidth: "40%",
    btnVariant: "dark",
    invited: 2,
    remaining: 3,
  },
  {
    id: 6,
    title: "Inviter 5 amis sur Youtube SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Youtube",
    snl: 10,
    iconBg: "#26A5E4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    barColor: "#344054",
    barWidth: "40%",
    btnVariant: "dark",
    invited: 2,
    remaining: 3,
  },
];

function MissionButton({ variant }) {
  const base = "shrink-0 flex items-center justify-center rounded-lg";
  const sizeStyle = { width: 110, height: 40, fontSize: 14, fontWeight: 500 };

  if (variant === "gold") {
    return (
      <button className={`${base} bg-[#E6B84C] text-white hover:brightness-110 transition cursor-pointer`} style={sizeStyle}>
        Réclamé
      </button>
    );
  }
  if (variant === "obtained") {
    return (
      <button disabled className={`${base} bg-[#E2E8F0] text-slate-400 cursor-default`} style={sizeStyle}>
        Obtenu
      </button>
    );
  }
  return (
    <button className={`${base} bg-[#344054] text-white hover:brightness-110 transition cursor-pointer`} style={sizeStyle}>
      Réclamé
    </button>
  );
}

function MissionCard({ mission }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top row: icon + title/desc + coin/snl */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: mission.iconBg }}
        >
          {mission.icon}
        </div>

        {/* Title / desc — coin / SNL alignés */}
        <div className="flex-1 min-w-0">
          {/* Ligne 1 : titre + coin */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[16px] lg:text-[22px]" style={{ fontWeight: 600, lineHeight: "22px", color: "#0F172B" }}>{mission.title}</p>
            <div className="relative w-7 h-7 shrink-0">
              <Image src="/images/4.png" alt="coins" fill className="object-contain" />
            </div>
          </div>
          {/* Ligne 2 : desc + SNL (même ligne) */}
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-[12px] lg:text-[16px]" style={{ fontWeight: 400, lineHeight: "22.75px", color: "#94A3B8" }}>{mission.desc}</p>
            <span className="shrink-0 whitespace-nowrap text-[14px] lg:text-[20px]" style={{ fontWeight: 700, lineHeight: "21px", color: "#0A3706" }}>
              {mission.snl} SNL
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: progress bar + button */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: mission.barWidth, backgroundColor: mission.barColor }}
          />
        </div>
        <MissionButton variant={mission.btnVariant} />
      </div>

      {/* Labels for invite missions */}
      {(mission.invited !== undefined) && (
        <div className="flex justify-between mt-1.5">
          <span className="text-slate-400 text-[12px]">{mission.invited} amis invités</span>
          <span className="text-slate-400 text-[12px]">{mission.remaining} restants</span>
        </div>
      )}
    </div>
  );
}

export default function ProfileMissions() {
  return (
    <div className="flex flex-col gap-4">
      {missions.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
