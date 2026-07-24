import Image from "next/image";
import Container from "./Container";
import { useTranslations } from "next-intl";

export default function FormationsHero() {
  const t = useTranslations("FormationsHero");
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#0d2e2a] min-h-screen">
      <style>{`
        @keyframes cs-fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes cs-pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.08); }
        }
        @keyframes cs-dot {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; }
        }
        .cs-title {
          animation: cs-fade-up 0.9s ease both;
        }
        .cs-shimmer {
          background: linear-gradient(
            90deg,
            #3FAE8C 0%,
            #7de8c7 40%,
            #3FAE8C 60%,
            #7de8c7 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: cs-shimmer 3s linear infinite;
        }
        .cs-sub {
          animation: cs-fade-up 0.9s 0.25s ease both;
          opacity: 0;
        }
        .cs-ring {
          animation: cs-pulse-ring 3s ease-in-out infinite;
        }
        .cs-dot-1 { animation: cs-dot 1.4s 0s ease-in-out infinite; }
        .cs-dot-2 { animation: cs-dot 1.4s 0.25s ease-in-out infinite; }
        .cs-dot-3 { animation: cs-dot 1.4s 0.5s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/image 2.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,78,70,0.65)" }} />
      </div>

      {/* Decorative ring */}
      <div
        className="cs-ring absolute rounded-full border border-secondary/30 pointer-events-none"
        style={{ width: 520, height: 520, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      />
      <div
        className="cs-ring absolute rounded-full border border-secondary/15 pointer-events-none"
        style={{ width: 700, height: 700, left: "50%", top: "50%", transform: "translate(-50%, -50%)", animationDelay: "0.5s" }}
      />

      {/* Content */}
      <Container className="relative z-10 text-center py-24">
        <p className="cs-sub text-[13px] lg:text-[15px] font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
          Courses &amp; Masterclass
        </p>

        <h1 className="cs-title text-[52px] lg:text-[96px] font-bold leading-none mb-6" style={{ fontFamily: "Rubik, sans-serif" }}>
          <span className="cs-shimmer">Coming</span>
          <br />
          <span className="cs-shimmer" style={{ animationDelay: "0.3s" }}>Soon</span>
        </h1>

        <div className="cs-sub flex items-center justify-center gap-3 mb-10" style={{ animationDelay: "0.45s" }}>
          <span className="cs-dot-1 w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="cs-dot-2 w-2.5 h-2.5 rounded-full bg-secondary" />
          <span className="cs-dot-3 w-2.5 h-2.5 rounded-full bg-secondary" />
        </div>

        <p className="cs-sub text-[15px] lg:text-[18px] max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.7", animationDelay: "0.6s" }}>
          {t("coming_soon_sub")}
        </p>
      </Container>
    </section>
  );
}
