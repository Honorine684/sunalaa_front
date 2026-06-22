"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const rawPathname = usePathname(); // URL brute : /fr/profil ou /profil

  function switchTo(newLocale) {
    if (newLocale === locale) return;

    // Supprimer le préfixe /fr si présent
    let clean = rawPathname;
    if (clean.startsWith("/fr")) clean = clean.slice(3) || "/";

    const newPath = newLocale === "fr"
      ? `/fr${clean === "/" ? "" : clean}`
      : (clean || "/");

    window.location.href = newPath;
  }

  return (
    <div className="flex items-center gap-1 rounded-full px-1 py-1" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
      {["en", "fr"].map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className="px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-[12px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          style={{
            backgroundColor: locale === loc ? "#E6B84C" : "transparent",
            color: locale === loc ? "#1A3A34" : "rgba(255,255,255,0.70)",
          }}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
