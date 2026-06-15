import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SUNALA — Collectez des points SNL chaque jour";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Image de fond — VIS INSCRIPTION */}
        <img
          src="https://sunalaa.com/images/VIS INSCRIPTION.jpg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Overlay sombre pour lisibilité du texte */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(31,78,70,0.80) 0%, rgba(13,46,41,0.60) 100%)",
            display: "flex",
          }}
        />

        {/* Contenu centré */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(63,174,140,0.25)",
              border: "1.5px solid rgba(63,174,140,0.60)",
              borderRadius: "40px",
              padding: "8px 24px",
            }}
          >
            <span style={{ color: "#3FAE8C", fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>
              POINTS SNL
            </span>
          </div>

          <div style={{ fontSize: 80, fontWeight: 900, color: "#ffffff", letterSpacing: -2, display: "flex" }}>
            SUNALA
          </div>

          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.80)", textAlign: "center", display: "flex" }}>
            Collectez 100 SNL par jour · Parrainez · Progressez
          </div>

          <div style={{ marginTop: 8, width: 60, height: 4, borderRadius: 4, background: "linear-gradient(90deg, #E6B84C, #3FAE8C)", display: "flex" }} />
        </div>

        {/* URL en bas */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 36,
            color: "rgba(255,255,255,0.50)",
            fontSize: 16,
            display: "flex",
          }}
        >
          sunalaa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
