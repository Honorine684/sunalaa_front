import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";

export const metadata = { title: "Comprendre le $SNL — SUNALA" };

export default function SnlPage() {
  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16">
        {/* S watermark */}
        <img src="/images/Group.png" alt="" aria-hidden="true"
          className="absolute select-none pointer-events-none hidden lg:block"
          style={{ width: 320, opacity: 0.07, filter: "brightness(0)", right: -60, top: 0 }} />
        {/* Cercle décoratif */}
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 500, height: 500, border: "1px solid rgba(31,78,70,0.06)", top: -150, left: -150 }} />
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 300, height: 300, border: "1px solid rgba(63,174,140,0.08)", top: -80, left: -80 }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Le token $SNL expliqué simplement
          </span>
          <h1 className="font-black text-[36px] sm:text-[56px] leading-tight mb-6" style={{ color: "#0F172B" }}>
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

      {/* ── En résumé ── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden" style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
          {/* S watermark inside card */}
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

      {/* ── Aperçu des 3 grandes utilités ── */}
      <section className="relative overflow-hidden pb-24">
        {/* S watermark */}
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
              {
                num: "01",
                title: "Clé d'accès",
                desc: "Sans $SNL, pas d'accès aux parcelles, Farm Nodes ou NFT agricoles. C'est le ticket d'entrée obligatoire.",
                color: "#3FAE8C",
              },
              {
                num: "02",
                title: "Récompense",
                desc: "Chaque connexion, mission et parrainage te rapporte des $SNL. L'activité est directement rémunérée.",
                color: "#E6B84C",
              },
              {
                num: "03",
                title: "Investissement réel",
                desc: "Le $SNL est la seule monnaie acceptée pour investir dans les vraies terres agricoles africaines tokenisées.",
                color: "#1F4E46",
              },
            ].map(({ num, title, desc, color }) => (
              <div key={num} className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
                <div className="font-black text-[40px] leading-none mb-3 select-none" style={{ color, opacity: 0.30 }}>{num}</div>
                <h3 className="font-bold text-[16px] mb-2" style={{ color: "#0F172B" }}>{title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/snl/utilite"
              className="inline-flex items-center justify-center gap-2 font-bold text-[14px] text-white px-8 py-4 rounded-full hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}
            >
              Voir toutes les utilités du $SNL
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 font-semibold text-[14px] px-8 py-4 rounded-full transition border border-primary text-primary hover:bg-primary hover:text-white active:text-white group"
            >
              Commencer à accumuler
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
