import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";

export const metadata = {
  title: "Utilité du token $SNL",
  description:
    "Le token SNL est la clé d'accès à l'écosystème SUNALAA. Comprenez son rôle, ses fonctions et pourquoi il est au cœur de la plateforme.",
  alternates: { canonical: "https://sunalaa.com/snl/utilite" },
  openGraph: {
    url: "https://sunalaa.com/snl/utilite",
    title: "Utilité du $SNL | SUNALAA",
    description:
      "Le SNL est la clé de l'écosystème SUNALAA. Découvrez son utilité et son rôle central dans la plateforme.",
  },
};

const utilites = [
  {
    num: "01",
    title: "Clé d'accès à l'écosystème",
    desc: "Sans $SNL, pas d'accès aux parcelles virtuelles, aux Farm Nodes, aux NFT agricoles ni aux fonctionnalités avancées. C'est le ticket d'entrée obligatoire pour participer à SUNALA.",
    example: "Tu veux acheter une parcelle virtuelle de maïs ? Tu paies en $SNL. Tu veux activer un Farm Node ? Tu paies en $SNL.",
    color: "#3FAE8C",
  },
  {
    num: "02",
    title: "Récompense de ton activité",
    desc: "Chaque action dans SUNALA te rapporte des $SNL. Connexion quotidienne, missions, développement de ta ferme virtuelle, Farm Nodes optimisés — tout est récompensé en $SNL.",
    example: "Ta parcelle de riz virtuelle génère chaque jour un rendement en $SNL selon sa performance agricole simulée.",
    color: "#E6B84C",
  },
  {
    num: "03",
    title: "Investissement dans des terres réelles",
    desc: "C'est l'utilité la plus puissante. Le $SNL est la SEULE monnaie acceptée pour acheter et investir dans les vraies terres agricoles africaines tokenisées. Virtuel vers Réel.",
    example: "Une ferme avicole au Bénin est tokenisée. Pour y investir, tu utilises des $SNL. Les bénéfices réels de la ferme te reviennent en $SNL.",
    color: "#3FAE8C",
  },
  {
    num: "04",
    title: "Carburant des améliorations",
    desc: "Améliorer ta ferme virtuelle, upgrader tes parcelles, accéder aux niveaux supérieurs — tout ça se fait en brûlant des $SNL. Ce mécanisme réduit l'offre circulante et soutient le prix.",
    example: "Passer ta parcelle de Bronze à Silver nécessite de brûler 500 $SNL. Ces tokens sont détruits définitivement — ils ne peuvent plus être vendus.",
    color: "#1F4E46",
  },
  {
    num: "05",
    title: "Pouvoir de gouvernance (DAO)",
    desc: "Les détenteurs de $SNL peuvent voter sur les décisions importantes du projet : quelle ferme partenaire intégrer, comment allouer les ressources, quelles nouvelles fonctionnalités développer.",
    example: "\"On ouvre une ferme partenaire au Sénégal ou en Côte d'Ivoire ?\" — Ce sont les holders de $SNL qui votent et décident.",
    color: "#E6B84C",
  },
  {
    num: "06",
    title: "Actif d'investissement",
    desc: "Comme toute cryptomonnaie sérieuse, le $SNL peut être acheté, vendu et échangé sur les DEX et CEX. Sa valeur augmente avec l'adoption du projet et les mécanismes de burn.",
    example: "Tu accumules des $SNL via les points pré-lancement. Au listing sur PancakeSwap, leur valeur est déterminée par le marché. Tes points deviennent un actif réel.",
    color: "#3FAE8C",
  },
];

export default function UtilitePage() {
  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* Cercles décoratifs */}
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, border: "1px solid rgba(63,174,140,0.06)", top: -200, right: -200 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, border: "1px solid rgba(63,174,140,0.08)", top: -120, right: -120 }} />
        {/* S watermark */}
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 280, opacity: 0.06, filter: "brightness(0)", left: -60, bottom: 0 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Les 6 utilités concrètes
          </span>
          <h1 className="font-black text-[34px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            Tout ce que tu peux<br />faire avec le <span style={{ color: "#3FAE8C" }}>$SNL</span>
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            Un seul token. Six façons de l&apos;utiliser.<br />Chaque utilisation crée de la valeur pour toi et pour l&apos;écosystème.
          </p>
        </div>
      </section>

      {/* ── Les 6 utilités ── */}
      <section className="relative overflow-hidden pb-24">
        {/* S watermarks */}
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", right: -40, top: 200 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 600 }} />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-6">
            {utilites.map(({ num, title, desc, example, color }) => (
              <div key={num}
                className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
                {/* Numéro filigrane */}
                <span className="absolute top-5 right-7 font-black text-[56px] leading-none select-none pointer-events-none"
                  style={{ color: "rgba(15,23,43,0.04)" }}>{num}</span>

                {/* Barre colorée */}
                <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: color }} />

                <h3 className="font-bold text-[18px] sm:text-[20px] mb-3 leading-snug" style={{ color: "#0F172B" }}>
                  {title}
                </h3>
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#45556C" }}>{desc}</p>

                <div className="rounded-xl px-4 py-3 text-[13px] leading-relaxed font-medium"
                  style={{ borderLeft: `3px solid ${color}`, backgroundColor: "rgba(31,78,70,0.04)", color: "#1F4E46" }}>
                  {example}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-14">
            <Link
              href="/snl/usage"
              className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}
            >
              Voir des exemples concrets
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
