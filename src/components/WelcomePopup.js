"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("sunala_welcome_seen");
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    localStorage.setItem("sunala_welcome_seen", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#1F4E46" }}>

        {/* Close */}
        <button onClick={close}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition cursor-pointer z-10"
          aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Gold top bar */}
        <div className="h-1.5 w-full" style={{ backgroundColor: "#E6B84C" }} />

        <div className="px-8 py-8">
          {/* Badge */}
          <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5"
            style={{ backgroundColor: "rgba(230,184,76,0.15)", color: "#E6B84C" }}>
            Offre de bienvenue
          </span>

          <h2 className="text-white font-black text-[26px] leading-tight mb-3">
            Tu arrives au bon moment.
          </h2>
          <p className="text-white/70 text-[14px] leading-relaxed mb-2">
            SUNALA distribue des points SNL gratuitement avant le lancement officiel du token. Ces points deviendront de vrais <strong className="text-white">$SNL</strong>. 1 000 points = 1 $SNL.
          </p>
          <p className="text-white/70 text-[14px] leading-relaxed mb-6">
            Inscris-toi maintenant et reçois <strong className="text-[#E6B84C]">200 points de bienvenue</strong>.
          </p>

          <Link
            href="/register"
            onClick={close}
            className="flex items-center justify-between w-full rounded-full font-bold text-[15px] text-white px-6 py-4 hover:brightness-110 transition"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            Je veux mes 200 points — Gratuit
            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>

          <button onClick={close}
            className="w-full text-center text-white/40 text-[12px] mt-4 hover:text-white/60 transition cursor-pointer">
            Non merci, continuer sans bonus
          </button>
        </div>
      </div>
    </div>
  );
}
