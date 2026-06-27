import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";

export const metadata = {
  title: "À propos — SUNALA",
  description: "L'histoire, la mission et les valeurs derrière SUNALA — un pont concret entre la blockchain et l'agriculture africaine.",
};

const values = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="2"/>
        <path d="M9 12l2 2 4-4" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Authenticité",
    desc: "Un ancrage réel, pas de la spéculation pure.",
    bg: "rgba(63,174,140,0.08)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="#E6B84C" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Communauté",
    desc: "Des partenaires, pas de simples utilisateurs.",
    bg: "rgba(230,184,76,0.08)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="#3B82F6" strokeWidth="2"/>
      </svg>
    ),
    title: "Transparence",
    desc: "Données vérifiables sur la blockchain.",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="#22C55E" strokeWidth="2"/>
        <path d="M12 8v4l3 3" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Impact réel",
    desc: "Chaque token $SNL soutient une vraie ferme.",
    bg: "rgba(34,197,94,0.08)",
  },
];

const missionItems = [
  "Chaque utilisateur, où qu'il soit dans le monde, peut participer à l'économie agricole africaine.",
  "Chaque parcelle virtuelle développée sur SUNALA est connectée à un projet agricole réel.",
  "Chaque token $SNL accumulé représente une valeur ancrée dans une production concrète.",
  "Chaque agriculteur partenaire accède à un financement qu'il n'aurait jamais pu obtenir autrement.",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden" style={{ minHeight: 400 }}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
          {[640, 480, 340, 210].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/5"
              style={{ width: s, height: s }} />
          ))}
        </div>
        <div className="absolute pointer-events-none" style={{ right: -80, top: "20%" }}>
          {[300, 200, 120].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/5"
              style={{ width: s, height: s, right: -s / 2, top: -s / 2 }} />
          ))}
        </div>
        <Container className="relative z-10 py-20 flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}>
            À propos de SUNALA
          </span>
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(28px,5vw,50px)", maxWidth: 620 }}>
            Un pont concret entre la blockchain et l&apos;agriculture africaine
          </h1>
          <p className="text-white/60 text-[16px] leading-relaxed" style={{ maxWidth: 540 }}>
            L&apos;histoire derrière SUNALA, notre mission, et les valeurs qui nous guident chaque jour.
          </p>
        </Container>
      </section>

      {/* ── Histoire ── */}
      <section className="bg-white py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              L&apos;histoire derrière SUNALA
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              Un constat simple et frustrant
            </h2>
            <div className="flex flex-col gap-5 text-[15px] leading-relaxed" style={{ color: "#45556C" }}>
              <p>
                L&apos;Afrique possède plus de <strong style={{ color: "#0F172B" }}>60% des terres arables non exploitées de la planète</strong>, et pourtant ses agriculteurs restent parmi les moins financés au monde.
              </p>
              <p>
                Pendant que la finance mondiale se digitalise à toute vitesse, des millions de producteurs africains continuent de travailler sans accès au crédit, sans visibilité internationale, et sans les outils numériques qui pourraient transformer leur activité.
              </p>
              <p className="font-semibold" style={{ color: "#1F4E46" }}>
                SUNALA est notre réponse à ce constat : un pont concret entre la blockchain et l&apos;agriculture réelle africaine.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Mission ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              Notre mission
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              Nous construisons un écosystème complet où :
            </h2>
            <div className="flex flex-col gap-4">
              {missionItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(63,174,140,0.1)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-[14px] leading-relaxed pt-0.5" style={{ color: "#334155" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Fondateur ── */}
      <section className="bg-white py-16 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>
              Notre fondateur
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold mb-8 leading-tight" style={{ color: "#0F172B" }}>
              Une vision née du terrain
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Avatar anonyme */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #1F4E46, #3FAE8C)" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="text-[12px] font-semibold text-center" style={{ color: "#64748B" }}>Le Fondateur</span>
                <span className="text-[11px]" style={{ color: "#94A3B8" }}>Entrepreneur béninois</span>
              </div>
              <div className="flex flex-col gap-4 text-[15px] leading-relaxed" style={{ color: "#45556C" }}>
                <p>
                  SUNALA a été fondé par un entrepreneur béninois convaincu que la technologie blockchain peut devenir un <strong style={{ color: "#0F172B" }}>outil concret d&apos;émancipation économique pour l&apos;Afrique</strong> — pas seulement un instrument de spéculation.
                </p>
                <p>
                  Fort d&apos;une connaissance directe des réalités du terrain agricole en Afrique de l&apos;Ouest, il a conçu SUNALA comme un projet pensé <strong style={{ color: "#1F4E46" }}>PAR l&apos;Afrique, POUR le monde</strong> — et non l&apos;inverse.
                </p>
              </div>
            </div>

            {/* Citation */}
            <blockquote className="mt-10 rounded-2xl px-7 py-6 relative overflow-hidden"
              style={{ backgroundColor: "#1F4E46" }}>
              <div className="absolute top-4 left-5 text-white/10 font-serif" style={{ fontSize: 80, lineHeight: 1 }}>&ldquo;</div>
              <p className="relative z-10 text-white text-[16px] sm:text-[18px] font-medium leading-relaxed italic text-center">
                Nous ne construisons pas juste une cryptomonnaie. Nous construisons un pont entre deux mondes qui ont besoin l&apos;un de l&apos;autre.
              </p>
              <p className="relative z-10 text-white/50 text-[13px] text-center mt-4">— Le Fondateur de SUNALA</p>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* ── Valeurs ── */}
      <section className="bg-[#F8FAFC] py-16 border-b border-slate-100">
        <Container>
          <div className="text-center mb-10">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-3" style={{ color: "#3FAE8C" }}>Ce qui nous guide</p>
            <h2 className="text-[26px] sm:text-[32px] font-bold" style={{ color: "#0F172B" }}>Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: v.bg }}>
                  {v.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold mb-1.5" style={{ color: "#0F172B" }}>{v.title}</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#64748B" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-16">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-white font-bold text-[26px] sm:text-[32px]">Prêt à rejoindre l&apos;aventure ?</h2>
          <p className="text-white/60 text-[15px]" style={{ maxWidth: 460 }}>
            Rejoignez des milliers de membres qui accumulent des points SNL chaque jour et préparent l&apos;avenir de l&apos;agriculture africaine.
          </p>
          <a
            href="/register"
            className="px-8 py-3.5 rounded-full text-white font-semibold text-[15px] hover:brightness-110 transition"
            style={{ backgroundColor: "#E6B84C" }}
          >
            Commencer gratuitement
          </a>
        </Container>
      </section>

      <Footer />
    </>
  );
}
