import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";
import SnlFaqAccordion from "@/components/SnlFaqAccordion";

export const metadata = { title: "Comprendre le $SNL — SUNALA" };

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

const navItems = [
  { href: "#comprendre", label: "C'est quoi ?" },
  { href: "#utilites", label: "Les utilités" },
  { href: "#usage", label: "Exemples" },
  { href: "#valeur", label: "La valeur" },
];

export default function SnlPage() {
  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Navigation sections ── */}
      <nav
        className="sticky top-17 z-40 bg-white overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(31,78,70,0.08)" }}
      >
        <div className="flex items-center px-4 py-2 gap-1 w-max min-w-full sm:w-auto sm:min-w-0 max-w-3xl mx-auto sm:justify-center">
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all hover:text-secondary"
              style={{ color: "#45556C" }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          SECTION 1 — C'est quoi ?
      ══════════════════════════════════════════ */}
      <section id="comprendre" className="relative overflow-hidden pt-16 pb-16 scroll-mt-28">
        {/* Décors */}
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 320, opacity: 0.07, filter: "brightness(0)", right: -60, top: 0 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, border: "1px solid rgba(31,78,70,0.06)", top: -150, left: -150 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 300, height: 300, border: "1px solid rgba(63,174,140,0.08)", top: -80, left: -80 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Le token $SNL expliqué simplement
          </span>
          <h1 className="font-black text-[36px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            À quoi sert<br />
            <span style={{ color: "#3FAE8C" }}>concrètement</span>
            <br />le $SNL ?
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto" style={{ color: "#45556C" }}>
            Le $SNL n&apos;est pas juste une cryptomonnaie de plus.<br />
            C&apos;est <strong style={{ color: "#1F4E46" }}>la clé d&apos;entrée d&apos;un écosystème agricole réel</strong> — qui lie l&apos;Afrique au monde entier à travers la blockchain.
          </p>
        </div>
      </section>

      {/* En résumé */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden"
          style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
          <img src="/images/Group.png" alt="" aria-hidden="true"
            className="absolute select-none pointer-events-none"
            style={{ width: 200, opacity: 0.05, filter: "brightness(0)", right: -20, bottom: -20 }} />
          <span className="text-[11px] font-bold tracking-widest uppercase block mb-4" style={{ color: "#E6B84C" }}>En résumé</span>
          <h2 className="font-black text-[24px] sm:text-[32px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            Le $SNL, c&apos;est quoi exactement ?
          </h2>
          <div className="flex flex-col gap-5 text-[14px] sm:text-[15px] leading-relaxed" style={{ color: "#45556C" }}>
            <p>
              Le token $SNL (SUNALA Token) est une <strong style={{ color: "#1F4E46" }}>cryptomonnaie utilitaire</strong> déployée sur la blockchain BNB Chain. Contrairement aux memecoins sans valeur réelle, le $SNL est directement lié à des actifs agricoles physiques en Afrique.
            </p>
            <p>
              Pense à lui comme à <strong style={{ color: "#1F4E46" }}>une monnaie interne à un écosystème entier</strong> — comme les V-Bucks dans Fortnite, mais avec une valeur ancrée dans le monde réel. Sauf que là, au lieu d&apos;acheter des skins, tu investis dans de vraies fermes africaines.
            </p>
            <p>
              <strong style={{ color: "#1F4E46" }}>Supply plafonnée à 1 milliard.</strong> Pas un token de plus ne sera créé après. La rareté est mathématiquement garantie.
            </p>
          </div>
        </div>
      </section>

      {/* 3 grandes utilités */}
      <section className="relative overflow-hidden pb-20">
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 280, opacity: 0.06, filter: "brightness(0)", left: -60, top: 40 }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-black text-[24px] sm:text-[36px] leading-tight" style={{ color: "#0F172B" }}>
              3 raisons pour lesquelles<br />le $SNL a de la valeur
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { num: "01", title: "Clé d'accès", desc: "Sans $SNL, pas d'accès aux parcelles, Farm Nodes ou NFT agricoles. C'est le ticket d'entrée obligatoire.", color: "#3FAE8C" },
              { num: "02", title: "Récompense", desc: "Chaque connexion, mission et parrainage te rapporte des $SNL. L'activité est directement rémunérée.", color: "#E6B84C" },
              { num: "03", title: "Investissement réel", desc: "Le $SNL est la seule monnaie acceptée pour investir dans les vraies terres agricoles africaines tokenisées.", color: "#1F4E46" },
            ].map(({ num, title, desc, color }) => (
              <div key={num} className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
                <div className="font-black text-[40px] leading-none mb-3 select-none" style={{ color, opacity: 0.30 }}>{num}</div>
                <h3 className="font-bold text-[16px] mb-2" style={{ color: "#0F172B" }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <a href="#utilites"
              className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}>
              Voir toutes les utilités du $SNL
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — Les utilités
      ══════════════════════════════════════════ */}
      <section id="utilites" className="relative overflow-hidden pt-16 pb-6 scroll-mt-28" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, border: "1px solid rgba(63,174,140,0.06)", top: -200, right: -200 }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Les 6 utilités concrètes
          </span>
          <h2 className="font-black text-[30px] sm:text-[46px] leading-tight mb-4" style={{ color: "#0F172B" }}>
            Tout ce que tu peux<br />faire avec le <span style={{ color: "#3FAE8C" }}>$SNL</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            Un seul token. Six façons de l&apos;utiliser.<br />Chaque utilisation crée de la valeur pour toi et pour l&apos;écosystème.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden pb-20" style={{ backgroundColor: "#F8FAFC" }}>
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", right: -40, top: 100 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 500 }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-6">
            {utilites.map(({ num, title, desc, example, color }) => (
              <div key={num} className="rounded-3xl p-7 sm:p-9 relative overflow-hidden bg-white"
                style={{ border: "1px solid rgba(31,78,70,0.08)" }}>
                <span className="absolute top-5 right-7 font-black text-[56px] leading-none select-none pointer-events-none"
                  style={{ color: "rgba(15,23,43,0.04)" }}>{num}</span>
                <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: color }} />
                <h3 className="font-bold text-[18px] sm:text-[20px] mb-3 leading-snug" style={{ color: "#0F172B" }}>{title}</h3>
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#45556C" }}>{desc}</p>
                <div className="rounded-xl px-4 py-3 text-[13px] leading-relaxed font-medium"
                  style={{ borderLeft: `3px solid ${color}`, backgroundColor: "rgba(31,78,70,0.04)", color: "#1F4E46" }}>
                  {example}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-14">
            <a href="#usage"
              className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}>
              Voir des exemples concrets
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — Exemples concrets
      ══════════════════════════════════════════ */}
      <section id="usage" className="relative overflow-hidden pt-16 pb-6 scroll-mt-28">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Scénarios réels
          </span>
          <h2 className="font-black text-[30px] sm:text-[46px] leading-tight mb-4" style={{ color: "#0F172B" }}>
            Voilà à quoi ressemble<br /><span style={{ color: "#3FAE8C" }}>SUNALA</span> en pratique
          </h2>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            Des cas concrets de membres qui accumulent des $SNL — et ce qu&apos;ils en font.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden pb-20">
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
            <h3 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              Amadou se connecte chaque matin depuis son téléphone au Bénin
            </h3>
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
            <h3 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              Marie s&apos;inscrit aujourd&apos;hui parmi les premiers 1 000 membres
            </h3>
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
            <h3 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              Kofi possède une ferme avicole au Ghana et la tokenise sur SUNALA
            </h3>
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
          <a href="#valeur"
            className="inline-flex items-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
            style={{ backgroundColor: "#3FAE8C" }}>
            Comprendre pourquoi le $SNL a de la valeur
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — La valeur
      ══════════════════════════════════════════ */}
      <section id="valeur" className="relative overflow-hidden pt-16 pb-6 scroll-mt-28" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, border: "1px solid rgba(31,78,70,0.05)", top: -200, left: -200 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 380, height: 380, border: "1px solid rgba(63,174,140,0.07)", top: -120, left: -120 }} />
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 300, opacity: 0.06, filter: "brightness(0)", right: -60, top: 0 }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Tokenomics
          </span>
          <h2 className="font-black text-[30px] sm:text-[46px] leading-tight mb-4" style={{ color: "#0F172B" }}>
            Pourquoi la valeur du <span style={{ color: "#3FAE8C" }}>$SNL</span><br />augmente avec le temps
          </h2>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            Ce n&apos;est pas de la magie. C&apos;est de l&apos;économie. Voilà les mécanismes qui soutiennent la valeur du $SNL structurellement.
          </p>
        </div>
      </section>

      {/* Mécanismes */}
      <section className="relative overflow-hidden pb-20" style={{ backgroundColor: "#F8FAFC" }}>
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 260, opacity: 0.05, filter: "brightness(0)", left: -40, top: 100 }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-5 mb-12">
            {[
              { title: "Buyback & Burn", desc: "Une partie des revenus réels générés par les fermes partenaires est utilisée pour racheter des $SNL sur le marché et les détruire. Moins de tokens en circulation = chaque token restant vaut plus.", color: "#3FAE8C" },
              { title: "Burn par les upgrades", desc: "Améliorer ses parcelles et Farm Nodes nécessite de brûler des $SNL. Plus la plateforme est utilisée, plus de tokens sont détruits automatiquement. L'activité réduit l'offre.", color: "#1F4E46" },
              { title: "Supply plafonnée", desc: "1 milliard de $SNL maximum. Pas un de plus. Jamais. Avec une demande croissante et une offre fixe (qui diminue avec les burns), la pression sur le prix ne peut qu'augmenter.", color: "#E6B84C" },
              { title: "Valeur agricole réelle", desc: "Le $SNL n'est pas qu'un token spéculatif. Il est adossé à des actifs réels — des terres, des récoltes, du bétail. La valeur de ces actifs africains est bien réelle et croissante.", color: "#3FAE8C" },
            ].map(({ title, desc, color }) => (
              <div key={title} className="rounded-2xl p-6 flex gap-5 items-start bg-white"
                style={{ border: "1px solid rgba(31,78,70,0.08)" }}>
                <div className="shrink-0 mt-1 w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <div>
                  <h3 className="font-bold text-[16px] mb-2" style={{ color: "#0F172B" }}>{title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Supply totale */}
          <div className="rounded-3xl p-7 sm:p-9 text-center mb-16 relative overflow-hidden bg-white"
            style={{ border: "1px solid rgba(31,78,70,0.08)" }}>
            <img src="/images/Group.png" alt="" aria-hidden="true"
              className="absolute select-none pointer-events-none"
              style={{ width: 180, opacity: 0.05, filter: "brightness(0)", right: -20, bottom: -20 }} />
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#E6B84C" }}>
              Supply totale $SNL — Plafond absolu
            </p>
            <p className="font-black text-[34px] sm:text-[48px] leading-none mb-2 tracking-wide" style={{ color: "#0F172B" }}>
              1 000 000 000
            </p>
            <p className="text-[13px] mb-7" style={{ color: "#94A3B8" }}>Tokens $SNL — Jamais plus. Jamais.</p>
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

      {/* Timeline */}
      <section className="relative overflow-hidden pb-24" style={{ backgroundColor: "#F8FAFC" }}>
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 280, opacity: 0.06, filter: "brightness(0)", right: -40, top: 60 }} />
        <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
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
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-9.75 top-10 bottom-10 w-0.5" style={{ backgroundColor: "rgba(31,78,70,0.12)" }} />
            {[
              { num: "01", color: "#3FAE8C", label: "Maintenant — Phase pré-lancement", title: "Tu accumules des points SUNALA", desc: "Connexion quotidienne, missions, partenaires — chaque action te donne des points. Ces points ne sont pas encore des $SNL mais ils représentent ta future allocation au lancement.", badge: "C'est la phase où tu es actuellement", badgeBg: "rgba(63,174,140,0.08)" },
              { num: "02", color: "#E6B84C", label: "Q2 2026 — Lancement du token", title: "Tes points se convertissent en $SNL", desc: "Au lancement officiel du token, chaque point que tu as accumulé se convertit automatiquement en $SNL réel. Le taux est fixe : 1 000 points = 1 $SNL. Sans rien payer de plus.", badge: "Taux garanti : 1 000 pts = 1 $SNL", badgeBg: "rgba(230,184,76,0.08)" },
              { num: "03", color: "#38BDF8", label: "Q3 2026 — Listing DEX", title: "Le $SNL devient échangeable", desc: "SUNALA est listé sur PancakeSwap et d'autres DEX. Ton $SNL a maintenant une valeur en dollars. Tu peux le garder, le vendre, ou l'utiliser dans l'écosystème SUNALA.", badge: "Tu peux garder, vendre ou investir", badgeBg: "rgba(56,189,248,0.08)" },
              { num: "04", color: "#8B5CF6", label: "2027 — Le monde réel", title: "Tes $SNL investissent dans de vraies terres", desc: "Des fermes partenaires réelles en Afrique sont tokenisées. Tu utilises tes $SNL pour investir directement. Les bénéfices agricoles réels te reviennent proportionnellement.", badge: "Ton token, des actifs agricoles africains réels", badgeBg: "rgba(139,92,246,0.08)" },
            ].map(({ num, color, label, title, desc, badge, badgeBg }, i, arr) => (
              <div key={num} className={`relative flex gap-6 ${i < arr.length - 1 ? "pb-12" : ""}`}>
                <div className="shrink-0 w-20 flex flex-col items-center">
                  <div className="w-13 h-13 rounded-full border-2 flex items-center justify-center font-black text-[17px] z-10 bg-white"
                    style={{ borderColor: color, color }}>
                    {num}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <span className="text-[10px] font-bold tracking-widest uppercase block mb-2" style={{ color }}>{label}</span>
                  <h3 className="font-black text-[18px] sm:text-[22px] leading-tight mb-3" style={{ color: "#0F172B" }}>{title}</h3>
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

      {/* FAQ */}
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

      {/* CTA final */}
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
            <Link href="/register"
              className="flex items-center justify-center gap-2 font-bold text-[15px] text-white w-full py-4 rounded-2xl hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}>
              Commencer à accumuler — Gratuit
            </Link>
            <Link href="/"
              className="flex items-center justify-center gap-2 font-semibold text-[14px] text-white w-full py-4 rounded-2xl transition hover:bg-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
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
