"use client";

import { useState } from "react";

const allUsers = [
  { rank: 1,  initials: "WH", name: "whale_player",   points: "45,600", refs: 123, badge: "Légende", badgeColor: "#E5B858",  bgColor: "#3FAE8C" },
  { rank: 2,  initials: "DI", name: "diamond_hands",  points: "34,200", refs: 56,  badge: "Expert",  badgeColor: "#3FAE8C",  bgColor: "#3FAE8C" },
  { rank: 3,  initials: "HO", name: "hodl_king",      points: "23,400", refs: 67,  badge: "Expert",  badgeColor: "#3FAE8C",  bgColor: "#3FAE8C" },
  { rank: 4,  initials: "CR", name: "crypto_master",  points: "12,500", refs: 45,  badge: "Pro",     badgeColor: "#3B82F6",  bgColor: "#3FAE8C" },
  { rank: 5,  initials: "SN", name: "snl_collector",  points: "9,800",  refs: 34,  badge: "Pro",     badgeColor: "#3B82F6",  bgColor: "#3FAE8C" },
  { rank: 6,  initials: "MO", name: "moon_walker",    points: "8,900",  refs: 23,  badge: "Pro",     badgeColor: "#3B82F6",  bgColor: "#3FAE8C" },
  { rank: 7,  initials: "AI", name: "airdrop_hunter", points: "7,200",  refs: 18,  badge: "Pro",     badgeColor: "#3B82F6",  bgColor: "#3FAE8C" },
  { rank: 8,  initials: "DE", name: "degen_trader",   points: "4,500",  refs: 12,  badge: "Membre",  badgeColor: "#94A3B8",  bgColor: "#3FAE8C" },
  { rank: 9,  initials: "SC", name: "snl_chaser",     points: "3,800",  refs: 9,   badge: "Membre",  badgeColor: "#94A3B8",  bgColor: "#3FAE8C" },
  { rank: 10, initials: "NW", name: "new_wallet",     points: "2,900",  refs: 5,   badge: "Membre",  badgeColor: "#94A3B8",  bgColor: "#3FAE8C" },
  { rank: 42, initials: "YO", name: "vous (moi)",     points: "1,250",  refs: 3,   badge: "Membre",  badgeColor: "#94A3B8",  bgColor: "#3FAE8C", isCurrentUser: true },
];

function CrownIcon({ color = "#E5B858", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M2 19h20v2H2v-2zM2 7l5 5 5-7 5 7 5-5v10H2V7z" />
    </svg>
  );
}

function MedalCircle({ color, label }) {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
}

function RankCell({ user }) {
  if (user.rank === 1) return <CrownIcon color="#E5B858" size={22} />;
  if (user.rank === 2) return <MedalCircle color="#94A3B8" label="2" />;
  if (user.rank === 3) return <MedalCircle color="#CD7F32" label="3" />;
  return (
    <span
      className="text-[14px] font-semibold"
      style={{ color: user.isCurrentUser ? "white" : "#45556C" }}
    >
      {user.rank}
    </span>
  );
}

