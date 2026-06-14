"use client";

import { useState, useEffect } from "react";
import Container from "./Container";
import { commissionsApi, getApiError } from "@/lib/api";

function fmt(n) {
  return Number(n ?? 0).toLocaleString("fr-FR");
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

export default function CommissionsSummary() {
  const [summary, setSummary] = useState(null);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      commissionsApi.getSummary(),
      commissionsApi.getMy({ limit: 5 }),
    ])
      .then(([sumRes, listRes]) => {
        setSummary(sumRes.data?.data ?? sumRes.data);
        const list = listRes.data?.data ?? listRes.data ?? [];
        setCommissions(Array.isArray(list) ? list.slice(0, 5) : []);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  const totalEarned = summary?.totalEarned ?? summary?.total ?? summary?.totalCommissions ?? 0;
  const pendingAmount = summary?.pending ?? summary?.pendingAmount ?? 0;
  const paidAmount = summary?.paid ?? summary?.paidAmount ?? 0;

  return (
    <section className="bg-[#F8FAFC] py-10">
      <Container>
        <h2 className="font-bold text-primary mb-1 text-[18px] lg:text-[24px]" style={{ lineHeight: "32px" }}>
          Mes commissions
        </h2>
        <p className="mb-6 text-[14px] lg:text-[16px]" style={{ color: "#45556C" }}>
          Gains issus de votre réseau de filleuls
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total gagné", value: totalEarned, color: "#10B981" },
            { label: "En attente", value: pendingAmount, color: "#F59E0B" },
            { label: "Versé",       value: paidAmount,   color: "#3B82F6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-[13px] text-slate-500 mb-2">{label}</p>
              {loading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <p className="font-bold text-[22px] lg:text-[26px]" style={{ color }}>
                  {fmt(value)} <span className="text-[14px] text-slate-400 font-normal">SNL</span>
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Recent commissions list */}
        {!loading && commissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-[15px]">Dernières commissions</h3>
            </div>
            {commissions.map((c, i) => {
              const date = c.createdAt ?? c.date ?? c.timestamp;
              const from = c.from?.firstName ?? c.referredUser?.firstName ?? c.userName ?? "—";
              const amount = c.amount ?? c.snlAmount ?? 0;
              const level = c.level ?? c.networkLevel ?? null;
              return (
                <div key={c.id ?? i} className={`flex items-center justify-between px-5 py-3 ${i < commissions.length - 1 ? "border-b border-slate-50" : ""}`}>
                  <div>
                    <p className="text-[13px] font-medium text-slate-700">{from}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {level && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                          Niveau {level}
                        </span>
                      )}
                      {date && <span className="text-[11px] text-slate-400">{new Date(date).toLocaleDateString("fr-FR")}</span>}
                    </div>
                  </div>
                  <span className="font-bold text-[14px] text-emerald-600">+{fmt(amount)} SNL</span>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
