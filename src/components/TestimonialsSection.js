const testimonials = [
  {
    name: "Kofi A.",
    country: "Ghana 🇬🇭",
    initials: "KA",
    color: "#3FAE8C",
    text: "J'ai rejoint SUNALA il y a 3 semaines. Je collecte mes points chaque matin en 30 secondes avec mon café. J'ai déjà accumulé plus de 4 500 points. Au lancement je convertis directement.",
  },
  {
    name: "Aminata D.",
    country: "Sénégal 🇸🇳",
    initials: "AD",
    color: "#E6B84C",
    text: "J'ai parrainé 12 personnes dans mon quartier. Grâce au système de parrainage, mes gains ont triplé en deux semaines. C'est simple, gratuit et ça marche vraiment.",
  },
  {
    name: "Moussa K.",
    country: "Côte d'Ivoire 🇨🇮",
    initials: "MK",
    color: "#1F4E46",
    text: "Au début j'étais sceptique. Mais quand j'ai vu que c'est 100% gratuit sans investissement requis, j'ai essayé. Maintenant je suis dans le top 500 du classement.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#E6B84C">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[12px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            Témoignages
          </span>
          <h2 className="font-black text-[24px] sm:text-[40px] leading-tight"
            style={{ color: "#0F172B" }}>
            Ce que disent nos premiers membres
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name}
              className="rounded-[28px] p-7 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300"
              style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(15,23,43,0.06)" }}>
              {/* Stars */}
              <Stars />

              {/* Quote */}
              <p className="text-[14px] leading-relaxed flex-1" style={{ color: "#45556C" }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4"
                style={{ borderTop: "1px solid rgba(15,23,43,0.06)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[13px]"
                  style={{ backgroundColor: t.color }}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-[14px]" style={{ color: "#0F172B" }}>{t.name}</p>
                  <p className="text-[12px]" style={{ color: "#94A3B8" }}>{t.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[
            { value: "12 847+", label: "membres actifs" },
            { value: "4.9/5", label: "satisfaction moyenne" },
            { value: "2.4M+", label: "points SNL distribués" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-black text-[28px] leading-none" style={{ color: "#1F4E46" }}>{value}</p>
              <p className="text-[13px] mt-1" style={{ color: "#94A3B8" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* À quoi sert le $SNL */}
        <div className="flex justify-center mt-10">
          <a
            href="/snl/usage"
            className="inline-flex items-center gap-2 font-semibold text-[14px] px-5 py-2.5 rounded-full transition-all hover:brightness-110 group"
            style={{ backgroundColor: "#3FAE8C", color: "#fff" }}
          >
            À quoi sert vraiment le $SNL ?
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
