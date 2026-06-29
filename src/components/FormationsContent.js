"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "./Container";
import { productsApi, getApiError } from "@/lib/api";
import { useTranslations } from "next-intl";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.sunalaa.com/api/v1").replace("/api/v1", "");
function toAbsoluteUrl(url) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

/* ── Type badge (Vidéo / PDF / Zoom / Séminaire) ── */
const TYPE_INFO = {
  "vidéo":   { label: "Video",    color: "#3B82F6", bg: "#EFF6FF" },
  video:     { label: "Video",    color: "#3B82F6", bg: "#EFF6FF" },
  pdf:       { label: "PDF",      color: "#EF4444", bg: "#FEF2F2" },
  zoom:      { label: "Zoom",     color: "#10B981", bg: "#ECFDF5" },
  séminaire: { label: "Seminar",  color: "#8B5CF6", bg: "#F5F3FF" },
  seminaire: { label: "Seminar",  color: "#8B5CF6", bg: "#F5F3FF" },
};

function TypeBadge({ type }) {
  if (!type) return null;
  const info = TYPE_INFO[String(type).toLowerCase()];
  if (!info) return null;
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg"
      style={{ backgroundColor: info.bg, color: info.color }}>
      {info.label}
    </span>
  );
}

function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  return raw?.items ?? raw?.products ?? raw?.data ?? raw?.results ?? [];
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-slate-200" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 bg-slate-200 rounded w-20" />
        <div className="h-5 bg-slate-200 rounded w-full" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-10 bg-slate-200 rounded-xl mt-2" />
      </div>
    </div>
  );
}

