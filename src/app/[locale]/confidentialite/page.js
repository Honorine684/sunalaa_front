import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Confidentialite" });
  return {
    title: t("meta_title"),
    description: t("meta_desc"),
    alternates: {
      canonical: "https://sunalaa.com/confidentialite",
      languages: {
        "x-default": "https://sunalaa.com/confidentialite",
        en: "https://sunalaa.com/confidentialite",
        fr: "https://sunalaa.com/fr/confidentialite",
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

export default async function ConfidentialitePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Confidentialite" });
  const prefix = locale === "fr" ? "/fr" : "";

  const rights = [
    t("right_access"),
    t("right_rectification"),
    t("right_erasure"),
    t("right_portability"),
    t("right_opposition"),
    t("right_restriction"),
  ];

  const art2DirectItems = [
    t("art2_1_item1"), t("art2_1_item2"), t("art2_1_item3"),
    t("art2_1_item4"), t("art2_1_item5"), t("art2_1_item6"), t("art2_1_item7"),
  ];

  const art2AutoItems = [
    t("art2_2_item1"), t("art2_2_item2"), t("art2_2_item3"),
    t("art2_2_item4"), t("art2_2_item5"), t("art2_2_item6"),
  ];

  const art2ReferralItems = [
    t("art2_3_item1"), t("art2_3_item2"), t("art2_3_item3"),
  ];

  const art3Rows = [
    [t("art3_row1_purpose"), t("art3_row1_basis"), t("art3_row1_data")],
    [t("art3_row2_purpose"), t("art3_row2_basis"), t("art3_row2_data")],
    [t("art3_row3_purpose"), t("art3_row3_basis"), t("art3_row3_data")],
    [t("art3_row4_purpose"), t("art3_row4_basis"), t("art3_row4_data")],
    [t("art3_row5_purpose"), t("art3_row5_basis"), t("art3_row5_data")],
    [t("art3_row6_purpose"), t("art3_row6_basis"), t("art3_row6_data")],
    [t("art3_row7_purpose"), t("art3_row7_basis"), t("art3_row7_data")],
    [t("art3_row8_purpose"), t("art3_row8_basis"), t("art3_row8_data")],
  ];

  const art4Items = [
    t("art4_item1"), t("art4_item2"), t("art4_item3"),
    t("art4_item4"), t("art4_item5"), t("art4_item6"),
  ];

  const art5ShareItems = [
    t("art5_share1"), t("art5_share2"), t("art5_share3"),
    t("art5_share4"), t("art5_share5"),
  ];

  const art6Measures = [
    t("art6_measure1"), t("art6_measure2"), t("art6_measure3"),
    t("art6_measure4"), t("art6_measure5"), t("art6_measure6"),
  ];

  const cookieRows = [
    [t("art7_row1_type"), t("art7_row1_purpose"), t("art7_row1_duration")],
    [t("art7_row2_type"), t("art7_row2_purpose"), t("art7_row2_duration")],
    [t("art7_row3_type"), t("art7_row3_purpose"), t("art7_row3_duration")],
    [t("art7_row4_type"), t("art7_row4_purpose"), t("art7_row4_duration")],
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
          <h1 className="text-white font-bold leading-tight" style={{ fontSize: "clamp(26px,4.5vw,44px)", maxWidth: 620 }}>
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
              <p style={{ ...bodyText, marginBottom: 12 }}>{t("preamble_p1")}</p>
              <p style={{ ...bodyText, marginBottom: 20 }}>{t("preamble_p2")}</p>

              {/* RGPD rights bloc */}
              <div
                className="rounded-xl p-5 mt-2"
                style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(63,174,140,0.15)" }}
              >
                <p style={{ fontWeight: 700, fontSize: 13, color: "#1F4E46", marginBottom: 12 }}>{t("rights_label")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {rights.map((r, i) => (
                    <div key={i} style={listItem}>
                      <CheckIcon />
                      <span style={{ fontWeight: 500 }}>{r}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#1F4E46", fontWeight: 600, margin: 0 }}>{t("rights_contact")}</p>
              </div>
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
                {[
                  t("art1_entity"),
                  t("art1_country"),
                  t("art1_dpo"),
                  t("art1_contact"),
                  t("art1_framework"),
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <CheckIcon />
                    <p style={{ ...bodyText, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Article 2 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 02</p>
              <h2 style={articleTitle}>{t("art2_title")}</h2>

              <p style={subTitle}>{t("art2_1_title")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {art2DirectItems.map((item, i) => (
                  <li key={i} style={listItem}><CheckIcon /><span>{item}</span></li>
                ))}
              </ul>

              <p style={subTitle}>{t("art2_2_title")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {art2AutoItems.map((item, i) => (
                  <li key={i} style={listItem}><DotIcon /><span>{item}</span></li>
                ))}
              </ul>

              <p style={subTitle}>{t("art2_3_title")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {art2ReferralItems.map((item, i) => (
                  <li key={i} style={listItem}><DotIcon /><span>{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Article 3 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 03</p>
              <h2 style={articleTitle}>{t("art3_title")}</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1F4E46" }}>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px", borderRadius: "8px 0 0 0" }}>{t("art3_col_purpose")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px" }}>{t("art3_col_basis")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px", borderRadius: "0 8px 0 0" }}>{t("art3_col_data")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {art3Rows.map(([purpose, basis, data], i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                        <td style={{ padding: "9px 14px", color: "#334155", fontWeight: 500 }}>{purpose}</td>
                        <td style={{ padding: "9px 14px", color: "#1F4E46", fontSize: 12 }}>{basis}</td>
                        <td style={{ padding: "9px 14px", color: "#64748B", fontSize: 12 }}>{data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Article 4 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 04</p>
              <h2 style={articleTitle}>{t("art4_title")}</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {art4Items.map((item, i) => (
                  <li key={i} style={{ ...listItem, borderBottom: i < art4Items.length - 1 ? "1px solid #E2E8F0" : "none", paddingBottom: i < art4Items.length - 1 ? 10 : 0 }}>
                    <span style={{ flexShrink: 0, marginTop: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(63,174,140,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#3FAE8C" }}>
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article 5 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 05</p>
              <h2 style={articleTitle}>{t("art5_title")}</h2>
              <div
                className="rounded-xl px-5 py-3 mb-5 inline-flex items-center gap-2"
                style={{ backgroundColor: "#F0F9F6", border: "1px solid rgba(63,174,140,0.2)", fontSize: 13, fontWeight: 600, color: "#1F4E46" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("art5_never")}
              </div>

              <p style={{ ...bodyText, marginBottom: 12 }}>{t("art5_share_intro")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {art5ShareItems.map((item, i) => (
                  <li key={i} style={listItem}><CheckIcon /><span>{item}</span></li>
                ))}
              </ul>

              <p style={subTitle}>{t("art5_1_title")}</p>
              <p style={bodyText}>{t("art5_1_desc")}</p>
            </div>

            {/* Article 6 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 06</p>
              <h2 style={articleTitle}>{t("art6_title")}</h2>
              <p style={{ ...bodyText, marginBottom: 14 }}>{t("art6_intro")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {art6Measures.map((m, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ flexShrink: 0, marginTop: 2, width: 22, height: 22, borderRadius: "50%", background: "rgba(63,174,140,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <p style={{ fontSize: 13, color: "#334155", lineHeight: "1.65", margin: 0 }}>{m}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Article 7 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 07</p>
              <h2 style={articleTitle}>{t("art7_title")}</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
                  <thead>
                    <tr style={{ backgroundColor: "#1F4E46" }}>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px", borderRadius: "8px 0 0 0" }}>{t("art7_col_type")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "left", padding: "10px 14px" }}>{t("art7_col_purpose")}</th>
                      <th style={{ color: "#fff", fontWeight: 600, textAlign: "right", padding: "10px 14px", borderRadius: "0 8px 0 0" }}>{t("art7_col_duration")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieRows.map(([type, purpose, duration], i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                        <td style={{ padding: "9px 14px", color: "#334155", fontWeight: 500 }}>{type}</td>
                        <td style={{ padding: "9px 14px", color: "#45556C" }}>{purpose}</td>
                        <td style={{ padding: "9px 14px", color: "#1F4E46", fontWeight: 600, textAlign: "right" }}>{duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Article 8 */}
            <div style={{ ...cardStyle, backgroundColor: "#F8FAFC" }}>
              <p style={articleHeaderNum}>ARTICLE 08</p>
              <h2 style={articleTitle}>{t("art8_title")}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[t("art8_contact"), t("art8_delay"), t("art8_authority")].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <CheckIcon />
                    <p style={{ ...bodyText, margin: 0 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Article 9 */}
            <div style={cardStyle}>
              <p style={articleHeaderNum}>ARTICLE 09</p>
              <h2 style={articleTitle}>{t("art9_title")}</h2>
              <p style={bodyText}>{t("art9_desc")}</p>
            </div>

            {/* Contact Protection des Données */}
            <div
              className="rounded-2xl p-7 mt-2"
              style={{ background: "linear-gradient(135deg, #1F4E46, #2E6B5E)", boxShadow: "0 4px 20px rgba(31,78,70,0.2)" }}
            >
              <p className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                {t("contact_title")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  t("contact_dpo"),
                  t("contact_general"),
                  t("contact_authority"),
                  t("contact_delay"),
                  t("contact_identity"),
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
