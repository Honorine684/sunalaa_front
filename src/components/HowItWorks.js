import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Créez votre compte",
    desc: "Rejoignez SUNALAA en quelques secondes. L'inscription est 100% gratuite, sans carte bancaire ni investissement requis. Renseignez simplement votre email, créez un mot de passe et vous êtes prêt à commencer votre aventure SNL.",
    btn: "Lire plus",
    href: "/login",
    img: "/images/image 11.png",
  },
  {
    num: "02",
    title: "Collectez chaque jour",
    desc: "Revenez chaque jour sur SUNALAA pour réclamer vos points SNL quotidiens. Plus vous êtes régulier, plus votre streak augmente et plus vos récompenses sont importantes. Complétez aussi des missions sur les réseaux sociaux pour booster votre solde.",
    btn: "Lire plus",
    href: "/login",
    img: "/images/image 12.png",
  },
  {
    num: "03",
    title: "Invitez votre réseau",
    desc: "Partagez votre lien de parrainage unique avec vos amis, votre famille et votre communauté. Gagnez un bonus sur chaque collecte de vos filleuls jusqu'à 3 niveaux de profondeur. Plus votre réseau est actif, plus vous gagnez de points SNL.",
    btn: "Lire plus",
    href: "/login",
    img: "/images/image 13.png",
  },
];

function IllustrationStep1() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Form card */}
      <rect x="20" y="10" width="140" height="120" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Field lines */}
      <rect x="36" y="32" width="108" height="10" rx="4" fill="#F1F5F9" />
      <rect x="36" y="52" width="108" height="10" rx="4" fill="#F1F5F9" />
      <rect x="36" y="72" width="80" height="10" rx="4" fill="#F1F5F9" />
      {/* Submit button */}
      <rect x="36" y="96" width="108" height="18" rx="6" fill="#1A3A34" />
      <text x="90" y="109" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">
        S&apos;inscrire
      </text>
      {/* Checkmark badge */}
      <circle cx="148" cy="32" r="14" fill="#2DD4BF" />
      <path d="M142 32l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllustrationStep2() {
  return (
    <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Coin */}
      <circle cx="90" cy="70" r="44" fill="#E5B858" fillOpacity="0.15" />
      <circle cx="90" cy="70" r="32" fill="#E5B858" />
      <text x="90" y="76" textAnchor="middle" fill="#1A3A34" fontSize="24" fontFamily="sans-serif" fontWeight="900">
        SNL
      </text>
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 90 + Math.cos(rad) * 38;
        const y1 = 70 + Math.sin(rad) * 38;
        const x2 = 90 + Math.cos(rad) * 50;
        const y2 = 70 + Math.sin(rad) * 50;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E5B858" strokeWidth="2.5" strokeLinecap="round" />
        );
      })}
    </svg>
  );
}

const illustrations = [IllustrationStep1, IllustrationStep2, null];


export default function HowItWorks() {
  return (
    <section className="bg-white pt-24 pb-10 lg:pt-32 lg:pb-12 relative overflow-hidden">
      {/* Filtre SVG qui amplifie l'alpha de Group.png pour le rendre visible sur fond blanc */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="s-wm" colorInterpolationFilters="sRGB">
            {/* Multiplie l'alpha par 20 et force la couleur vert SUNALA */}
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.12
                      0 0 0 0 0.31
                      0 0 0 0 0.27
                      0 0 0 20 0"
            />
          </filter>
        </defs>
      </svg>

      {/* S watermarks — 2 colonnes alignées sur chaque étape */}
      {[
        { top: "2%",  left: "-6%" },
        { top: "2%",  left: "58%" },
        { top: "34%", left: "-4%" },
        { top: "34%", left: "60%" },
        { top: "66%", left: "-6%" },
        { top: "66%", left: "58%" },
      ].map((pos, i) => (
        <img
          key={i}
          src="/images/Group.png"
          alt=""
          aria-hidden="true"
          className="absolute select-none pointer-events-none"
          style={{
            width: 300,
            top: pos.top,
            left: pos.left,
            opacity: 0.03,
            filter: "url(#s-wm)",
          }}
        />
      ))}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="font-black text-[24px] sm:text-[40px] leading-normal" style={{ color: "#0F172B" }}>
            Comment ça marche&nbsp;?
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-16 lg:gap-24">
          {steps.map((step, idx) => {
            const IllustrationComponent = illustrations[idx];
            const isEven = idx % 2 === 1;

            return (
              <div key={step.num} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
                {/* Text side */}
                <div className={isEven ? "lg:order-last" : ""}>
                  {!step.img && (
                    <div
                      className="font-black leading-none mb-4 select-none"
                      style={{ fontSize: 80, color: "#2DD4BF", opacity: 0.20 }}
                    >
                      {step.num}
                    </div>
                  )}
                  <h3 className="font-black text-[20px] sm:text-[32px] leading-normal mb-4" style={{ color: "#0F172B" }}>
                    {step.title}
                  </h3>
                  <p className="text-[16px] mb-8" style={{ color: "#45556C", lineHeight: "28px", letterSpacing: "0.01em" }}>{step.desc}</p>
                  <Link
                    href={step.href}
                    className="inline-flex items-center px-8 py-4 rounded-full font-bold text-[16px] text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E5B858" }}
                  >
                    {step.btn}
                  </Link>
                </div>

                {/* Illustration side */}
                <div className={isEven ? "lg:order-first" : ""}>
                  {step.img ? (
                    <Image
                      src={step.img}
                      alt={step.title}
                      width={520}
                      height={400}
                      style={{ objectFit: "contain", width: "100%", height: "auto" }}
                    />
                  ) : (
                    <div className="rounded-3xl bg-slate-50 p-6 flex items-center justify-center h-64">
                      <IllustrationComponent />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
