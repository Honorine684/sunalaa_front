import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";
import SnlFaqAccordion from "@/components/SnlFaqAccordion";

export const metadata = { title: "Pourquoi le $SNL a de la valeur — SUNALA" };

export default function ValeurPage() {
  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, border: "1px solid rgba(31,78,70,0.05)", top: -200, left: -200 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 380, height: 380, border: "1px solid rgba(63,174,140,0.07)", top: -120, left: -120 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 300, opacity: 0.06, filter: "brightness(0)", right: -60, top: 0 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Tokenomics
          </span>
          <h1 className="font-black text-[34px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            Pourquoi la valeur du <span style={{ color: "#3FAE8C" }}>$SNL</span><br />augmente avec le temps
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            Ce n&apos;est pas de la magie. C&apos;est de l&apos;économie. Voilà les mécanismes qui soutiennent la valeur du $SNL structurellement.
          </p>
        </div>
      </section>

      {/* ── Mécanismes ── */}
      <section className="relative overflow-hidden pb-20">
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 100 }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-5 mb-12">
            {[
              {
                title: "Buyback & Burn",
                desc: "Une partie des revenus réels générés par les fermes partenaires est utilisée pour racheter des $SNL sur le marché et les détruire. Moins de tokens en circulation = chaque token restant vaut plus.",
                color: "#3FAE8C",
              },
              {
                title: "Burn par les upgrades",
                desc: "Améliorer ses parcelles et Farm Nodes nécessite de brûler des $SNL. Plus la plateforme est utilisée, plus de tokens sont détruits automatiquement. L'activité réduit l'offre.",
                color: "#1F4E46",
              },
              {
                title: "Supply plafonnée",
                desc: "1 milliard de $SNL maximum. Pas un de plus. Jamais. Avec une demande croissante et une offre fixe (qui diminue avec les burns), la pression sur le prix ne peut qu'augmenter.",
                color: "#E6B84C",
              },
              {
                title: "Valeur agricole réelle",
                desc: "Le $SNL n'est pas qu'un token spéculatif. Il est adossé à des actifs réels — des terres, des récoltes, du bétail. La valeur de ces actifs africains est bien réelle et croissante.",
                color: "#3FAE8C",
              },
            ].map(({ title, desc, color }) => (
              <div key={title} className="rounded-2xl p-6 flex gap-5 items-start"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
                <div className="shrink-0 mt-1 w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <div>
                  <h3 className="font-bold text-[16px] mb-2" style={{ color: "#0F172B" }}>{title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Supply totale */}
          <div className="rounded-3xl p-7 sm:p-9 text-center mb-20 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <img src="/images/Group.png" alt="" aria-hidden="true"
              className="absolute select-none pointer-events-none"
              style={{ width: 180, opacity: 0.05, filter: "brightness(0)", right: -20, bottom: -20 }} />
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#E6B84C" }}>
              Supply totale $SNL — Plafond absolu
            </p>
            <p className="font-black text-[34px] sm:text-[48px] leading-none mb-2 tracking-wide" style={{ color: "#0F172B" }}>
              1 000 000 000
            </p>
            <p className="text-[13px] mb-7" style={{ color: "#94A3B8" }}>
              Tokens $SNL — Jamais plus. Jamais.
            </p>
            <div className="relative h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "rgba(31,78,70,0.10)" }}>
              <div className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: "65%", background: "linear-gradient(to right, #3FAE8C, #E6B84C)" }} />
            </div>
            <div className="flex justify-between items-start text-[11px]" style={{ color: "#94A3B8" }}>
              <span>0 $SNL</span>
              <span className="text-center" style={{ color: "#E6B84C" }}>Les burns réduisent progressivement l&apos;offre circulante</span>
              <span>1 000 000 000</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Le parcours complet ── */}
      <section className="relative overflow-hidden pb-24" style={{ backgroundColor: "#F8FAFC" }}>
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 280, opacity: 0.06, filter: "brightness(0)", right: -40, top: 60 }} />

        <div className="max-w-3xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-widest uppercase block mb-3" style={{ color: "#E6B84C" }}>
              Le parcours complet
            </span>
            <h2 className="font-black text-[26px] sm:text-[38px] leading-tight" style={{ color: "#0F172B" }}>
              De tes premiers points<br />à tes premiers $SNL
            </h2>
            <p className="text-[14px] mt-4" style={{ color: "#45556C" }}>
              Voilà exactement comment tu passes des points gratuits d&apos;aujourd&apos;hui à un vrai actif crypto demain.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-9.75 top-10 bottom-10 w-0.5" style={{ backgroundColor: "rgba(31,78,70,0.12)" }} />

            {[
              {
                num: "01", color: "#3FAE8C",
                label: "Maintenant — Phase pré-lancement",
                title: "Tu accumules des points SUNALA",
                desc: "Connexion quotidienne, missions, partenaires — chaque action te donne des points. Ces points ne sont pas encore des $SNL mais ils représentent ta future allocation au lancement.",
                badge: "C'est la phase où tu es actuellement",
                badgeBg: "rgba(63,174,140,0.08)",
              },
              {
                num: "02", color: "#E6B84C",
                label: "Q2 2026 — Lancement du token",
                title: "Tes points se convertissent en $SNL",
                desc: "Au lancement officiel du token, chaque point que tu as accumulé se convertit automatiquement en $SNL réel. Le taux est fixe : 1 000 points = 1 $SNL. Sans rien payer de plus.",
                badge: "Taux garanti : 1 000 pts = 1 $SNL",
                badgeBg: "rgba(230,184,76,0.08)",
              },
              {
                num: "03", color: "#38BDF8",
                label: "Q3 2026 — Listing DEX",
                title: "Le $SNL devient échangeable",
                desc: "SUNALA est listé sur PancakeSwap et d'autres DEX. Ton $SNL a maintenant une valeur en dollars. Tu peux le garder, le vendre, ou l'utiliser dans l'écosystème SUNALA.",
                badge: "Tu peux garder, vendre ou investir",
                badgeBg: "rgba(56,189,248,0.08)",
              },
              {
                num: "04", color: "#8B5CF6",
                label: "2027 — Le monde réel",
                title: "Tes $SNL investissent dans de vraies terres",
                desc: "Des fermes partenaires réelles en Afrique sont tokenisées. Tu utilises tes $SNL pour investir directement. Les bénéfices agricoles réels te reviennent proportionnellement.",
                badge: "Ton token, des actifs agricoles africains réels",
                badgeBg: "rgba(139,92,246,0.08)",
              },
            ].map(({ num, color, label, title, desc, badge, badgeBg }, i, arr) => (
              <div key={num} className={`relative flex gap-6 ${i < arr.length - 1 ? "pb-12" : ""}`}>
                <div className="shrink-0 w-20 flex flex-col items-center">
                  <div className="w-13 h-13 rounded-full border-2 flex items-center justify-center font-black text-[17px] z-10 bg-white"
                    style={{ borderColor: color, color }}>
                    {num}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase block mb-2" style={{ color }}>
                    {label}
                  </span>
                  <h3 className="font-black text-[18px] sm:text-[22px] leading-tight mb-3" style={{ color: "#0F172B" }}>
                    {title}
                  </h3>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "#45556C" }}>{desc}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold"
                    style={{ backgroundColor: badgeBg, color }}>
                    {badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold tracking-widest uppercase block mb-3" style={{ color: "#3FAE8C" }}>
            Questions fréquentes
          </span>
          <h2 className="font-black text-[26px] sm:text-[38px] leading-tight" style={{ color: "#0F172B" }}>
            Tout ce que tu te demandes<br />sur le $SNL
          </h2>
        </div>
        <SnlFaqAccordion light />
      </section>

      {/* ── CTA final ── */}
      <section className="relative overflow-hidden pb-24" style={{ backgroundColor: "#1F4E46" }}>
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 300, opacity: 0.08, filter: "brightness(10)", right: -60, bottom: 0 }} />
        <div className="max-w-xl mx-auto px-6 pt-20 pb-4 text-center relative z-10">
          <h2 className="font-black text-[30px] sm:text-[42px] leading-tight mb-6 text-white">
            Tu comprends maintenant<br />
            <span style={{ color: "#3FAE8C" }}>pourquoi le $SNL</span><br />
            <em className="not-italic" style={{ color: "#E6B84C" }}>a de la valeur.</em>
          </h2>
          <p className="text-[15px] leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            Les points s&apos;accumulent gratuitement. Le lancement approche. Les premiers membres seront toujours en avance sur les autres.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 font-bold text-[15px] text-white w-full py-4 rounded-2xl hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}
            >
              Commencer à accumuler — Gratuit
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 font-semibold text-[14px] text-white w-full py-4 rounded-2xl transition hover:bg-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
