"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ordersApi, getApiError } from "@/lib/api";

const STATUS_INFO = {
  PENDING:    { label: "Pending",    bg: "#FEF9C3", color: "#854D0E" },
  CONFIRMED:  { label: "Confirmed",  bg: "#D1FAE5", color: "#065F46" },
  PROCESSING: { label: "Processing", bg: "#DBEAFE", color: "#1E40AF" },
  SHIPPED:    { label: "Shipped",    bg: "#EDE9FE", color: "#4C1D95" },
  DELIVERED:  { label: "Delivered",  bg: "#DCFCE7", color: "#14532D" },
  CANCELLED:  { label: "Cancelled",  bg: "#FEE2E2", color: "#7F1D1D" },
  REFUNDED:   { label: "Refunded",   bg: "#F1F5F9", color: "#475569" },
};

function StatusBadge({ status }) {
  const info = STATUS_INFO[status] ?? { label: status, bg: "#F1F5F9", color: "#475569" };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: info.bg, color: info.color }}>
      {info.label}
    </span>
  );
}

function fmt(n) {
  return Number(n ?? 0).toLocaleString("en-US");
}

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function normalizeList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  if (raw?.orders && Array.isArray(raw.orders)) return raw.orders;
  if (raw?.items && Array.isArray(raw.items)) return raw.items;
  return [];
}

export default function ProfileCommandes() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    ordersApi.getMy({ limit: 10 })
      .then((res) => {
        const raw = res.data?.data ?? res.data;
        setOrders(normalizeList(raw));
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <h3 className="text-[18px] font-bold mb-4" style={{ color: "#0F172B" }}>My orders</h3>

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-[13px] text-red-500">{error}</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center py-8 gap-2">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[13px] text-slate-400">No orders yet</p>
          <Link href="/formations" className="text-[13px] font-semibold text-secondary hover:underline">
            Discover our courses →
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="flex flex-col divide-y divide-slate-50">
          {orders.map((order) => {
            const items = order.items ?? order.orderItems ?? [];
            const product = order.product ?? items[0]?.product ?? {};
            return (
              <div key={order.id} className="py-3 flex items-center gap-3">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color: "#0F172B" }}>
                    {product.name ?? order.productName ?? "Formation"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">{fmtDate(order.createdAt)}</span>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] font-semibold" style={{ color: "#1F4E46" }}>
                      {fmt(order.total ?? order.amount ?? order.price)} FCFA
                    </span>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
