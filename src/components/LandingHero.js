import Link from "next/link";
import Image from "next/image";
import LaunchCountdown from "./LaunchCountdown";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#1F4E46" }}>

      {/* S watermark #1 — bas gauche */}
      <img
        src="/images/Group.png"
        alt="" aria-hidden="true"
        className="absolute select-none pointer-events-none hidden lg:block"
        style={{ width: 160, height: 360, opacity: 0.75, left: 160, top: 535 }}
      />

      {/* S watermark #2 — droite, déborde vers la section suivante */}
      <img
        src="/images/Group.png"
        alt="" aria-hidden="true"
        className="absolute select-none pointer-events-none hidden lg:block"
        style={{ width: 280, height: 420, opacity: 0.75, right: -40, bottom: -220 }}
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-10 lg:pt-16 pb-20 lg:pb-40">

          {/* Left content */}
          <div className="relative z-10 text-center lg:text-left">
            {/* H1 */}
            <h1 className="font-black text-[32px] sm:text-[44px] lg:text-[64px] text-white leading-none mb-6">
              Rejoignez la<br />communauté<br />
              <span style={{ color: "#3FAE8C" }}>SUNALA</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] mb-10 leading-relaxed max-w-md mx-auto lg:mx-0" style={{ color: "rgba(255,255,255,0.70)" }}>
              Accumulez des points SNL chaque jour, parrainez votre entourage et grimpez dans le classement. Préparez-vous dès maintenant pour le lancement du token communautaire SUNALA.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center gap-6 rounded-full font-bold text-[16px] text-white pl-6 pr-4 py-4 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#3FAE8C" }}
              >
                Commencer gratuitement
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/snl"
                className="inline-flex items-center gap-2 rounded-full font-semibold text-[15px] text-white px-6 py-4 transition-all hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.35)" }}
              >
                Comprendre le $SNL
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <LaunchCountdown />

          </div>

          {/* Right side: coin image + floating stat cards */}
          <div className="relative hidden lg:block mt-6">
            {/* Coin image */}
            <Image
              src="/images/Group 164.png"
              alt="SUNALA coin"
              width={500}
              height={500}
              style={{ objectFit: "contain", width: "100%", height: "auto" }}
            />

            {/* Card 1 — left, vertically centered */}
            <div
              className="absolute bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4"
              style={{ top: "18%", left: "-40px", minWidth: 230 }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 36, lineHeight: "40px", fontWeight: 700, letterSpacing: "0.37px", color: "#000000" }}>12,847</div>
                <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, letterSpacing: "-0.31px", color: "rgba(0,0,0,0.50)" }}>Membres actifs</div>
              </div>
            </div>

            {/* Card 2 — right, upper area */}
            <div
              className="absolute bg-white rounded-2xl shadow-xl px-5 py-8 text-center"
              style={{ top: "18%", right: "-30px", minWidth: 160 }}
            >
              <div className="flex justify-center mb-2">
                <svg width="64" height="64" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="20" fill="none" stroke="#E2E8F0" strokeWidth="5"/>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="#3FAE8C" strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 20 * 0.65} ${2 * Math.PI * 20 * 0.35}`}
                    strokeLinecap="round"
                    transform="rotate(-90 26 26)"
                  />
                </svg>
              </div>
              <div className="font-black text-3xl leading-none" style={{ color: "#0F172B" }}>65%</div>
              <div className="text-sm text-slate-500 mt-1 leading-snug">Taux d&apos;activité<br/>quotidien</div>
            </div>

            {/* Card 3 — bottom center */}
            <div
              className="absolute bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4"
              style={{ bottom: "-6%", left: "50%", transform: "translateX(-50%)", minWidth: 250 }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#3FAE8C" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="9" r="5"/><circle cx="16" cy="15" r="5"/>
                </svg>
              </div>
              <div>
                <div className="font-black text-2xl leading-none" style={{ color: "#0F172B" }}>2.4M+</div>
                <div className="text-sm text-slate-500 mt-1">Points SNL distribués</div>
              </div>
            </div>
          </div>
        </div>
        {/* Trust stats — full width bottom bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-6 sm:gap-4 pb-14 lg:pb-20 mb-10 lg:mb-20 relative z-10 lg:-mt-21.25">
          {[
            {
              label: "100% gratuit",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
                </svg>
              ),
            },
            {
              label: "sans investissement",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              ),
            },
            {
              label: "Communauté active",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              ),
            },
          ].map(({ label, icon }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                {icon}
              </div>
              <span className="font-bold text-[16px] lg:text-[30px] text-white">{label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom angled transition */}
      <div
        className="absolute -bottom-8 left-0 w-full h-32 bg-white"
        style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%, 32% 100%)" }}
      />
    </section>
  );
}
