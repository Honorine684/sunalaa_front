"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";

/* ── Course data (same as FormationsContent) ── */
const courses = [
  {
    id: 1,
    title: "Introduction à la Blockchain",
    desc: "Découvrez les bases de la technologie blockchain, son fonctionnement et ses applications dans le monde réel. Ce cours vous donnera une compréhension solide des concepts fondamentaux.",
    level: "Débutant",
    duration: "45 min",
    snl: 50,
    locked: false,
    image: "/images/cours1.jpg",
    category: "debutant",
    lessons: [
      { title: "Qu'est-ce que la Blockchain ?", duration: "8 min", done: true },
      { title: "Comment fonctionne un bloc ?", duration: "10 min", done: true },
      { title: "La décentralisation expliquée", duration: "9 min", done: false },
      { title: "Cas d'usage réels", duration: "10 min", done: false },
      { title: "Quiz final", duration: "8 min", done: false },
    ],
    skills: ["Comprendre la blockchain", "Identifier les cas d'usage", "Distinguer chaînes publiques et privées", "Lire un bloc d'informations"],
    instructor: { name: "Équipe SUNALAA", role: "Experts Blockchain" },
  },
  {
    id: 2,
    title: "Les Cryptomonnaies pour Débutants",
    desc: "Comprenez ce que sont les cryptomonnaies, comment elles fonctionnent et comment les utiliser de manière sécurisée au quotidien.",
    level: "Débutant",
    duration: "1h 15min",
    snl: 75,
    locked: false,
    image: "/images/cours2.jpg",
    category: "debutant",
    lessons: [
      { title: "Bitcoin : l'origine", duration: "12 min", done: false },
      { title: "Altcoins & tokens", duration: "15 min", done: false },
      { title: "Wallets et sécurité", duration: "18 min", done: false },
      { title: "Acheter sa première crypto", duration: "20 min", done: false },
      { title: "Quiz final", duration: "10 min", done: false },
    ],
    skills: ["Comprendre Bitcoin", "Gérer un wallet", "Acheter et vendre", "Sécuriser ses fonds"],
    instructor: { name: "Équipe SUNALAA", role: "Experts Crypto" },
  },
  {
    id: 3,
    title: "Sécuriser vos Actifs Numériques",
    desc: "Apprenez les meilleures pratiques pour protéger vos cryptomonnaies et éviter les arnaques les plus courantes.",
    level: "Débutant",
    duration: "50 min",
    snl: 100,
    locked: false,
    image: "/images/cours3.jpg",
    category: "debutant",
    lessons: [
      { title: "Les menaces les plus fréquentes", duration: "10 min", done: false },
      { title: "Sécuriser son wallet", duration: "12 min", done: false },
      { title: "2FA et bonnes pratiques", duration: "14 min", done: false },
      { title: "Cold vs Hot wallet", duration: "8 min", done: false },
      { title: "Quiz final", duration: "6 min", done: false },
    ],
    skills: ["Identifier les arnaques", "Configurer le 2FA", "Choisir son wallet", "Protéger ses clés privées"],
    instructor: { name: "Équipe SUNALAA", role: "Experts Sécurité" },
  },
];

