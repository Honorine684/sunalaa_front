import Link from "next/link";
import Container from "./Container";

/* ── Icon wrapper ── */
function IconBox({ children, color = "#3FAE8C" }) {
  return (
    <div className="flex items-center justify-center shrink-0" style={{ width: "57.65px", height: "57.65px", borderRadius: "16.81px", backgroundColor: color }}>
      {children}
    </div>
  );
}

/* ── Card shell ── */
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function HomeDashboard() {
  return (
    <div className="relative bg-white overflow-hidden">

      {/* Concentric circles — left */}
      <div className="absolute left-[10%] top-[180px] pointer-events-none select-none z-0">
        {[300, 220, 145, 70].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }}
          />
        ))}
      </div>

      {/* Concentric circles — right */}
      <div className="absolute right-[10%] top-[180px] pointer-events-none select-none z-0">
        {[300, 220, 145, 70].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, right: -size / 2, top: -size / 2 }}
          />
        ))}
      </div>

      <Container className="relative z-10 pt-16 pb-20">

        {/* ── Section title ── */}
        <div className="text-center mb-10">
          <h2 className="font-bold text-primary mb-3 text-[28px] lg:text-[48px]" style={{ lineHeight: "1.1", letterSpacing: "0.35px" }}>
            Gagnez des SNL
          </h2>
          <p className="text-center mx-auto text-[14px] lg:text-[18px]" style={{ lineHeight: "28px", maxWidth: 672, color: "#0F172B" }}>
            Complétez des missions simples sur les réseaux sociaux et boostez votre solde de points SNL en quelques clics.
          </p>
        </div>

        {/* ── Balance card ── */}
        <div
          className="bg-primary mb-6 flex flex-col"
          style={{
            borderRadius: 12,
            border: "1.2px solid rgba(255,255,255,0.10)",
            paddingTop: 30,
            paddingRight: 30,
            paddingBottom: 1.2,
            paddingLeft: 30,
            gap: 9.61,
            minHeight: 142.92,
          }}
        >
          {/* Top row: label + trend */}
          <div className="flex items-center justify-between">
            <p className="font-bold text-[13px] lg:text-[16.81px]" style={{ color: "#DBEAFE" }}>Solde total SNL</p>
            <div className="flex items-center gap-2 font-normal text-[13px] lg:text-[16.81px]" style={{ color: "#5EE9B5", fontWeight: 400 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 7h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +45 aujourd&apos;hui
            </div>
          </div>
          {/* Amount row */}
          <div className="flex items-center gap-3">
            <img
              src="/images/Icon.png"
              alt="SNL"
              width={36}
              height={36}
              style={{ objectFit: "contain" }}
            />
            <p className="text-white text-[26px] lg:text-[38px] font-bold leading-none">
              12,500 <span className="font-bold text-[16px] lg:text-[21.62px]" style={{ color: "#DBEAFE", fontWeight: 700 }}>SNL</span>
            </p>
          </div>
        </div>

        {/* ── 2-col: Niveau Silver + Parrainage ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

          {/* Niveau Silver card */}
          <Card>
            <div className="flex items-start gap-4 mb-5">
              <IconBox>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
                  <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconBox>
              <div>
                <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", letterSpacing: "-0.53px", color: "#0F172B" }}>Niveau Silver</h3>
                <p className="text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#45558C" }}>Progression vers Gold</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-slate-500">Progression</span>
              <span className="text-[13px] font-bold text-slate-700">65%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full mb-2">
              <div className="h-2 bg-secondary rounded-full" style={{ width: "65%" }} />
            </div>
            <p className="text-[12px] mb-5" style={{ color: "#62748E" }}>Encore 35% pour atteindre Gold</p>

            <Link
              href="/profil"
              className="block w-full text-center border border-slate-200 text-slate-700 text-[13px] lg:text-[14px] font-normal py-3 rounded-xl hover:bg-slate-50 transition"
            >
              Voir mon profil
            </Link>
          </Card>

          {/* Parrainage card */}
          <Card>
            <div className="flex items-start gap-4 mb-5">
              <IconBox>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconBox>
              <div>
                <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", letterSpacing: "-0.53px", color: "#0F172B" }}>Parrainage</h3>
                <p className="text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#45558C" }}>Invitez et progressez ensemble</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] lg:text-[14px] text-slate-500">Filleuls actifs</span>
              <span className="text-[22px] lg:text-[28px] font-bold text-slate-900">23</span>
            </div>

            {/* Info banner */}
            <div className="rounded-xl px-4 py-3 mb-4" style={{ backgroundColor: "#DDD6FF" }}>
              <p className="text-[12px] lg:text-[13px] font-bold text-[#6B3FA0] mb-0.5">
                💡 Le saviez-vous ?
              </p>
              <p className="text-[11px] lg:text-[12px]" style={{ color: "#3FAE8C" }}>
                Chaque filleul actif augmente vos gains quotidiens
              </p>
            </div>

            <Link
              href="/bonus"
              className="block w-full text-center bg-secondary text-white text-[13px] lg:text-[14px] font-normal py-3 rounded-xl hover:brightness-110 transition"
            >
              Inviter mes contacts
            </Link>
          </Card>
        </div>

        {/* ── Collecte quotidienne ── */}
        <Card className="mb-5">
          <div className="flex items-start gap-4 mb-5">
            <IconBox color="#1F4E46">
              <svg width="21.63" height="24.03" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconBox>
            <div>
              <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", letterSpacing: "-0.53px", color: "#0F172B" }}>Collecte quotidienne</h3>
              <p className="text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#45556C" }}>Votre collecte du jour est prête !</p>
            </div>
          </div>

          <Link
            href="/collecter"
            className="flex items-center justify-center w-full bg-primary text-white hover:brightness-110 transition mb-4 text-[15px] lg:text-[21.62px]"
            style={{ height: "72.06px", borderRadius: "16.81px", gap: "9.61px", boxShadow: "0 4.8px 7.21px -4.8px rgba(0,0,0,0.4)", lineHeight: "33.63px", letterSpacing: "-0.53px", fontWeight: 400 }}
          >
            <svg width="21.63" height="24.03" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Collecter mes points SNL
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <div className="flex items-center justify-center gap-2 text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#45556C" }}>
            <span className="w-4 h-4 rounded-full bg-gold/40 inline-block" />
            Série de <span className="font-bold mx-1" style={{ color: "#45556C" }}>12 jours</span>
            •&nbsp;Continuez pour débloquer des bonus !
          </div>
        </Card>

        {/* ── Classement ── */}
        <Card className="mb-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-start gap-4">
              <IconBox color="#1F4E46">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" stroke="white" strokeWidth="2"/>
                </svg>
              </IconBox>
              <div>
                <h3 className="font-bold text-[16px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", letterSpacing: "-0.53px", color: "#0F172B" }}>Classement</h3>
                <p className="text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#45556C" }}>Votre position dans la communauté</p>
              </div>
            </div>
            <Link href="/classement" className="flex items-center gap-1 hover:opacity-70 transition whitespace-nowrap text-[12px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#0F172B" }}>
              Voir le top 100
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Rank card */}
          <div className="rounded-xl px-6 py-5 flex items-center justify-between mb-4" style={{ backgroundColor: "#1F4E4626" }}>
            <div>
              <p className="mb-1 text-[12px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#64748B" }}>Votre classement actuel</p>
              <p className="font-bold leading-none text-[26px] lg:text-[36px]" style={{ color: "#1F4E46" }}>#156</p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-[12px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#94A3B8" }}>Objectif</p>
              <p className="font-bold text-[17px] lg:text-[21.62px]" style={{ lineHeight: "33.63px", letterSpacing: "-0.53px", color: "#000000" }}>Top 100</p>
            </div>
          </div>

          <p className="text-center text-[12px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400, color: "#45556C" }}>
            Collectez régulièrement et invitez votre réseau pour grimper dans le classement
          </p>
        </Card>

        {/* ── Conseil du jour ── */}
        <div className="bg-primary rounded-3xl px-8 py-7 flex items-start gap-5">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 12v10H4V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 7H2v5h20V7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2 text-[15px] lg:text-[19.22px]" style={{ lineHeight: "28.82px", letterSpacing: "-0.38px" }}>Conseil du jour</h3>
            <p className="text-white mb-4 text-[13px] lg:text-[16.81px]" style={{ lineHeight: "24.02px", letterSpacing: "-0.18px", fontWeight: 400 }}>
              La régularité est la clé ! Revenez chaque jour pour maintenir votre série et maximiser vos gains. Plus votre série
              est longue, plus vous débloquez de bonus.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Collecte quotidienne", "Parrainage actif", "Progression continue"].map((tag) => (
                <span key={tag} className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-[11px] lg:text-[14.41px]" style={{ lineHeight: "19.22px", letterSpacing: "0px", fontWeight: 400 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
}
