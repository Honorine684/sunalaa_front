"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { productsApi, ordersApi, getApiError } from "@/lib/api";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1").replace("/api/v1", "");
function toAbsoluteUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

const TYPE_INFO = {
  "vidéo":   { label: "Vidéo",     color: "#3B82F6", bg: "#EFF6FF" },
  video:     { label: "Vidéo",     color: "#3B82F6", bg: "#EFF6FF" },
  pdf:       { label: "PDF",       color: "#EF4444", bg: "#FEF2F2" },
  zoom:      { label: "Zoom",      color: "#10B981", bg: "#ECFDF5" },
  séminaire: { label: "Séminaire", color: "#8B5CF6", bg: "#F5F3FF" },
  seminaire: { label: "Séminaire", color: "#8B5CF6", bg: "#F5F3FF" },
};

function fmt(n) {
  return Number(n ?? 0).toLocaleString("fr-FR");
}

function SkeletonDetail() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-pulse">
      <div className="bg-primary" style={{ minHeight: 380 }} />
      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-3">
              <div className="h-6 bg-slate-200 rounded w-48" />
              {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-slate-200 rounded w-full" />)}
            </div>
          </div>
          <div className="w-full lg:w-[300px] flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-5 h-64" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [ordering, setOrdering]   = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError]     = useState("");

  useEffect(() => {
    productsApi.getOne(id)
      .then((res) => setProduct(res.data?.data ?? res.data))
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonDetail />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-[15px]">{error || "Formation introuvable."}</p>
        <Link href="/formations" className="text-secondary text-[14px] hover:underline">
          ← Retour aux formations
        </Link>
      </div>
    );
  }

  const image       = toAbsoluteUrl(product?.images?.[0] ?? null);
  const title       = product?.name ?? "—";
  const description = product?.description ?? product?.shortDesc ?? "";
  const snl         = product?.pv ?? product?.points ?? null;
  const price       = product?.price ?? null;
  const type        = product?.type ?? null;
  const typeInfo    = type ? (TYPE_INFO[String(type).toLowerCase()] ?? null) : null;
  const skills      = product?.skills ?? product?.objectives ?? [];
  const lessons     = product?.lessons ?? product?.modules ?? [];
  const contentUrl  = product?.contentUrl ?? product?.videoUrl ?? product?.pdfUrl ?? product?.zoomLink ?? null;
  const instructor  = product?.instructor ?? { name: "Équipe SUNALA", role: "Experts Blockchain" };
  const locked      = product?.status !== "ACTIVE";

  const done     = lessons.filter((l) => l.done).length;
  const progress = lessons.length > 0 ? Math.round((done / lessons.length) * 100) : 0;
  const isPaid   = price != null && price > 0;

  async function handleOrder() {
    let token = null;
    try { token = typeof window !== "undefined" ? localStorage.getItem("snl_access_token") : null; } catch {};
    if (!token) {
      router.push(`/login?redirect=/formations/${id}`);
      return;
    }
    setOrdering(true);
    setOrderError("");
    try {
      await ordersApi.create({
        items: [{ productId: product.id, quantity: 1 }],
        paymentMethod: "CREDIT_CARD",
      });
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(getApiError(err));
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── HERO ── */}
      <div className="relative bg-primary overflow-hidden" style={{ minHeight: 380 }}>

        <div className="absolute pointer-events-none select-none" style={{ left: -80, top: "50%", transform: "translateY(-50%)" }}>
          {[520, 400, 290, 180].map((s) => (
            <div key={s} className="absolute rounded-full border border-white/10"
              style={{ width: s, height: s, left: -s / 2, top: -s / 2 }} />
          ))}
        </div>
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
            <span className="text-white/70 text-[13px] truncate max-w-[220px]">{title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left — info */}
            <div className="flex-1 min-w-0">
              {typeInfo && (
                <span className="inline-flex items-center text-[12px] font-medium px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
                  {typeInfo.label}
                </span>
              )}

              <h1 className="text-white mb-4" style={{ fontSize: 36, fontWeight: 700, lineHeight: "110%", letterSpacing: "-0.5px" }}>
                {title}
              </h1>

              {description && (
                <p className="mb-6" style={{ fontSize: 16, fontWeight: 400, lineHeight: "160%", color: "rgba(255,255,255,0.65)", maxWidth: 560 }}>
                  {description}
                </p>
              )}

              {/* Meta pills */}
              <div className="flex flex-wrap gap-3">
                {lessons.length > 0 && (
                  <div className="flex items-center gap-2 text-white/80 text-[13px]"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: "1px solid rgba(255,255,255,0.15)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {lessons.length} leçon{lessons.length > 1 ? "s" : ""}
                  </div>
                )}
                {snl && (
                  <div className="flex items-center gap-2 text-white/80 text-[13px]"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: "1px solid rgba(255,255,255,0.15)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    +{fmt(snl)} SNL
                  </div>
                )}
                {price != null && price > 0 && (
                  <div className="flex items-center gap-2 text-white/80 text-[13px]"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6, border: "1px solid rgba(255,255,255,0.15)" }}>
                    {fmt(price)} FCFA
                  </div>
                )}
              </div>
            </div>

            {/* Right — action card */}
            <div className="w-full lg:w-[320px] shrink-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative w-full" style={{ height: 160 }}>
                  {image ? (
                    <>
                      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-primary/30" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1F4E46, #3FAE8C)" }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.5">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {/* Play / content icon */}
                  {!locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        {type?.toLowerCase() === "pdf" ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1F4E46">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#1F4E46" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#1F4E46" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1F4E46">
                            <path d="M5 3l14 9-14 9V3z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Progress */}
                  {done > 0 && lessons.length > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[12px] mb-1.5" style={{ color: "#64748B" }}>
                        <span>{done}/{lessons.length} leçons complétées</span>
                        <span className="font-semibold" style={{ color: "#1F4E46" }}>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* SNL reward */}
                  {snl && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                      <div className="w-8 h-8 rounded-full bg-[#E6B84C] flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
                          <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Récompense à la fin</p>
                        <p className="text-[15px] font-bold" style={{ color: "#92400E" }}>+{fmt(snl)} SNL</p>
                      </div>
                    </div>
                  )}

                  {locked ? (
                    <button disabled className="w-full bg-slate-100 text-slate-400 text-[15px] font-semibold py-3.5 rounded-xl cursor-default">
                      Verrouillée
                    </button>
                  ) : orderSuccess ? (
                    <div className="flex flex-col items-center gap-2 py-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="text-[13px] font-semibold text-green-700">Commande envoyée !</p>
                      <p className="text-[12px] text-slate-500 text-center">Vous serez contacté pour finaliser le paiement.</p>
                    </div>
                  ) : isPaid ? (
                    <>
                      <button
                        onClick={handleOrder}
                        disabled={ordering}
                        className="w-full bg-secondary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-default"
                      >
                        {ordering ? "Traitement…" : `Commander — ${fmt(price)} FCFA`}
                      </button>
                      {orderError && (
                        <p className="mt-2 text-[12px] text-red-500 text-center">{orderError}</p>
                      )}
                    </>
                  ) : contentUrl ? (
                    <a href={contentUrl} target="_blank" rel="noopener noreferrer"
                      className="block w-full bg-primary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition text-center cursor-pointer">
                      {type?.toLowerCase() === "pdf" ? "Ouvrir le PDF" : type?.toLowerCase() === "zoom" ? "Rejoindre le Zoom" : "Commencer"}
                    </a>
                  ) : (
                    <button className="w-full bg-primary text-white font-semibold text-[15px] py-3.5 rounded-xl hover:brightness-110 transition cursor-pointer">
                      {done > 0 ? "Continuer la formation" : "Commencer la formation"}
                    </button>
                  )}
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
            {skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-bold" style={{ color: "#0F172B" }}>Ce que vous allez apprendre</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((skill, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "150%", color: "#334155" }}>
                        {typeof skill === "string" ? skill : skill?.title ?? skill?.name ?? ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Programme */}
            {lessons.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-bold" style={{ color: "#0F172B" }}>Programme du cours</h2>
                <div className="relative flex flex-col gap-0">
                  <div className="absolute left-[19px] top-6 bottom-6 w-px bg-slate-100" />
                  {lessons.map((lesson, i) => (
                    <div key={i} className="flex items-center gap-4 py-3.5 relative">
                      <div className={[
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2",
                        lesson.done ? "bg-secondary border-secondary" : i === done ? "bg-white border-secondary" : "bg-white border-slate-200",
                      ].join(" ")}>
                        {lesson.done ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 600, color: i === done ? "#3FAE8C" : "#94A3B8" }}>{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 14, fontWeight: lesson.done ? 500 : 400, color: lesson.done ? "#0F172B" : "#334155" }}>
                          {lesson.title ?? lesson.name ?? `Leçon ${i + 1}`}
                        </p>
                      </div>
                      {lesson.duration && (
                        <div className="flex items-center gap-1 shrink-0" style={{ fontSize: 12, color: "#94A3B8" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {lesson.duration}
                        </div>
                      )}
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
            )}

            {/* Aucun contenu structuré — affiche la description complète */}
            {skills.length === 0 && lessons.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="mb-4 text-[18px] font-bold" style={{ color: "#0F172B" }}>À propos de cette formation</h2>
                {description ? (
                  <p style={{ fontSize: 15, fontWeight: 400, lineHeight: "170%", color: "#334155", whiteSpace: "pre-wrap" }}>
                    {description}
                  </p>
                ) : (
                  <p className="text-slate-400 text-[14px]">Le contenu détaillé de cette formation sera disponible prochainement.</p>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-full lg:w-[300px] shrink-0 flex flex-col gap-5">

            {/* Instructeur */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="mb-4 text-[15px] font-bold" style={{ color: "#0F172B" }}>Instructeur</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-[16px]">
                  {(instructor?.name ?? "S")[0]}
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: "#0F172B" }}>{instructor?.name ?? "Équipe SUNALA"}</p>
                  <p className="text-[12px]" style={{ color: "#94A3B8" }}>{instructor?.role ?? "Experts Blockchain"}</p>
                </div>
              </div>
            </div>

            {/* Détails */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="mb-4 text-[15px] font-bold" style={{ color: "#0F172B" }}>Détails</h3>
              {[
                typeInfo && { label: "Type", value: typeInfo.label },
                lessons.length > 0 && { label: "Leçons", value: `${lessons.length} modules` },
                snl && { label: "Récompense", value: `+${fmt(snl)} SNL` },
                price != null && price > 0 && { label: "Prix", value: `${fmt(price)} FCFA` },
              ].filter(Boolean).map((d, i, arr) => (
                <div key={i} className={`flex justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <span className="text-[13px]" style={{ color: "#94A3B8" }}>{d.label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: "#334155" }}>{d.value}</span>
                </div>
              ))}
            </div>

            {/* CTA card */}
            {snl && !locked && (
              <div className="relative bg-primary rounded-2xl p-5 overflow-hidden">
                <div className="absolute pointer-events-none" style={{ right: -30, bottom: -30 }}>
                  {[140, 100, 65].map((s) => (
                    <div key={s} className="absolute rounded-full border border-white/10"
                      style={{ width: s, height: s, right: -s / 2, bottom: -s / 2 }} />
                  ))}
                </div>
                <p className="text-white text-[13px] font-semibold mb-1 relative z-10">Complétez ce cours</p>
                <p className="text-white/60 text-[12px] mb-3 relative z-10">Gagnez {fmt(snl)} SNL en terminant la formation.</p>

                {orderSuccess ? (
                  <p className="relative z-10 text-white/80 text-[12px] font-semibold text-center py-2">
                    ✓ Commande envoyée !
                  </p>
                ) : isPaid ? (
                  <button
                    onClick={handleOrder}
                    disabled={ordering}
                    className="relative z-10 w-full bg-secondary text-white text-[13px] font-semibold py-2.5 rounded-xl hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-default"
                  >
                    {ordering ? "Traitement…" : `Commander — ${fmt(price)} FCFA`}
                  </button>
                ) : contentUrl ? (
                  <a href={contentUrl} target="_blank" rel="noopener noreferrer"
                    className="relative z-10 block w-full bg-secondary text-white text-[13px] font-semibold py-2.5 rounded-xl hover:brightness-110 transition text-center cursor-pointer">
                    Accéder au contenu
                  </a>
                ) : (
                  <button className="relative z-10 w-full bg-secondary text-white text-[13px] font-semibold py-2.5 rounded-xl hover:brightness-110 transition cursor-pointer">
                    {done > 0 ? "Continuer" : "Commencer"}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </Container>
    </div>
  );
}
