import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";

export const metadata = {
  title: "À quoi sert le $SNL ?",
  description:
    "Découvrez tous les usages concrets du token SNL sur SUNALAA : paiements, accès aux formations, récompenses de parrainage et bien plus.",
  alternates: { canonical: "https://sunalaa.com/snl/usage" },
  openGraph: {
    url: "https://sunalaa.com/snl/usage",
    title: "Usages du $SNL | SUNALAA",
    description:
      "À quoi sert le SNL ? Paiements, formations, parrainage — tous les cas d'usage du token SUNALAA.",
  },
};

export default function UsagePage() {
  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, border: "1px solid rgba(31,78,70,0.06)", top: -150, right: -150 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 300, opacity: 0.06, filter: "brightness(0)", left: -60, top: 0 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Scénarios réels
          </span>
          <h1 className="font-black text-[34px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            Voilà à quoi ressemble<br /><span style={{ color: "#3FAE8C" }}>SUNALA</span> en pratique
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            Des cas concrets de membres qui accumulent des $SNL — et ce qu&apos;ils en font.
          </p>
        </div>
      </section>

      {/* ── Scénarios ── */}
      <section className="relative overflow-hidden pb-24">
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", right: -40, top: 100 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 500 }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col gap-10">

          {/* Scénario 1 — Amadou */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#3FAE8C" }} />
            <h2 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              Amadou se connecte chaque matin depuis son téléphone au Bénin
            </h2>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              Amadou passe 30 secondes sur SUNALA chaque matin pour réclamer ses points. Il a aussi invité <strong style={{ color: "#1F4E46" }}>5 partenaires actifs</strong> dans son réseau. En 6 mois de régularité, il accumule près de <strong style={{ color: "#1F4E46" }}>21 000 points</strong>. Au lancement, il reçoit <strong style={{ color: "#1F4E46" }}>21 $SNL</strong> sans avoir dépensé un franc. Il les conserve ou les vend selon le prix du marché.
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#3FAE8C" }}>Résultat après 6 mois</p>
              {[
                { label: "Connexions quotidiennes", value: "9 000 pts" },
                { label: "Streaks & bonus", value: "2 500 pts" },
                { label: "Missions accomplies", value: "3 000 pts" },
                { label: "5 partenaires actifs", value: "6 250 pts" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#3FAE8C" }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3">
                <span className="text-[14px] font-bold" style={{ color: "#0F172B" }}>TOTAL</span>
                <span className="text-[15px] font-black" style={{ color: "#1F4E46" }}>~21 $SNL</span>
              </div>
            </div>
          </div>

          {/* Scénario 2 — Marie */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#E6B84C" }} />
            <h2 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              Marie s&apos;inscrit aujourd&apos;hui parmi les premiers 1 000 membres
            </h2>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              Marie s&apos;inscrit en ce moment, quand la communauté est encore petite. Elle accumule des points pendant 12 mois avant le lancement. Au lancement du token, elle a <strong style={{ color: "#1F4E46" }}>45 000 points</strong> soit <strong style={{ color: "#1F4E46" }}>45 $SNL</strong>. Le prix du $SNL au listing est de <strong style={{ color: "#1F4E46" }}>$0.10</strong> — ses 45 $SNL valent $4.50. Si le prix monte à $1 (objectif réaliste selon la roadmap), ses 45 $SNL valent <strong style={{ color: "#1F4E46" }}>$45</strong>. Un investissement en temps, pas en argent.
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#E6B84C" }}>Projection early adopter</p>
              {[
                { label: "Points après 12 mois", value: "45 000 pts" },
                { label: "$SNL au lancement", value: "45 $SNL" },
                { label: "Valeur à $0.10 / $SNL", value: "$4.50" },
                { label: "Valeur à $0.50 / $SNL", value: "$22.50" },
                { label: "Valeur à $1.00 / $SNL", value: "$45.00" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#E6B84C" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scénario 3 — Kofi */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <span className="text-[10px] font-bold tracking-widest uppercase block mb-2" style={{ color: "#1F4E46" }}>
              L&apos;agriculteur africain
            </span>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#1F4E46" }} />
            <h2 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              Kofi possède une ferme avicole au Ghana et la tokenise sur SUNALA
            </h2>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              Kofi s&apos;inscrit sur SUNALA en tant que partenaire agricole. Sa ferme de <strong style={{ color: "#1F4E46" }}>500 poulets</strong> est tokenisée — sa valeur est représentée en $SNL. Des investisseurs du monde entier peuvent désormais acheter des parts de sa ferme avec des $SNL. Kofi reçoit un financement immédiat. Les investisseurs reçoivent une part des bénéfices à chaque cycle de vente.
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#1F4E46" }}>Tokenisation d&apos;une ferme avicole</p>
              {[
                { label: "Valeur ferme tokenisée", value: "5 000 $SNL" },
                { label: "Financement reçu par Kofi", value: "Immédiat" },
                { label: "Investisseurs participants", value: "Monde entier" },
                { label: "Distribution bénéfices", value: "Automatique" },
                { label: "Traçabilité", value: "100% blockchain" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#1F4E46" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-center mt-14">
          <Link
            href="/snl/valeur"
            className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            Comprendre pourquoi le $SNL a de la valeur
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
