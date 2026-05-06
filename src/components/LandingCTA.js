import Link from "next/link";

export default function LandingCTA() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#1F4E46" }}>

      {/* Top transition line matching the reference */}
      <div
        className="absolute -top-20 left-0 w-full hidden lg:block"
        style={{
          height: "210px",
          backgroundColor: "#FFFFFF",
          clipPath: "polygon(0 0, 100% 0, 100% 42%, 40.5% 42%, 31.5% 100%, 0 100%)",
        }}
      />
      {/* Mobile top transition — simple */}
      <div className="absolute top-0 left-0 w-full h-10 bg-white lg:hidden" />

      {/* Decorative triangles in background */}
      <div
        className="absolute bottom-0 left-8 pointer-events-none select-none"
        style={{
          width: 0, height: 0,
          borderLeft: "60px solid transparent",
          borderRight: "60px solid transparent",
          borderBottom: "90px solid rgba(255,255,255,0.04)",
        }}
      />
      <div
        className="absolute bottom-0 right-16 pointer-events-none select-none"
        style={{
          width: 0, height: 0,
          borderLeft: "80px solid transparent",
          borderRight: "80px solid transparent",
          borderBottom: "120px solid rgba(255,255,255,0.04)",
        }}
      />
      <div
        className="absolute top-1/2 right-32 -translate-y-1/2 pointer-events-none select-none opacity-30"
        style={{
          width: 0, height: 0,
          borderLeft: "30px solid transparent",
          borderRight: "30px solid transparent",
          borderBottom: "50px solid rgba(255,255,255,0.08)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 pt-16 lg:pt-52 pb-16 lg:pb-24">
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          style={{ backgroundColor: "#3FAE8C" }}
        >
          {/* Decorative triangles inside card */}
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: 0, height: 0,
              borderLeft: "70px solid rgba(255,255,255,0.08)",
              borderBottom: "70px solid transparent",
            }}
          />
          <div
            className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              width: 0, height: 0,
              borderRight: "90px solid rgba(255,255,255,0.08)",
              borderTop: "90px solid transparent",
            }}
          />

          {/* Left — text */}
          <div className="relative z-10">
            <h2 className="text-[18px] lg:text-3xl font-black text-white mb-3">
              Prêt à commencer&nbsp;?
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed max-w-md">
              Rejoignez des milliers de membres qui accumulent déjà leurs points SNL en vue du lancement du token communautaire
            </p>
          </div>

          {/* Right — button */}
          <div className="relative z-10 shrink-0 w-full lg:w-auto">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-3 bg-white font-bold text-[13px] lg:text-[15px] rounded-full px-6 lg:px-8 py-3 lg:py-4 hover:brightness-95 transition-all duration-300 whitespace-nowrap w-full lg:w-auto"
              style={{ color: "#1A3A34" }}
            >
              Créer mon compte gratuitement
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
