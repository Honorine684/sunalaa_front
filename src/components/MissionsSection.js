import Image from "next/image";
import Container from "./Container";

/* ── Mission data ── */
const missions = [
  {
    id: 1,
    platform: "Telegram",
    title: "Rejoindre le canal Telegram SUNALAA",
    desc: "Rejoignez notre communauté officielle sur Telegram",
    snl: 10,
    state: "start",
    iconBg: "#1A3C34",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: 2,
    platform: "Twitter / X",
    title: "Suivre SUNALAA sur X (Twitter)",
    desc: "Suivez-nous pour les dernières actualités",
    snl: 10,
    state: "start",
    iconBg: "#1A3C34",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: 3,
    platform: "WhatsApp",
    title: "Partager SUNALAA sur WhatsApp",
    desc: "Partagez avec 3 contacts minimum",
    snl: 20,
    state: "start",
    iconBg: "#25D366",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" stroke="white" strokeWidth="0.5" />
      </svg>
    ),
  },
  {
    id: 4,
    platform: "Twitter / X",
    title: "Retweeter notre post épinglé",
    desc: "Aidez-nous à faire connaître SUNALAA",
    snl: 20,
    state: "verify",
    iconBg: "#1A3C34",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    id: 5,
    platform: "Facebook",
    title: "Liker la page Facebook SUNALAA",
    desc: "Aidez-nous à faire connaître SUNALAA",
    snl: 15,
    state: "claimed-gold",
    iconBg: "#1877F2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 6,
    platform: "Telegram",
    title: "Inviter 5 amis sur Telegram",
    desc: "Invitez vos amis à rejoindre le canal",
    snl: 15,
    state: "claimed-gray",
    iconBg: "#1A3C34",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

/* ── Action button ── */
function ActionButton({ state }) {
  if (state === "start") {
    return (
      <button className="w-full bg-[#344054] text-white text-[14px] font-normal py-3 rounded-xl hover:brightness-110 transition cursor-pointer">
        Commencer
      </button>
    );
  }
  if (state === "verify") {
    return (
      <button className="w-full bg-[#E17100] text-white text-[14px] font-normal py-3 rounded-xl hover:brightness-110 transition cursor-pointer">
        Vérifier
      </button>
    );
  }
  if (state === "claimed-gold") {
    return (
      <button disabled className="w-full bg-[#E6B84C] text-white text-[14px] font-normal py-3 rounded-xl cursor-default">
        Réclamé
      </button>
    );
  }
  return (
    <button disabled className="w-full bg-[#E2E8F0] text-gray-400 text-[14px] font-normal py-3 rounded-xl cursor-default">
      Réclamé
    </button>
  );
}

export default function MissionsSection() {
  return (
    <section className="bg-white py-16 relative overflow-hidden">
      {/* Decorative concentric circles — left (décollés du bord) */}
      <div className="absolute left-[13%] top-[178px] pointer-events-none select-none">
        {[338, 281, 224, 140].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-secondary/25"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }}
          />
        ))}
      </div>

      {/* Decorative concentric circles — right (décollés du bord) */}
      <div className="absolute right-[13%] top-[202px] pointer-events-none select-none">
        {[338, 281, 224, 140].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-secondary/25"
            style={{ width: size, height: size, right: -size / 2, top: -size / 2 }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-bold mb-4" style={{ fontSize: 48, lineHeight: "48px", letterSpacing: "-0.33px", color: "#0F172B" }}>
            Gagnez des SNL
          </h2>
          <p className="max-w-lg mx-auto text-center" style={{ fontSize: 18, fontWeight: 400, lineHeight: "29.25px", color: "#0F172B" }}>
            Complétez des missions simples sur les réseaux sociaux et boostez votre
            solde de points SNL en quelques clics.
          </p>
        </div>

        {/* "Points à gagner" label */}
        <p className="mb-5" style={{ fontSize: 24, fontWeight: 600, lineHeight: "21.5px", letterSpacing: 0, color: "#0A3706" }}>Points à gagner</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {missions.map((mission) => {
            const faded = mission.state === "claimed-gray";
            const snlColor = faded ? "#CBD5E1" : "#0A3706";
            return (
              <div
                key={mission.id}
                className="flex flex-col justify-between bg-white hover:scale-[1.01] transition-transform duration-200"
                style={{ minHeight: 170, borderRadius: 8, border: "1px solid rgba(7,58,3,0.16)", padding: 16, gap: 12 }}
              >
                {/* Top row */}
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: mission.iconBg }}
                  >
                    {mission.icon}
                  </div>

                  {/* Title / desc — et coin / SNL alignés sur la même ligne */}
                  <div className="flex-1 min-w-0">
                    {/* Ligne 1 : titre + coin */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[14px] sm:text-[20px]" style={{ fontWeight: 600, lineHeight: "22px", color: "#0F172B" }}>
                        {mission.title}
                      </p>
                      <div className={`relative w-6 h-6 sm:w-8 sm:h-8 shrink-0 ${faded ? "opacity-40" : ""}`}>
                        <Image
                          src="/images/4.png"
                          alt="coins"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    {/* Ligne 2 : desc + SNL */}
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-[12px] sm:text-[16px]" style={{ fontWeight: 400, lineHeight: "22.75px", color: "#45556C" }}>
                        {mission.desc}
                      </p>
                      <span className="font-bold shrink-0 text-[14px] sm:text-[20px]" style={{ lineHeight: "21px", color: snlColor }}>
                        {mission.snl} SNL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Button */}
                <ActionButton state={mission.state} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
