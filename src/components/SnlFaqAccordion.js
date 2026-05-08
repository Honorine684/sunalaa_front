"use client";
import { useState } from "react";

const faqs = [
  {
    q: "Est-ce que je peux perdre de l'argent avec SUNALA ?",
    a: "En phase de pré-lancement : non. L'accumulation de points est entièrement gratuite. Tu n'investis pas d'argent — juste du temps. Après le lancement, comme toute cryptomonnaie, la valeur du $SNL peut fluctuer. Mais comme les points sont gratuits, tu ne risques rien avant le lancement.",
  },
  {
    q: "Quelle est la différence entre les points et les $SNL ?",
    a: "Les points sont des unités de crédit que tu accumules en phase pré-lancement. Au lancement officiel du token en Q2 2026, ils se convertissent automatiquement en $SNL réels au taux fixe de 1 000 points = 1 $SNL. Avant le lancement, les points n'ont pas de valeur monétaire — ils représentent ta future allocation.",
  },
  {
    q: "Pourquoi le $SNL vaut-il plus qu'un simple memecoin ?",
    a: "Contrairement aux memecoins sans utilité, le $SNL est adossé à des actifs agricoles réels en Afrique. Il sert de monnaie unique dans l'écosystème SUNALA, est brûlé lors des upgrades (réduisant l'offre), et est gouverné par la communauté via le DAO. Sa supply est plafonnée à 1 milliard et diminue structurellement avec le temps.",
  },
  {
    q: "Quand est-ce que je peux vendre mes $SNL ?",
    a: "Tes $SNL seront disponibles à la vente dès le listing sur les DEX, prévu en Q3 2026. Avant ça, tu accumules des points pré-lancement qui se convertissent en $SNL réels au lancement officiel du token en Q2 2026. Tu peux alors garder, vendre ou réinvestir dans l'écosystème.",
  },
  {
    q: "Comment le $SNL est-il sécurisé ?",
    a: "Le $SNL est déployé sur BNB Chain, une blockchain publique et vérifiable. Tous les contrats sont audités et les transactions sont transparentes et traçables. La supply totale est inscrite dans le code du contrat et ne peut pas être modifiée — pas même par l'équipe SUNALA.",
  },
  {
    q: "Pourquoi commencer maintenant et pas après le lancement ?",
    a: "Les premiers membres accumulent des points pendant la plus longue période avant le lancement. Plus tu commences tôt, plus tu accumules de points — et plus tu reçois de $SNL au lancement. Après le lancement, il faudra acheter des $SNL avec de l'argent réel. Aujourd'hui, c'est 100% gratuit.",
  },
];

export default function SnlFaqAccordion({ light = false }) {
  const [open, setOpen] = useState(0);

  const cardBg = light ? "#F8FAFC" : "#0d1f1a";
  const cardBorder = light ? "1px solid rgba(31,78,70,0.08)" : "1px solid rgba(255,255,255,0.07)";
  const questionColor = light ? "#0F172B" : "#ffffff";
  const answerColor = light ? "#45556C" : "rgba(255,255,255,0.65)";

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: cardBg, border: cardBorder }}
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <span className="font-bold text-[15px] sm:text-[17px] leading-snug pr-4" style={{ color: questionColor }}>
              {faq.q}
            </span>
            <span
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[18px] font-bold transition-transform duration-300"
              style={{
                backgroundColor: open === i ? "#3FAE8C" : "rgba(63,174,140,0.15)",
                color: "#3FAE8C",
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-6">
              <p className="text-[14px] leading-relaxed" style={{ color: answerColor }}>
                {faq.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
