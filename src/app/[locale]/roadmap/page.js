import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Roadmap" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/roadmap",
      languages: { "x-default": "https://sunalaa.com/roadmap", en: "https://sunalaa.com/roadmap", fr: "https://sunalaa.com/fr/roadmap" },
    },
  };
}

export default async function RoadmapPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Roadmap" });
  const prefix = locale === "fr" ? "/fr" : "";

  const phases = [
    {
      num: "00",
      label: t("p0_label"),
      title: t("p0_title"),
      period: t("p0_period"),
      status: t("p0_status"),
      color: "#3FAE8C",
      items: [
        { text: t("p0_i1"), done: true },
        { text: t("p0_i2"), done: true },
        { text: t("p0_i3"), done: true },
        { text: t("p0_i4"), done: true },
        { text: t("p0_i5"), done: false },
        { text: t("p0_i6"), done: false },
      ],
    },
    {
      num: "01",
      label: t("p1_label"),
      title: t("p1_title"),
      period: t("p1_period"),
      status: t("p1_status"),
      color: "#E6B84C",
      items: [
        { text: t("p1_i1"), done: null },
        { text: t("p1_i2"), done: null },
        { text: t("p1_i3"), done: null },
        { text: t("p1_i4"), done: null },
      ],
    },
    {
      num: "02",
      label: t("p2_label"),
      title: t("p2_title"),
      period: t("p2_period"),
      status: t("p2_status"),
      color: "#3B82F6",
      items: [
        { text: t("p2_i1"), done: null },
        { text: t("p2_i2"), done: null },
        { text: t("p2_i3"), done: null },
        { text: t("p2_i4"), done: null },
        { text: t("p2_i5"), done: null },
      ],
    },
    {
      num: "03",
      label: t("p3_label"),
      title: t("p3_title"),
      period: t("p3_period"),
      status: t("p3_status"),
      color: "#8B5CF6",
      items: [
        { text: t("p3_i1"), done: null },
        { text: t("p3_i2"), done: null },
        { text: t("p3_i3"), done: null },
        { text: t("p3_i4"), done: null },
      ],
    },
    {
      num: "04",
      label: t("p4_label"),
      title: t("p4_title"),
      period: t("p4_period"),
      status: t("p4_status"),
      color: "#F43F5E",
      items: [
        { text: t("p4_i1"), done: null },
        { text: t("p4_i2"), done: null },
        { text: t("p4_i3"), done: null },
        { text: t("p4_i4"), done: null },
      ],
    },
  ];

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
        <Container className="relative z-10 py-20 flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}>
            {t("hero_badge")}
          </span>
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(28px,5vw,50px)", maxWidth: 620 }}>
            {t("hero_title")}
          </h1>
          <p className="text-white/60 text-[16px] leading-relaxed" style={{ maxWidth: 540 }}>
            {t("hero_subtitle")}
          </p>
        </Container>
      </section>

      {/* ── Phases ── */}
      <section className="bg-[#F8FAFC] py-16">
        <Container>
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {phases.map((phase, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Phase header */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-[13px]"
                    style={{ backgroundColor: `${phase.color}18`, color: phase.color }}>
                    {phase.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: phase.color }}>
                      {phase.label} — {phase.period}
                    </p>
                    <p className="text-[17px] font-bold mt-0.5" style={{ color: "#0F172B" }}>{phase.title}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${phase.color}15`, color: phase.color }}>
                    {phase.status}
                  </span>
                </div>
                {/* Phase items */}
                <div className="px-6 py-5 flex flex-col gap-3">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[12px]"
                        style={{
                          backgroundColor: item.done === true ? "rgba(63,174,140,0.1)" : item.done === false ? "rgba(230,184,76,0.1)" : "rgba(148,163,184,0.1)",
                          color: item.done === true ? "#3FAE8C" : item.done === false ? "#E6B84C" : "#94A3B8",
                        }}>
                        {item.done === true ? "✓" : item.done === false ? "↻" : "·"}
                      </div>
                      <p className="text-[14px] leading-relaxed" style={{ color: "#334155" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-16">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-white font-bold text-[26px] sm:text-[32px]">{t("cta_title")}</h2>
          <p className="text-white/60 text-[15px]" style={{ maxWidth: 460 }}>{t("cta_subtitle")}</p>
          <a
            href={`${prefix}/register`}
            className="px-8 py-3.5 rounded-full text-white font-semibold text-[15px] hover:brightness-110 transition"
            style={{ backgroundColor: "#E6B84C" }}
          >
            {t("cta_btn")}
          </a>
        </Container>
      </section>

      <Footer />
    </>
  );
}
