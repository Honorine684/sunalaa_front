"use client";
import Link from "next/link";
import { useState } from "react";

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative z-50 w-full flex items-center justify-center gap-3 px-4 py-2.5 text-center"
      style={{ backgroundColor: "#E6B84C" }}>
      <span className="text-[13px] sm:text-[14px] font-semibold text-[#1A3A34] leading-snug">
        🌱 Pré-lancement SUNALA — Les 5 000 premiers membres reçoivent un bonus exclusif de 500 points.{" "}
        <span className="font-bold">[Il reste 3 247 places]</span>{" "}—{" "}
        <Link href="/register" className="underline underline-offset-2 hover:opacity-80 transition whitespace-nowrap">
          Rejoindre maintenant →
        </Link>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A3A34]/60 hover:text-[#1A3A34] transition cursor-pointer"
        aria-label="Fermer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
