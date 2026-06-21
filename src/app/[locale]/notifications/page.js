"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Container from "@/components/Container";
import { useAuth } from "@/context/AuthContext";
import { notificationsApi } from "@/lib/api";

const PAGE_SIZE = 20;

function timeAgo(dateStr, locale) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return locale === "fr" ? "À l'instant" : "Just now";
  if (m < 60) return locale === "fr" ? `Il y a ${m} min` : `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return locale === "fr" ? `Il y a ${h}h` : `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return locale === "fr" ? `Il y a ${d}j` : `${d}d ago`;
  return new Date(dateStr).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function NotificationsPage() {
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unread, setUnread] = useState(0);

  const prefix = locale === "fr" ? "/fr" : "";

  const fetchPage = useCallback(async (p, replace = false) => {
    try {
      const res = await notificationsApi.getAll({ page: p, limit: PAGE_SIZE });
      const raw = res.data?.data ?? res.data;
      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.items) ? raw.items
        : Array.isArray(raw?.notifications) ? raw.notifications
        : Array.isArray(raw?.data) ? raw.data
        : [];
      const total = raw?.total ?? raw?.totalCount ?? null;
      setNotifications((prev) => replace ? list : [...prev, ...list]);
      setHasMore(total != null ? (p * PAGE_SIZE) < total : list.length === PAGE_SIZE);
    } catch {
      setHasMore(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { router.replace(`${prefix}/login`); return; }
    setLoading(true);
    Promise.all([
      fetchPage(1, true),
      notificationsApi.getUnreadCount().catch(() => null),
    ]).then(([, countRes]) => {
      const count = countRes?.data?.data?.count ?? countRes?.data?.count ?? 0;
      setUnread(Number(count) || 0);
    }).finally(() => setLoading(false));
  }, [isAuthenticated]);

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    await fetchPage(next);
    setPage(next);
    setLoadingMore(false);
  }

  async function handleMarkRead(id) {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true, isRead: true } : n));
      setUnread((prev) => Math.max(0, prev - 1));
    } catch {/* noop */}
  }

  async function handleMarkAllRead() {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
      setUnread(0);
    } catch {/* noop */}
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    try {
      await notificationsApi.delete(id);
      const notif = notifications.find((n) => n.id === id);
      const wasUnread = !(notif?.read ?? notif?.isRead ?? false);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnread((prev) => Math.max(0, prev - 1));
    } catch {/* noop */}
  }

  const t = {
    title: locale === "fr" ? "Notifications" : "Notifications",
    markAll: locale === "fr" ? "Tout marquer lu" : "Mark all read",
    empty: locale === "fr" ? "Aucune notification" : "No notifications",
    loadMore: locale === "fr" ? "Voir plus" : "Load more",
    back: locale === "fr" ? "Retour" : "Back",
    unreadLabel: (n) => locale === "fr" ? `${n} non lue${n > 1 ? "s" : ""}` : `${n} unread`,
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="py-8">
          <Container>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div>
                  <h1 className="text-[20px] font-bold" style={{ color: "#0F172B" }}>{t.title}</h1>
                  {unread > 0 && (
                    <p className="text-[12px]" style={{ color: "#3FAE8C" }}>{t.unreadLabel(unread)}</p>
                  )}
                </div>
              </div>
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[13px] font-medium px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                  style={{ color: "#475569" }}
                >
                  {t.markAll}
                </button>
              )}
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16">
                  <svg className="animate-spin w-7 h-7" style={{ color: "#3FAE8C" }} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" opacity="0.3">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[14px]" style={{ color: "#94A3B8" }}>{t.empty}</p>
                </div>
              ) : (
                <>
                  {notifications.map((n, i) => {
                    const isRead = n.read ?? n.isRead ?? false;
                    return (
                      <div
                        key={n.id ?? i}
                        className={`px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer flex items-start gap-4 group ${!isRead ? "bg-secondary/5" : ""}`}
                        onClick={() => !isRead && handleMarkRead(n.id)}
                      >
                        {/* Dot */}
                        <div className="mt-1.5 shrink-0">
                          <div className={`w-2 h-2 rounded-full ${!isRead ? "bg-secondary" : "bg-transparent border border-slate-200"}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {(() => {
                            const title = n.title ?? null;
                            const body  = n.body ?? n.description ?? n.message ?? n.content ?? null;
                            const displayTitle = title ?? body ?? (locale === "fr" ? "Nouvelle notification" : "New notification");
                            const displayBody  = title ? body : null;
                            return (
                              <>
                                <p className={`text-[14px] leading-snug ${!isRead ? "font-semibold text-slate-800" : "font-medium text-slate-600"}`}>
                                  {displayTitle}
                                </p>
                                {displayBody && (
                                  <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{displayBody}</p>
                                )}
                              </>
                            );
                          })()}
                          <p className="text-[12px] mt-1.5" style={{ color: "#94A3B8" }}>
                            {timeAgo(n.createdAt ?? n.date, locale)}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={(e) => handleDelete(e, n.id)}
                          className="opacity-0 group-hover:opacity-100 transition text-slate-300 hover:text-red-400 shrink-0 cursor-pointer mt-0.5"
                          aria-label="Supprimer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  {hasMore && (
                    <div className="flex justify-center py-5">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold border border-slate-200 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                        style={{ color: "#475569" }}
                      >
                        {loadingMore ? (
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        {loadingMore
                          ? (locale === "fr" ? "Chargement..." : "Loading...")
                          : t.loadMore}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
}