function CourseCard({ product, t }) {
  const image   = toAbsoluteUrl(product?.images?.[0] ?? null);
  const title   = product?.name ?? "—";
  const desc    = product?.shortDesc ?? product?.description ?? "";
  const snl     = product?.pv ?? product?.points ?? null;
  const locked  = product?.status !== "ACTIVE";
  const type    = product?.type ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:scale-[1.02] hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-[16/9] w-full bg-slate-100">
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1F4E46, #3FAE8C)" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.4">
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {locked && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-white font-semibold text-[13px]">{t("locked_course")}</p>
          </div>
        )}

        {snl && !locked && (
          <div className="absolute flex items-center bg-[#E6B84C] text-white"
            style={{ top: 12, right: 12, height: 32, borderRadius: 8, paddingLeft: 12, paddingRight: 12, gap: 4, fontSize: 14, fontWeight: 400 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="9" r="5" stroke="white" strokeWidth="2"/>
              <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +{snl} SNL
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {type && (
          <div className="mb-3">
            <TypeBadge type={type} />
          </div>
        )}
        <h3 className="mb-2" style={{ fontSize: 16, fontWeight: 400, lineHeight: "28px", letterSpacing: "-0.64px", color: "#0F1119" }}>
          {title}
        </h3>
        {desc && (
          <p className="mb-4 line-clamp-2" style={{ fontSize: 14, fontWeight: 400, lineHeight: "22.75px", letterSpacing: "-0.15px", color: "#495360" }}>
            {desc}
          </p>
        )}

        {locked ? (
          <button disabled className="w-full bg-slate-100 text-slate-400 text-[14px] font-normal py-3 rounded-xl cursor-default">
            {t("locked")}
          </button>
        ) : (
          <Link href={`/formations/${product.id}`}
            className="block w-full bg-secondary text-white font-normal text-center hover:brightness-110 transition cursor-pointer"
            style={{ height: 40, borderRadius: 10, fontSize: 14, fontWeight: 400, lineHeight: "40px", letterSpacing: "-0.15px", boxShadow: "0 2px 2px -4px rgba(0,0,0,0.95), 0 4px 8px -1px rgba(0,0,0,0.35)" }}>
            {t("start_course")}
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FormationsContent() {
  const t = useTranslations("FormationsContent");
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch]         = useState("");

  useEffect(() => {
    Promise.allSettled([
      productsApi.getAll({ limit: 50 }),
      productsApi.getCategories(),
    ]).then(([productsRes, categoriesRes]) => {
      if (productsRes.status === "fulfilled") {
        const raw = productsRes.value.data?.data ?? productsRes.value.data;
        setProducts(normalizeList(raw));
      } else {
        setError(getApiError(productsRes.reason));
      }
      if (categoriesRes.status === "fulfilled") {
        const raw = categoriesRes.value.data?.data ?? categoriesRes.value.data;
        setCategories(normalizeList(raw));
      }
    }).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchFilter = activeFilter === "all" || p.categoryId === activeFilter;
    const matchSearch = !search || (p.name ?? "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const available = products.filter(p => p.status === "ACTIVE").length;
  const totalSnl  = products.reduce((sum, p) => sum + Number(p.pv ?? 0), 0);

  return (
    <div id="formations" className="relative bg-white overflow-hidden">

      {/* Concentric ellipses — left */}
      <div className="hidden lg:block absolute left-47 top-[185px] pointer-events-none select-none z-0">
        {[338, 281, 224, 140].map((size) => (
          <div key={size} className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }} />
        ))}
      </div>

      {/* Concentric ellipses — right */}
      <div className="hidden lg:block absolute right-[12%] top-[200px] pointer-events-none select-none z-0">
        {[338, 281, 224, 140].map((size) => (
          <div key={size} className="absolute rounded-full border border-secondary/20"
            style={{ width: size, height: size, right: -size / 2, top: -size / 2 }} />
        ))}
      </div>

      <Container className="relative z-10 pt-12 pb-16">

        {/* Section header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[18px] lg:text-[22px] font-bold text-slate-900">{t("section_title")}</h2>
            <p className="text-slate-400 text-[12px] lg:text-[13px] mt-0.5">
              {t("section_sub")}
            </p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: t("stat_courses"),
              value: loading ? "—" : String(products.length),
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/></svg>,
            },
            {
              label: t("stat_available"),
              value: loading ? "—" : String(available),
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="2"/><path d="M20 6L9 17l-5-5" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            },
            {
              label: t("stat_rewards"),
              value: loading ? "—" : `${totalSnl.toLocaleString("en-US")} SNL`,
              icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5" stroke="#E6B84C" strokeWidth="2"/><path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="#E6B84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary rounded-2xl px-4 py-4 lg:px-6 lg:py-5">
              <div className="flex items-center gap-2 text-white text-[12px] lg:text-[13px] font-normal mb-2">
                {stat.icon}{stat.label}
              </div>
              <p className="text-white text-[22px] lg:text-[28px] font-bold leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter bar + search */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 px-5 w-full sm:w-auto scrollbar-none">
            <button
              onClick={() => setActiveFilter("all")}
              style={activeFilter === "all"
                ? { height: 39, borderRadius: 10, paddingLeft: 16, paddingRight: 16 }
                : { height: 39, borderRadius: 10, paddingLeft: 16, paddingRight: 16, backgroundColor: "#F8FAFC", border: "1px solid #E2E8FC" }}
              className={`flex items-center text-[13px] font-normal whitespace-nowrap transition cursor-pointer ${activeFilter === "all" ? "bg-secondary text-white" : "text-slate-500 hover:brightness-95"}`}>
              {t("filter_all")}
            </button>
            {categories.map((cat) => (
              <button key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={activeFilter === cat.id
                  ? { height: 39, borderRadius: 10, paddingLeft: 16, paddingRight: 16 }
                  : { height: 39, borderRadius: 10, paddingLeft: 16, paddingRight: 16, backgroundColor: "#F8FAFC", border: "1px solid #E2E8FC" }}
                className={`flex items-center text-[13px] font-normal whitespace-nowrap transition cursor-pointer ${activeFilter === cat.id ? "bg-secondary text-white" : "text-slate-500 hover:brightness-95"}`}>
                {cat.name ?? cat.label ?? cat.id}
              </button>
            ))}
          </div>

          <div className="shrink-0 w-full sm:w-[260px] px-5 sm:px-0 sm:pr-5">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full bg-white border border-secondary text-slate-700 placeholder:text-[#0A0A0A]/50 rounded-xl pl-9 pr-4 outline-none focus:ring-2 focus:ring-secondary/30 transition"
                style={{ fontSize: 14, fontWeight: 400, lineHeight: "100%", paddingTop: 10, paddingBottom: 10 }} />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-[13px]" style={{ backgroundColor: "#FFF1F2", color: "#E11D48", border: "1px solid #FFE4E6" }}>
            {error}
          </div>
        )}

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className="col-span-3 text-center py-16 text-slate-400 text-[14px]">
              {search ? t("no_results", { search }) : t("no_courses")}
            </div>
          ) : (
            filtered.map((product) => <CourseCard key={product.id} product={product} t={t} />)
          )}
        </div>

        {/* Bottom info banner */}
        <div className="bg-primary rounded-3xl px-5 py-5 lg:px-8 lg:py-7 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white mb-1" style={{ fontSize: 16, fontWeight: 400, lineHeight: "24px", letterSpacing: "-0.31px" }}>
              {t("tip_title")}
            </h3>
            <p className="mb-4" style={{ fontSize: 14, fontWeight: 400, lineHeight: "22.75px", color: "#FFFFFF" }}>
              {t("tip_desc")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[t("tag_verified"), t("tag_adaptive"), t("tag_rewards")].map((tag) => (
                <span key={tag} className="text-[12px] px-3 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.80)", border: "1px solid #BEDBFF", color: "#314158" }}>
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
