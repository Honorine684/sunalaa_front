import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CGU" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/cgu",
      languages: {
        "x-default": "https://sunalaa.com/cgu",
        en: "https://sunalaa.com/cgu",
        fr: "https://sunalaa.com/fr/cgu",
      },
    },
  };
}

/* ── Shared style helpers ── */
const articleHeaderNum = { color: "#3FAE8C", fontWeight: 700, fontSize: 13, marginBottom: 2 };
const articleTitle = { color: "#0F172B", fontWeight: 700, fontSize: 20, marginBottom: 16 };
const cardStyle = {
  background: "#fff",
  border: "1px solid #E2E8F0",
  borderRadius: 14,
  boxShadow: "0 1px 4px rgba(15,23,43,0.05)",
  padding: "28px 32px",
  marginBottom: 20,
};
const subTitle = { color: "#1F4E46", fontWeight: 600, fontSize: 15, marginBottom: 10, marginTop: 16 };
const bodyText = { color: "#45556C", fontSize: 14, lineHeight: "1.75" };
const listItem = { color: "#45556C", fontSize: 14, lineHeight: "1.75", display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 };

function CheckIcon() {
  return (
    <span style={{ color: "#3FAE8C", marginTop: 3, flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function DotIcon() {
  return (
    <span style={{ color: "#E6B84C", marginTop: 6, flexShrink: 0, fontSize: 18, lineHeight: 1 }}>•</span>
  );
}

export default async function CGUPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CGU" });
  const prefix = locale === "fr" ? "/fr" : "";

  const pointsRows = [
    [t("art3_2_row1_action"), t("art3_2_row1_points")],
    [t("art3_2_row2_action"), t("art3_2_row2_points")],
    [t("art3_2_row3_action"), t("art3_2_row3_points")],
    [t("art3_2_row4_action"), t("art3_2_row4_points")],
    [t("art3_2_row5_action"), t("art3_2_row5_points")],
    [t("art3_2_row6_action"), t("art3_2_row6_points")],
    [t("art3_2_row7_action"), t("art3_2_row7_points")],
    [t("art3_2_row8_action"), t("art3_2_row8_points")],
    [t("art3_2_row9_action"), t("art3_2_row9_points")],
    [t("art3_2_row10_action"), t("art3_2_row10_points")],
  ];

  const referralRows = [
    t("art4_row1"),
    t("art4_row2"),
    t("art4_row3"),
    t("art4_row4"),
    t("art4_row5"),
    t("art4_row6"),
  ];

  const definitions = [
    { term: t("art1_def1_term"), desc: t("art1_def1_desc") },
    { term: t("art1_def2_term"), desc: t("art1_def2_desc") },
    { term: t("art1_def3_term"), desc: t("art1_def3_desc") },
    { term: t("art1_def4_term"), desc: t("art1_def4_desc") },
    { term: t("art1_def5_term"), desc: t("art1_def5_desc") },
    { term: t("art1_def6_term"), desc: t("art1_def6_desc") },
    { term: t("art1_def7_term"), desc: t("art1_def7_desc") },
    { term: t("art1_def8_term"), desc: t("art1_def8_desc") },
    { term: t("art1_def9_term"), desc: t("art1_def9_desc") },
  ];

  const risks = [
    { title: t("art8_risk1_title"), desc: t("art8_risk1_desc") },
    { title: t("art8_risk2_title"), desc: t("art8_risk2_desc") },
    { title: t("art8_risk3_title"), desc: t("art8_risk3_desc") },
    { title: t("art8_risk4_title"), desc: t("art8_risk4_desc") },
    { title: t("art8_risk5_title"), desc: t("art8_risk5_desc") },
    { title: t("art8_risk6_title"), desc: t("art8_risk6_desc") },
  ];

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-primary overflow-hidden" style={{ minHeight: 320 }}>
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
          {[560, 420, 300, 180].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/5" style={{ width: s, height: s }} />
          ))}
        </div>
        <Container className="relative z-10 py-16 flex flex-col items-center text-center gap-4">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            {t("hero_badge")}
          </span>
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(26px,4.5vw,44px)", maxWidth: 600 }}>
            {t("hero_title")}
          </h1>
        </Container>
      </section>

      {/* ── Préambule ── */}
      <section className="bg-[#F8FAFC] py-12 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl p-7"
              style={{ background: "linear-gradient(135deg, rgba(31,78,70,0.04), rgba(63,174,140,0.06))", border: "1px solid rgba(63,174,140,0.18)" }}
            >
              <p className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ color: "#3FAE8C" }}>
                {t("preamble_label")}
              </p>
              <p style={{ ...bodyText, marginBottom: 14 }}>{t("preamble_p1")}</p>
              <p style={{ ...bodyText, marginBottom: 20 }}>{t("preamble_p2")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {[t("preamble_point1"), t("preamble_point2"), t("preamble_point3"), t("preamble_point4")].map((pt, i) => (
                  <li key={i} style={listItem}>
                    <CheckIcon />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Articles ── */}
      <section className="bg-white py-12 border-b border-slate-100">
        <Container>
          <div className="max-w-3xl mx-auto flex flex-col">

            {/* Article 1 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 01</p>
              <h2 style={articleTitle}>{t("art1_title")}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {definitions.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, marginTop: 3, width: 22, height: 22, borderRadius: "50%", background: "rgba(63,174,140,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <p style={{ ...bodyText, margin: 0 }}>
                      <span style={{ fontWeight: 600, color: "#1F4E46" }}>{d.term} : </span>
                      {d.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Article 2 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 02</p>
              <h2 style={articleTitle}>{t("art2_title")}</h2>

              <p style={subTitle}>{t("art2_1_title")}</p>
              <p style={bodyText}>{t("art2_1_desc")}</p>

              <p style={subTitle}>{t("art2_2_title")}</p>
              <p style={{ ...bodyText, marginBottom: 10 }}>{t("art2_2_desc")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art2_2_obl1"), t("art2_2_obl2"), t("art2_2_obl3"), t("art2_2_obl4"), t("art2_2_obl5")].map((item, i) => (
                  <li key={i} style={listItem}><CheckIcon /><span>{item}</span></li>
                ))}
              </ul>

              <p style={subTitle}>{t("art2_3_title")}</p>
              <p style={bodyText}>{t("art2_3_desc")}</p>
            </div>

            {/* Article 3 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 03</p>
              <h2 style={articleTitle}>{t("art3_title")}</h2>

              <p style={subTitle}>{t("art3_1_title")}</p>
              <p style={{ ...bodyText, marginBottom: 20 }}>{t("art3_1_desc")}</p>

              <p style={subTitle}>{t("art3_2_title")}</p>
              <div style={{ overflowX: "auto", marginTop: 12 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1F4E46" }}>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px", borderRadius: "8px 0 0 0" }}>{t("art3_2_action")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "right", padding: "10px 14px", borderRadius: "0 8px 0 0" }}>{t("art3_2_points")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsRows.map(([action, pts], i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                        <td style={{ padding: "9px 14px", color: "#334155" }}>{action}</td>
                        <td style={{ padding: "9px 14px", color: "#1F4E46", fontWeight: 600, textAlign: "right" }}>{pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={subTitle}>{t("art3_3_title")}</p>
              <p style={bodyText}>{t("art3_3_desc")}</p>
            </div>

            {/* Article 4 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 04</p>
              <h2 style={articleTitle}>{t("art4_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 16 }}>{t("art4_intro")}</p>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1F4E46" }}>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px", borderRadius: "8px 0 0 0" }}>{t("art4_level")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "center", padding: "10px 14px" }}>{t("art4_pct")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "right", padding: "10px 14px", borderRadius: "0 8px 0 0" }}>{t("art4_amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralRows.map((row, i) => {
                      const parts = row.split(" - ");
                      return (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F0F9F6" }}>
                          <td style={{ padding: "9px 14px", color: "#334155", fontWeight: 600 }}>{parts[0]}</td>
                          <td style={{ padding: "9px 14px", color: "#45556C", textAlign: "center" }}>{parts[1]}</td>
                          <td style={{ padding: "9px 14px", color: "#1F4E46", fontWeight: 600, textAlign: "right" }}>{parts[2]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p style={subTitle}>{t("art4_2_title")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art4_2_rule1"), t("art4_2_rule2"), t("art4_2_rule3"), t("art4_2_rule4")].map((r, i) => (
                  <li key={i} style={listItem}><DotIcon /><span>{r}</span></li>
                ))}
              </ul>
            </div>

            {/* Article 5 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 05</p>
              <h2 style={articleTitle}>{t("art5_title")}</h2>
              <div
                className="inline-flex items-center px-4 py-2 rounded-full mb-5"
                style={{ backgroundColor: "rgba(63,174,140,0.08)", border: "1px solid rgba(63,174,140,0.2)", fontSize: 13, fontWeight: 600, color: "#1F4E46" }}
              >
                {t("art5_price")}
              </div>

              <p style={subTitle}>{t("art5_1_title")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art5_1_item1"), t("art5_1_item2"), t("art5_1_item3"), t("art5_1_item4"), t("art5_1_item5"), t("art5_1_item6")].map((item, i) => (
                  <li key={i} style={listItem}><CheckIcon /><span>{item}</span></li>
                ))}
              </ul>

              <p style={subTitle}>{t("art5_2_title")}</p>
              <p style={bodyText}>{t("art5_2_desc")}</p>
            </div>

            {/* Article 6 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 06</p>
              <h2 style={articleTitle}>{t("art6_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 12 }}>{t("art6_intro")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art6_prohib1"), t("art6_prohib2"), t("art6_prohib3"), t("art6_prohib4"), t("art6_prohib5")].map((p, i) => (
                  <li key={i} style={listItem}><DotIcon /><span>{p}</span></li>
                ))}
              </ul>
            </div>

            {/* Article 7 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 07</p>
              <h2 style={articleTitle}>{t("art7_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 12 }}>{t("art7_intro")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art7_prohib1"), t("art7_prohib2"), t("art7_prohib3"), t("art7_prohib4"), t("art7_prohib5"), t("art7_prohib6"), t("art7_prohib7"), t("art7_prohib8")].map((p, i) => (
                  <li key={i} style={{ ...listItem, borderBottom: i < 7 ? "1px solid #F1F5F9" : "none", paddingBottom: i < 7 ? 8 : 0 }}>
                    <span style={{ flexShrink: 0, fontWeight: 700, fontSize: 11, color: "#fff", background: "#E55555", borderRadius: 4, padding: "2px 6px", marginTop: 2 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article 8 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 08</p>
              <h2 style={articleTitle}>{t("art8_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 16 }}>{t("art8_intro")}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {risks.map((r, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "#1F4E46", marginBottom: 4 }}>{r.title}</p>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: "1.65" }}>{r.desc}</p>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl p-5 flex gap-3 items-start"
                style={{ backgroundColor: "rgba(230,184,76,0.08)", border: "1px solid rgba(230,184,76,0.25)" }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: 14, color: "#92400E", lineHeight: "1.65", margin: 0 }}>
                  {t("art8_warning")}
                </p>
              </div>
            </div>

            {/* Article 9 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 09</p>
              <h2 style={articleTitle}>{t("art9_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 12 }}>{t("art9_intro")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art9_case1"), t("art9_case2"), t("art9_case3"), t("art9_case4"), t("art9_case5"), t("art9_case6")].map((c, i) => (
                  <li key={i} style={listItem}><DotIcon /><span>{c}</span></li>
                ))}
              </ul>
              <div
                className="mt-5 rounded-xl px-5 py-4"
                style={{ backgroundColor: "#F0F9F6", border: "1px solid rgba(63,174,140,0.2)" }}
              >
                <p style={{ fontSize: 13, color: "#1F4E46", fontWeight: 500, margin: 0 }}>{t("art9_cap")}</p>
              </div>
            </div>

            {/* Article 10 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 10</p>
              <h2 style={articleTitle}>{t("art10_title")}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={bodyText}>{t("art10_law")}</p>
                <p style={bodyText}>{t("art10_dispute")}</p>
                <p style={bodyText}>{t("art10_consumer")}</p>
              </div>
            </div>

            {/* Article 11 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 11</p>
              <h2 style={articleTitle}>{t("art11_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 14 }}>{t("art11_close")}</p>

              <p style={subTitle}>{t("art11_conseq_title")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[t("art11_conseq1"), t("art11_conseq2"), t("art11_conseq3"), t("art11_conseq4")].map((c, i) => (
                  <li key={i} style={listItem}><DotIcon /><span>{c}</span></li>
                ))}
              </ul>

              <div
                className="mt-5 rounded-xl px-5 py-4"
                style={{ backgroundColor: "rgba(229,85,85,0.06)", border: "1px solid rgba(229,85,85,0.18)" }}
              >
                <p style={{ fontSize: 13, color: "#B91C1C", margin: 0 }}>{t("art11_suspend")}</p>
              </div>
            </div>

            {/* Contact & Réclamations */}
            <div
              className="rounded-2xl p-7 mt-2"
              style={{ background: "linear-gradient(135deg, #1F4E46, #2E6B5E)", boxShadow: "0 4px 20px rgba(31,78,70,0.2)" }}
            >
              <p className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t("contact_title")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  t("contact_general"),
                  t("contact_support"),
                  t("contact_legal"),
                  t("contact_address"),
                  t("contact_complaint"),
                  t("contact_updated"),
                ].map((item, i) => (
                  <p key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: "1.6" }}>
                    {item}
                  </p>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── Back to home ── */}
      <section className="bg-[#F8FAFC] py-10 border-t border-slate-100">
        <Container className="flex justify-center">
          <Link
            href={`${prefix}/`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[14px] transition-all hover:brightness-110"
            style={{ backgroundColor: "#1F4E46", color: "#fff" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("back_home")}
          </Link>
        </Container>
      </section>

      <Footer />
    </>
  );
}
