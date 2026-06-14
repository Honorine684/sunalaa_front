"use client";

import { useEffect, useState } from "react";
import { usersApi, getApiError } from "@/lib/api";

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ProfileLoginHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PER_PAGE = 10;

  useEffect(() => {
    setLoading(true);
    usersApi.getLoginHistory({ page, limit: PER_PAGE })
      .then((res) => {
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.history ?? raw?.data ?? []);
        const total = raw?.total ?? raw?.totalCount ?? list.length;
        setHistory((prev) => page === 1 ? list : [...prev, ...list]);
        setHasMore(page * PER_PAGE < total);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#1F4E46" strokeWidth="2"/>
          <path d="M12 6v6l4 2" stroke="#1F4E46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-[16px] font-bold" style={{ color: "#1F4E46" }}>Login history</h2>
      </div>

      {error && <p className="text-red-400 text-[13px] mb-3">{error}</p>}

      {loading && page === 1 ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : history.length === 0 ? (
        <p className="text-slate-400 text-[14px] text-center py-8">No history available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Date", "Device", "IP", "Location", "Status"].map((h) => (
                    <th key={h} className="text-left pb-3 pr-4 font-semibold" style={{ color: "#64748B" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => {
                  const success = row?.success ?? row?.status === "success" ?? true;
                  return (
                    <tr key={row?.id ?? i} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                      <td className="py-3 pr-4 whitespace-nowrap" style={{ color: "#0F172B" }}>
                        {fmt(row?.createdAt ?? row?.loginAt ?? row?.date)}
                      </td>
                      <td className="py-3 pr-4" style={{ color: "#64748B" }}>
                        {row?.device ?? row?.userAgent?.split(" ")[0] ?? "—"}
                      </td>
                      <td className="py-3 pr-4 font-mono text-[12px]" style={{ color: "#94A3B8" }}>
                        {row?.ipAddress ?? row?.ip ?? "—"}
                      </td>
                      <td className="py-3 pr-4" style={{ color: "#64748B" }}>
                        {[row?.city, row?.country].filter(Boolean).join(", ") || row?.location || "—"}
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={success
                            ? { backgroundColor: "#ECFDF5", color: "#059669" }
                            : { backgroundColor: "#FFF1F2", color: "#E11D48" }}>
                          {success ? "Success" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <button onClick={() => setPage((p) => p + 1)} disabled={loading}
              className="mt-4 w-full py-2 rounded-xl text-[13px] border border-slate-200 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              style={{ color: "#45556C" }}>
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
