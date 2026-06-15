import Link from "next/link";
import Footer from "@/components/Footer";
import SnlNavbar from "@/components/SnlNavbar";
import SnlFaqAccordion from "@/components/SnlFaqAccordion";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SNLMain" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: { canonical: "https://sunalaa.com/snl" },
    openGraph: {
      url: "https://sunalaa.com/snl",
      title: t("og_title"),
      description: t("og_desc"),
    },
  };
}

const b = (chunks) => <strong style={{ color: "#1F4E46" }}>{chunks}</strong>;

export default async function SnlPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SNLMain" });
  const tUtil = await getTranslations({ locale, namespace: "SNLUtilite" });
  const tUsage = await getTranslations({ locale, namespace: "SNLUsage" });
  const tValeur = await getTranslations({ locale, namespace: "SNLValeur" });
  const prefix = locale === "fr" ? "/fr" : "";

  const navItems = [
    { href: "#comprendre", label: t("nav_understand"), color: "#3FAE8C" },
    { href: "#utilites", label: t("nav_utilities"), color: "#1F4E46" },
    { href: "#usage", label: t("nav_usage"), color: "#E6B84C" },
    { href: "#valeur", label: t("nav_value"), color: "#3FAE8C" },
  ];

  const utilites = [
    { num: "01", title: tUtil("util1_title"), desc: tUtil("util1_desc"), example: tUtil("util1_example"), color: "#3FAE8C" },
    { num: "02", title: tUtil("util2_title"), desc: tUtil("util2_desc"), example: tUtil("util2_example"), color: "#E6B84C" },
    { num: "03", title: tUtil("util3_title"), desc: tUtil("util3_desc"), example: tUtil("util3_example"), color: "#3FAE8C" },
    { num: "04", title: tUtil("util4_title"), desc: tUtil("util4_desc"), example: tUtil("util4_example"), color: "#1F4E46" },
    { num: "05", title: tUtil("util5_title"), desc: tUtil("util5_desc"), example: tUtil("util5_example"), color: "#E6B84C" },
    { num: "06", title: tUtil("util6_title"), desc: tUtil("util6_desc"), example: tUtil("util6_example"), color: "#3FAE8C" },
  ];

  const mechs = [
    { title: tValeur("mech1_title"), desc: tValeur("mech1_desc"), color: "#3FAE8C" },
    { title: tValeur("mech2_title"), desc: tValeur("mech2_desc"), color: "#1F4E46" },
    { title: tValeur("mech3_title"), desc: tValeur("mech3_desc"), color: "#E6B84C" },
    { title: tValeur("mech4_title"), desc: tValeur("mech4_desc"), color: "#3FAE8C" },
  ];

  const steps = [
    { num: "01", color: "#3FAE8C",  label: tValeur("step1_label"), title: tValeur("step1_title"), desc: tValeur("step1_desc"), badge: tValeur("step1_badge"), badgeBg: "rgba(63,174,140,0.08)" },
    { num: "02", color: "#E6B84C",  label: tValeur("step2_label"), title: tValeur("step2_title"), desc: tValeur("step2_desc"), badge: tValeur("step2_badge"), badgeBg: "rgba(230,184,76,0.08)" },
    { num: "03", color: "#38BDF8",  label: tValeur("step3_label"), title: tValeur("step3_title"), desc: tValeur("step3_desc"), badge: tValeur("step3_badge"), badgeBg: "rgba(56,189,248,0.08)" },
    { num: "04", color: "#8B5CF6",  label: tValeur("step4_label"), title: tValeur("step4_title"), desc: tValeur("step4_desc"), badge: tValeur("step4_badge"), badgeBg: "rgba(139,92,246,0.08)" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <SnlNavbar />

      {/* ── Navigation sections ── */}
      <nav
        className="sticky top-17 z-40 bg-white overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(31,78,70,0.08)" }}
      >
        <div className="flex items-center px-4 py-3 gap-2 w-max min-w-full sm:w-auto sm:min-w-0 max-w-3xl mx-auto sm:justify-center">
          {navItems.map(({ href, label, color }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap text-white hover:brightness-90 transition"
              style={{ backgroundColor: color }}
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
            {t("hero_badge")}
          </span>
          <h1 className="font-black text-[36px] sm:text-[52px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            {t("hero_h1_pre")}<br />
            <span style={{ color: "#3FAE8C" }}>{t("hero_h1_accent")}</span>
            <br />{t("hero_h1_post")}
          </h1>
          <p className="text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto" style={{ color: "#45556C" }}>
            {t("hero_p1")}<br />
            {t.rich("hero_p2", { b })}
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
          <span className="text-[11px] font-bold tracking-widest uppercase block mb-4" style={{ color: "#E6B84C" }}>{t("resume_badge")}</span>
          <h2 className="font-black text-[24px] sm:text-[32px] leading-tight mb-6" style={{ color: "#0F172B" }}>
            {t("resume_h2")}
          </h2>
          <div className="flex flex-col gap-5 text-[14px] sm:text-[15px] leading-relaxed" style={{ color: "#45556C" }}>
            <p>{t.rich("resume_p1", { b })}</p>
            <p>{t.rich("resume_p2", { b })}</p>
            <p>{t.rich("resume_p3", { b })}</p>
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
              {t("why_h2_1")}<br />{t("why_h2_2")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { titleKey: "why1_title", descKey: "why1_desc", color: "#3FAE8C", num: "01" },
              { titleKey: "why2_title", descKey: "why2_desc", color: "#E6B84C", num: "02" },
              { titleKey: "why3_title", descKey: "why3_desc", color: "#1F4E46", num: "03" },
            ].map(({ titleKey, descKey, color, num }) => (
              <div key={num} className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
                <div className="font-black text-[40px] leading-none mb-3 select-none" style={{ color, opacity: 0.30 }}>{num}</div>
                <h3 className="font-bold text-[16px] mb-2" style={{ color: "#0F172B" }}>{t(titleKey)}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#45556C" }}>{t(descKey)}</p>
              </div>
            ))}
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
            {tUtil("hero_badge")}
          </span>
          <h2 className="font-black text-[30px] sm:text-[46px] leading-tight mb-4" style={{ color: "#0F172B" }}>
            {tUtil("hero_h1_1")}<br />{tUtil("hero_h1_2")} <span style={{ color: "#3FAE8C" }}>$SNL</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            {tUtil("hero_subtitle_1")}<br />{tUtil("hero_subtitle_2")}
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
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — Exemples concrets
      ══════════════════════════════════════════ */}
      <section id="usage" className="relative overflow-hidden pt-16 pb-6 scroll-mt-28">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center mb-12">
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(63,174,140,0.10)", color: "#3FAE8C" }}>
            {tUsage("hero_badge")}
          </span>
          <h2 className="font-black text-[30px] sm:text-[46px] leading-tight mb-4" style={{ color: "#0F172B" }}>
            {tUsage("hero_h1_1")}<br /><span style={{ color: "#3FAE8C" }}>SUNALA</span> {tUsage("hero_h1_2")}
          </h2>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            {tUsage("hero_subtitle")}
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

          {/* Scénario 1 */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#3FAE8C" }} />
            <h3 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              {tUsage("s1_title")}
            </h3>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              {tUsage.rich("s1_p", { b })}
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#3FAE8C" }}>{tUsage("s1_result_label")}</p>
              {[
                { label: tUsage("s1_row1"), value: "9 000 pts" },
                { label: tUsage("s1_row2"), value: "2 500 pts" },
                { label: tUsage("s1_row3"), value: "3 000 pts" },
                { label: tUsage("s1_row4"), value: "6 250 pts" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#3FAE8C" }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3">
                <span className="text-[14px] font-bold" style={{ color: "#0F172B" }}>{tUsage("s1_total")}</span>
                <span className="text-[15px] font-black" style={{ color: "#1F4E46" }}>~21 $SNL</span>
              </div>
            </div>
          </div>

          {/* Scénario 2 */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#E6B84C" }} />
            <h3 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              {tUsage("s2_title")}
            </h3>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              {tUsage.rich("s2_p", { b })}
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#E6B84C" }}>{tUsage("s2_result_label")}</p>
              {[
                { label: tUsage("s2_row1"), value: "45 000 pts" },
                { label: tUsage("s2_row2"), value: "45 $SNL" },
                { label: tUsage("s2_row3"), value: "$4.50" },
                { label: tUsage("s2_row4"), value: "$22.50" },
                { label: tUsage("s2_row5"), value: "$45.00" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5"
                  style={{ borderBottom: "1px solid rgba(31,78,70,0.06)" }}>
                  <span className="text-[13px]" style={{ color: "#45556C" }}>{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#E6B84C" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scénario 3 */}
          <div className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
            style={{ backgroundColor: "#F8FAFC", border: "1px solid rgba(31,78,70,0.08)" }}>
            <span className="text-[10px] font-bold tracking-widest uppercase block mb-2" style={{ color: "#1F4E46" }}>
              {tUsage("s3_tag")}
            </span>
            <div className="h-1 w-10 rounded-full mb-5" style={{ backgroundColor: "#1F4E46" }} />
            <h3 className="font-black text-[20px] sm:text-[26px] leading-tight mb-4" style={{ color: "#0F172B" }}>
              {tUsage("s3_title")}
            </h3>
            <p className="text-[14px] leading-relaxed mb-7" style={{ color: "#45556C" }}>
              {tUsage.rich("s3_p", { b })}
            </p>
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid rgba(31,78,70,0.08)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#1F4E46" }}>{tUsage("s3_result_label")}</p>
              {[
                { label: tUsage("s3_row1"), value: "5 000 $SNL" },
                { label: tUsage("s3_row2"), value: tUsage("s3_val2") },
                { label: tUsage("s3_row3"), value: tUsage("s3_val3") },
                { label: tUsage("s3_row4"), value: tUsage("s3_val4") },
                { label: tUsage("s3_row5"), value: tUsage("s3_val5") },
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
            {tValeur("hero_badge")}
          </span>
          <h2 className="font-black text-[30px] sm:text-[46px] leading-tight mb-4" style={{ color: "#0F172B" }}>
            {tValeur("hero_h1_1")} <span style={{ color: "#3FAE8C" }}>$SNL</span><br />{tValeur("hero_h1_2")}
          </h2>
          <p className="text-[15px] sm:text-[17px] leading-relaxed" style={{ color: "#45556C" }}>
            {tValeur("hero_subtitle")}
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
            {mechs.map(({ title, desc, color }) => (
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
              {tValeur("supply_label")}
            </p>
            <p className="font-black text-[34px] sm:text-[48px] leading-none mb-2 tracking-wide" style={{ color: "#0F172B" }}>
              1 000 000 000
            </p>
            <p className="text-[13px] mb-7" style={{ color: "#94A3B8" }}>{tValeur("supply_never")}</p>
            <div className="relative h-3 rounded-full overflow-hidden mb-3" style={{ backgroundColor: "rgba(31,78,70,0.10)" }}>
              <div className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: "65%", background: "linear-gradient(to right, #3FAE8C, #E6B84C)" }} />
            </div>
            <div className="flex justify-between items-start text-[11px]" style={{ color: "#94A3B8" }}>
              <span>0 $SNL</span>
              <span className="text-center" style={{ color: "#E6B84C" }}>{tValeur("supply_burns")}</span>
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
              {tValeur("timeline_badge")}
            </span>
            <h2 className="font-black text-[26px] sm:text-[38px] leading-tight" style={{ color: "#0F172B" }}>
              {tValeur("timeline_h2_1")}<br />{tValeur("timeline_h2_2")}
            </h2>
            <p className="text-[14px] mt-4" style={{ color: "#45556C" }}>
              {tValeur("timeline_subtitle")}
            </p>
          </div>
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-9.75 top-10 bottom-10 w-0.5" style={{ backgroundColor: "rgba(31,78,70,0.12)" }} />
            {steps.map(({ num, color, label, title, desc, badge, badgeBg }, i, arr) => (
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
            {tValeur("faq_badge")}
          </span>
          <h2 className="font-black text-[26px] sm:text-[38px] leading-tight" style={{ color: "#0F172B" }}>
            {tValeur("faq_h2_1")}<br />{tValeur("faq_h2_2")}
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
            {tValeur("cta_h2_1")}<br />
            <span style={{ color: "#3FAE8C" }}>{tValeur("cta_h2_2")}</span><br />
            <em className="not-italic" style={{ color: "#E6B84C" }}>{tValeur("cta_h2_3")}</em>
          </h2>
          <p className="text-[15px] leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            {tValeur("cta_subtitle")}
          </p>
          <div className="flex flex-col gap-3">
            <Link href={`${prefix}/register`}
              className="flex items-center justify-center gap-2 font-bold text-[15px] text-white w-full py-4 rounded-2xl hover:brightness-90 transition"
              style={{ backgroundColor: "#3FAE8C" }}>
              {tValeur("cta_start")}
            </Link>
            <Link href={`${prefix}/`}
              className="flex items-center justify-center gap-2 font-semibold text-[14px] text-white w-full py-4 rounded-2xl transition hover:bg-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {tValeur("cta_back")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