export default function ClassementPage() {
  // useState is available for potential future filters
  const [activeTab] = useState("global");

  const displayedUsers = allUsers.filter((u) => u.rank <= 10 || u.isCurrentUser);

  const rank1 = allUsers.find((u) => u.rank === 1);
  const rank2 = allUsers.find((u) => u.rank === 2);
  const rank3 = allUsers.find((u) => u.rank === 3);

  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1A3A34" }}
      >
        {/* Concentric circles decoration */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="absolute rounded-full border" style={{ width: 700, height: 700, borderColor: "rgba(255,255,255,0.04)" }} />
          <div className="absolute rounded-full border" style={{ width: 500, height: 500, borderColor: "rgba(255,255,255,0.04)" }} />
          <div className="absolute rounded-full border" style={{ width: 300, height: 300, borderColor: "rgba(255,255,255,0.04)" }} />
        </div>

        <div className="relative z-10 py-24 pb-40 text-center px-4">
          <h1 className="font-black text-4xl text-white mb-4">
            Classement Global
          </h1>
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.60)" }}>
            Découvrez les meilleurs collecteurs de la communauté SUNALA
          </p>

          {/* Mini stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              "12,847 participants",
              "Mis à jour en temps réel",
              "Top 100 récompensés",
            ].map((label) => (
              <div
                key={label}
                className="bg-white rounded-full px-4 py-2 shadow text-sm font-semibold"
                style={{ color: "#1A3A34" }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom angled transition matching LandingHero */}
        <div
          className="absolute -bottom-8 left-0 w-full h-32 bg-white"
          style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%, 32% 100%)" }}
        />
      </section>

      {/* ── Section 2: Podium ── */}
      <section className="bg-white relative z-10 -mt-10 pb-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-center gap-3 mb-12 pt-10">
            {/* Rank 2 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white"
                style={{ backgroundColor: "#3FAE8C" }}
              >
                {rank2.initials}
              </div>
              <div className="font-bold text-sm" style={{ color: "#1A3A34" }}>
                {rank2.name}
              </div>
              <div className="text-slate-500 text-xs">{rank2.points} pts</div>
              <div
                className="w-24 flex items-center justify-center rounded-t-2xl font-black text-2xl text-white h-20"
                style={{ backgroundColor: "#1A3A34" }}
              >
                2
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center gap-2">
              {/* Crown */}
              <CrownIcon color="#E5B858" size={28} />
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white"
                style={{ backgroundColor: "#E5B858" }}
              >
                {rank1.initials}
              </div>
              <div className="font-bold text-sm" style={{ color: "#1A3A34" }}>
                {rank1.name}
              </div>
              <div className="text-slate-500 text-xs">{rank1.points} pts</div>
              <div
                className="w-28 flex items-center justify-center rounded-t-2xl font-black text-2xl text-white h-28"
                style={{ backgroundColor: "#1A3A34" }}
              >
                1
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white"
                style={{ backgroundColor: "#3FAE8C" }}
              >
                {rank3.initials}
              </div>
              <div className="font-bold text-sm" style={{ color: "#1A3A34" }}>
                {rank3.name}
              </div>
              <div className="text-slate-500 text-xs">{rank3.points} pts</div>
              <div
                className="w-24 flex items-center justify-center rounded-t-2xl font-black text-2xl text-white h-16"
                style={{ backgroundColor: "#1A3A34" }}
              >
                3
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Full Table ── */}
      <section className="bg-white pb-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2
            className="font-bold text-xl mb-4"
            style={{ color: "#1A3A34" }}
          >
            Tableau complet
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <div className="bg-white min-w-[600px]">
              {/* Header */}
              <div
                className="grid px-6 py-3 rounded-t-xl text-xs font-bold uppercase tracking-wider text-slate-500"
                style={{
                  gridTemplateColumns: "0.5fr 2fr 1.5fr 1fr 1fr",
                  backgroundColor: "#E2E8F0",
                }}
              >
                <div>Rang</div>
                <div>Utilisateur</div>
                <div>Points SNL</div>
                <div>Parrainages</div>
                <div>Badge</div>
              </div>

              {/* Rows */}
              {displayedUsers.map((user, idx) => {
                const prevUser = displayedUsers[idx - 1];
                const showSeparator =
                  user.isCurrentUser &&
                  user.rank > 10 &&
                  prevUser &&
                  prevUser.rank <= 10;

                return (
                  <div key={user.rank}>
                    {/* Separator */}
                    {showSeparator && (
                      <div className="px-6 py-2 text-center text-slate-400" style={{ fontSize: 12 }}>
                        ···
                      </div>
                    )}

                    {/* Row */}
                    <div
                      className="grid px-6 py-4 items-center border-b border-slate-50 last:border-0 transition-colors"
                      style={{
                        gridTemplateColumns: "0.5fr 2fr 1.5fr 1fr 1fr",
                        backgroundColor: user.isCurrentUser ? "#1A3A34" : undefined,
                      }}
                      onMouseEnter={(e) => {
                        if (!user.isCurrentUser)
                          e.currentTarget.style.backgroundColor = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (!user.isCurrentUser)
                          e.currentTarget.style.backgroundColor = "";
                      }}
                    >
                      {/* RANG */}
                      <div>
                        <RankCell user={user} />
                      </div>

                      {/* UTILISATEUR */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                          style={{
                            backgroundColor:
                              user.rank === 1 ? "#E5B858" : "#3FAE8C",
                          }}
                        >
                          {user.initials}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-semibold text-sm"
                            style={{
                              color: user.isCurrentUser ? "white" : "#0F172B",
                            }}
                          >
                            {user.name}
                          </span>
                          {user.isCurrentUser && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-bold"
                              style={{
                                backgroundColor: "#2DD4BF",
                                color: "#1A3A34",
                              }}
                            >
                              Vous
                            </span>
                          )}
                        </div>
                      </div>

                      {/* POINTS SNL */}
                      <div
                        className="font-semibold text-sm"
                        style={{
                          color: user.isCurrentUser ? "white" : "#0F172B",
                        }}
                      >
                        {user.points} SNL
                      </div>

                      {/* PARRAINAGES */}
                      <div
                        className="text-sm"
                        style={{
                          color: user.isCurrentUser
                            ? "rgba(255,255,255,0.80)"
                            : "#45556C",
                        }}
                      >
                        {user.refs}
                      </div>

                      {/* BADGE */}
                      <div>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{
                            backgroundColor: user.badgeColor + "22",
                            color: user.badgeColor,
                          }}
                        >
                          {user.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
