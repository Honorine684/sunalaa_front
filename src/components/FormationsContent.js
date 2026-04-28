"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

/* ── Course data ── */
const courses = [
  {
    id: 1,
    title: "Introduction à la Blockchain",
    desc: "Découvrez les bases de la technologie blockchain, son fonctionnement et ses applications dans le",
    level: "Débutant",
    duration: "45 min",
    snl: 50,
    locked: false,
    image: "/images/cours1.jpg",
    category: "debutant",
  },
  {
    id: 2,
    title: "Les Cryptomonnaies pour Débutants",
    desc: "Comprenez ce que sont les cryptomonnaies, comment elles fonctionnent et comment les utiliser",
    level: "Débutant",
    duration: "1h 15min",
    snl: 75,
    locked: false,
    image: "/images/cours2.jpg",
    category: "debutant",
  },
  {
    id: 3,
    title: "Sécuriser vos Actifs Numériques",
    desc: "Apprenez les meilleures pratiques pour protéger vos cryptomonnaies et éviter les arnaques",
    level: "Débutant",
    duration: "50 min",
    snl: 100,
    locked: false,
    image: "/images/cours3.jpg",
    category: "debutant",
  },
  {
    id: 4,
    title: "Analyse Technique Avancée",
    desc: "Maîtrisez les outils d'analyse technique pour prendre des décisions éclairées sur les",
    level: "Intermédiaire",
    duration: "2h 30min",
    snl: 150,
    locked: false,
    image: "/images/cours1.jpg",
    category: "intermediaire",
  },
  {
    id: 5,
    title: "Smart Contracts et DeFi",
    desc: "Explorez les contrats intelligents et la finance décentralisée pour comprendre l'avenir de la",
    level: "Intermédiaire",
    duration: "2h",
    snl: null,
    locked: true,
    image: "/images/cours2.jpg",
    category: "intermediaire",
  },
  {
    id: 6,
    title: "Gestion de Portefeuille Crypto",
    desc: "Stratégies avancées pour diversifier et gérer efficacement votre portefeuille de",
    level: "Avancé",
    duration: "3h",
    snl: null,
    locked: true,
    image: "/images/cours3.jpg",
    category: "avance",
  },
  {
    id: 7,
    title: "Sécurité Avancée et Cold Storage",
    desc: "Techniques professionnelles pour sécuriser vos actifs crypto à long terme avec le stockage à",
    level: "Avancé",
    duration: "1h 45min",
    snl: null,
    locked: true,
    image: "/images/cours1.jpg",
    category: "avance",
  },
  {
    id: 8,
    title: "Reconnaître et Éviter les Arnaques",
    desc: "Identifiez les signaux d'alarme et protégez-vous contre les escroqueries crypto les plus courantes.",
    level: "Débutant",
    duration: "40 min",
    snl: 50,
    locked: false,
    image: "/images/cours2.jpg",
    category: "debutant",
  },
];