const levelColors = {
  Débutant:      { bg: "#D0F4E5", border: "#AAF4CF", text: "#16a34a" },
  Intermédiaire: { bg: "#DBEAFE", border: "#93C5FD", text: "#3B82F6" },
  Avancé:        { bg: "#EDE9FE", border: "#C4B5FD", text: "#7C3AED" },
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === Number(id)) ?? courses[0];
  const done = course.lessons.filter((l) => l.done).length;
  const progress = Math.round((done / course.lessons.length) * 100);
  const lc = levelColors[course.level] ?? levelColors["Débutant"];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── HERO ── */}
      <div className="relative bg-primary overflow-hidden" style={{ minHeight: 380 }}>

        {/* Concentric circles — left */}
        <div className="absolute pointer-events-none select-none" style={{ left: -80, top: "50%", transform: "translateY(-50%)" }}>
          {[520, 400, 290, 180].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/10"
              style={{ width: s, height: s, left: -s / 2, top: -s / 2 }} />
          ))}
        </div>

        {/* Concentric circles — right */}
        <div className="absolute pointer-events-none select-none" style={{ right: -100, top: "30%" }}>
          {[420, 310, 210, 120].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/10"
              style={{ width: s, height: s, right: -s / 2, top: -s / 2 }} />
          ))}
        </div>

        <Container className="relative z-10 py-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/formations" className="text-white/50 text-[13px] hover:text-white transition flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Formations
            </Link>
            <span className="text-white/30 text-[13px]">/</span>
            <span className="text-white/70 text-[13px] truncate max-w-[220px]">{course.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left — info */}
            <div className="flex-1 min-w-0">
              {/* Level badge */}
              <span className="inline-flex items-center text-[12px] font-medium px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                {course.level}
              </span>

              <h1 className="text-white mb-4" style={{ fontSize: 36, fontWeight: 700, lineHeight: "110%", letterSpacing: "-0.5px" }}>
                {course.title}
              </h1>

              <p className="mb-6" style={{ fontSize: 16, fontWeight: 400, lineHeight: "160%", color: "rgba(255,255,255,0.65)", maxWidth: 560 }}>
                {course.desc}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, label: course.duration },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, label: `${course.lessons.length} leçons` },
                  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2"/><path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: `+${course.snl} SNL` },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80 text-[13px]"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: "1px solid rgba(255,255,255,0.15)" }}>
                    {m.icon}
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — card action */}
            <div className="w-full lg:w-[320px] shrink-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Course thumbnail */}
                <div className="relative w-full" style={{ height: 160 }}>
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-primary/30" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1F4E46">
                        <path d="M5 3l14 9-14 9V3z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Progress */}
                  {done > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[12px] mb-1.5" style={{ color: "#64748B" }}>
                        <span>{done}/{course.lessons.length} leçons complétées</span>
                        <span className="font-semibold" style={{ color: "#1F4E46" }}>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* SNL reward */}
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <div className="w-8 h-8 rounded-full bg-[#E6B84C] flex items-center justify-center shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
                        <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500">Récompense à la fin</p>
                      <p className="text-[15px] font-bold" style={{ color: "#92400E" }}>+{course.snl} SNL</p>
                    </div>
                  </div>

                  <button className="w-full bg-primary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition cursor-pointer">
                    {done > 0 ? "Continuer la formation" : "Commencer la formation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ── BODY ── */}
      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left column */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">

            {/* Ce que vous allez apprendre */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="mb-5" style={{ fontSize: 20, fontWeight: 700, color: "#0F172B" }}>Ce que vous allez apprendre</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.skills.map((skill, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "150%", color: "#334155" }}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="mb-5" style={{ fontSize: 20, fontWeight: 700, color: "#0F172B" }}>Programme du cours</h2>
              <div className="relative flex flex-col gap-0">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-6 bottom-6 w-px bg-slate-100" />

                {course.lessons.map((lesson, i) => (
                  <div key={i} className="flex items-center gap-4 py-3.5 relative">
                    {/* Circle indicator */}
                    <div className={[
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2",
                      lesson.done
                        ? "bg-secondary border-secondary"
                        : i === done
                          ? "bg-white border-secondary"
                          : "bg-white border-slate-200",
                    ].join(" ")}>
                      {lesson.done ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 600, color: i === done ? "#3FAE8C" : "#94A3B8" }}>{i + 1}</span>
                      )}
                    </div>

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: lesson.done ? 500 : 400, color: lesson.done ? "#0F172B" : "#334155" }}>
                        {lesson.title}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-1 shrink-0" style={{ fontSize: 12, color: "#94A3B8" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      {lesson.duration}
                    </div>

                    {/* Status badge */}
                    {lesson.done && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "#D0F4E5", color: "#16a34a" }}>
                        Terminé
                      </span>
                    )}
                    {!lesson.done && i === done && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full shrink-0 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0", color: "#15803D" }}>
                        En cours
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — sticky sidebar */}
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-5">

            {/* Instructor */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="mb-4" style={{ fontSize: 15, fontWeight: 700, color: "#0F172B" }}>Instructeur</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-[16px]">
                  S
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172B" }}>{course.instructor.name}</p>
                  <p style={{ fontSize: 12, fontWeight: 400, color: "#94A3B8" }}>{course.instructor.role}</p>
                </div>
              </div>
            </div>

            {/* Détails du cours */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="mb-4" style={{ fontSize: 15, fontWeight: 700, color: "#0F172B" }}>Détails du cours</h3>
              {[
                { label: "Niveau", value: course.level },
                { label: "Durée totale", value: course.duration },
                { label: "Leçons", value: `${course.lessons.length} modules` },
                { label: "Récompense", value: `+${course.snl} SNL` },
                { label: "Langue", value: "Français" },
              ].map((d, i) => (
                <div key={i} className={`flex justify-between py-2.5 ${i < 4 ? "border-b border-slate-50" : ""}`}>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>{d.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{d.value}</span>
                </div>
              ))}
            </div>

            {/* Cercles décoratifs */}
            <div className="relative bg-primary rounded-2xl p-5 overflow-hidden">
              <div className="absolute pointer-events-none" style={{ right: -30, bottom: -30 }}>
                {[140, 100, 65].map((s) => (
                  <div key={s} className="absolute rounded-full border border-white/10"
                    style={{ width: s, height: s, right: -s / 2, bottom: -s / 2 }} />
                ))}
              </div>
              <p className="text-white text-[13px] font-semibold mb-1 relative z-10">Complétez ce cours</p>
              <p className="text-white/60 text-[12px] mb-3 relative z-10">Gagnez {course.snl} SNL en terminant toutes les leçons.</p>
              <button className="relative z-10 w-full bg-secondary text-white text-[13px] font-semibold py-2.5 rounded-xl hover:brightness-110 transition cursor-pointer">
                {done > 0 ? "Continuer" : "Commencer"}
              </button>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