/* ── Filter tabs ── */
const filters = [
  {
    id: "toutes",
    label: "Toutes",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M4 19h16M4 15h16M4 11h16M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "debutant",
    label: "Débutant",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "intermediaire",
    label: "Intermédiaire",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "avance",
    label: "Avancé",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2"/>
        <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "securite",
    label: "Sécurité",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

/* ── Level badge styles ── */
function LevelBadge({ level }) {
  const styles = {
    Débutant:      { backgroundColor: "#D0F4E5", border: "1px solid #AAF4CF", color: "#16a34a" },
    Intermédiaire: { backgroundColor: "#DBEAFE", border: "1px solid #93C5FD", color: "#3B82F6" },
    Avancé:        { backgroundColor: "#EDE9FE", border: "1px solid #C4B5FD", color: "#7C3AED" },
  };
  return (
    <span
      className="text-[11px] font-normal px-2.5 inline-flex items-center"
      style={{ height: 26, borderRadius: 10, ...(styles[level] ?? { backgroundColor: "#F1F5F9", color: "#64748B" }) }}
    >
      {level}
    </span>
  );
}

/* ── Course card ── */
function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:scale-[1.02] hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full">
        {course.image ? (
          <Image src={course.image} alt={course.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: course.imageBg }} />
        )}

        {/* Locked overlay */}
        {course.locked && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-white font-semibold text-[13px]">Formation verrouillée</p>
            <p className="text-white/70 text-[11px]">Complétez les prérequis</p>
          </div>
        )}

        {/* SNL reward badge */}
        {course.snl && !course.locked && (
          <div className="absolute flex items-center bg-[#E6B84C] text-white" style={{ top: 12, right: 12, height: 32, borderRadius: 8, paddingLeft: 12, paddingRight: 12, gap: 4, fontSize: 14, fontWeight: 400, lineHeight: "20px", boxShadow: "0 4px 4px -4px rgba(0,0,0,0.15)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
              <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +{course.snl} SNL
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3">
          <LevelBadge level={course.level} />
          <div className="flex items-center gap-1" style={{ fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: "16px", letterSpacing: 0, color: "#617A88" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {course.duration}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2" style={{ fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: "28px", letterSpacing: "-0.64px", color: "#0F1119" }}>{course.title}</h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2" style={{ fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: "22.75px", letterSpacing: "-0.15px", color: "#495360" }}>{course.desc}</p>

        {/* Button */}
        {course.locked ? (
          <button disabled className="w-full bg-slate-100 text-slate-400 text-[14px] font-normal py-3 rounded-xl cursor-default">
            Verrouillée
          </button>
        ) : (
          <Link href={`/formations/${course.id}`} className="block w-full bg-secondary text-white font-normal text-center hover:brightness-110 transition cursor-pointer" style={{ height: 40, borderRadius: 10, fontSize: 14, fontWeight: 400, lineHeight: "40px", letterSpacing: "-0.15px", boxShadow: "0 2px 2px -4px rgba(0,0,0,0.95), 0 4px 8px -1px rgba(0,0,0,0.35)" }}>
            Commencer la formation
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FormationsContent() {
  const [activeFilter, setActiveFilter] = useState("toutes");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    const matchFilter = activeFilter === "toutes" ||
      c.category === activeFilter ||
      (activeFilter === "securite" && c.title.toLowerCase().includes("séc"));
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div id="formations" className="relative bg-white overflow-hidden">

      {/* Concentric ellipses — left */}
      <div className="hidden lg:block absolute left-[188px] top-[185px] pointer-events-none select-none z-0">
        {[338, 281, 224, 140].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }}
          />
        ))}
      </div>

      {/* Concentric ellipses — right */}
      <div className="hidden lg:block absolute right-[12%] top-[200px] pointer-events-none select-none z-0">
        {[338, 281, 224, 140].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, right: -size / 2, top: -size / 2 }}
          />
        ))}
      </div>

      <Container className="relative z-10 pt-12 pb-16">

        {/* ── Section header ── */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[18px] lg:text-[22px] font-bold text-slate-900">Formations &amp; Masterclass</h2>
            <p className="text-slate-400 text-[12px] lg:text-[13px] mt-0.5">
              Formez-vous à la crypto et adoptez les meilleures pratiques pour investir de manière responsable
            </p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Formations", value: "8", iconColor: "#3FAE8C", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/></svg> },
            { label: "Disponibles", value: "5", iconColor: "#3FAE8C", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="2"/><path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { label: "Récompenses", value: "1175 SNL", iconColor: "#E6B84C", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="#E6B84C" strokeWidth="2"/><path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary rounded-2xl px-4 py-4 lg:px-6 lg:py-5">
              <div className="flex items-center gap-2 text-white text-[12px] lg:text-[13px] font-normal mb-2">
                {stat.icon}
                {stat.label}
              </div>
              <p className="text-white text-[22px] lg:text-[28px] font-bold leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Filter bar + search — dans une card ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 overflow-hidden">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 px-5 w-full sm:w-auto scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={
                  activeFilter === f.id
                    ? { height: 39, borderRadius: 10, paddingLeft: 16, paddingRight: 16, gap: 8 }
                    : { height: 39, borderRadius: 10, paddingLeft: 16, paddingRight: 16, gap: 8, backgroundColor: "#F8FAFC", border: "1px solid #E2E8FC" }
                }
                className={[
                  "flex items-center text-[13px] font-normal whitespace-nowrap transition cursor-pointer",
                  activeFilter === f.id
                    ? "bg-secondary text-white"
                    : "text-slate-500 hover:brightness-95",
                ].join(" ")}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative shrink-0 w-full sm:w-[260px] px-5 sm:px-0 sm:pr-5">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher d'une formation ..."
              className="w-full bg-white border border-secondary text-slate-700 placeholder:text-[#0A0A0A]/50 rounded-xl pl-9 pr-4 outline-none focus:ring-2 focus:ring-secondary/30 transition"
              style={{ fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: "100%", paddingTop: 10, paddingBottom: 10 }}

            />
          </div>
        </div>

        {/* ── Course grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* ── Bottom info banner ── */}
        <div className="bg-primary rounded-3xl px-5 py-5 lg:px-8 lg:py-7 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white mb-1" style={{ fontSize: 16, fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.31px" }}>Apprenez à votre rythme</h3>
            <p className="mb-4" style={{ fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 400, lineHeight: "22.75px", letterSpacing: "-0.15px", color: "#FFFFFF" }}>
              Nos formations sont conçues pour vous aider à comprendre la crypto de manière responsable et sécurisée.
              Aucune connaissance technique préalable n&apos;est requise pour les cours débutants.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Contenu vérifié", "Progression adaptée", "Récompenses SNL"].map((tag) => (
                <span key={tag} className="text-[12px] px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.80)", border: "1px solid #BEDBFF", color: "#314158" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
}
