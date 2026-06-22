"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { notificationsApi } from "@/lib/api";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

const BELL_BODY_LIMIT = 80;

function NotifDetailModal({ notif, onClose }) {
  const body = notif.body ?? notif.description ?? notif.message ?? notif.content ?? null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,43,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold leading-snug pr-3" style={{ color: "#0F172B" }}>
            {notif.title ?? body}
          </h3>
          <button onClick={onClose} className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full hover:bg-slate-100 transition cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#45556C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex flex-col gap-3">
          {notif.imageUrl && (() => {
            const url = notif.imageUrl;
            const lower = url.toLowerCase().split("?")[0];
            if (/\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/.test(lower)) return (
              <video src={url} controls className="w-full max-h-40 rounded-xl border border-slate-100 bg-black" />
            );
            if (/\.pdf$/.test(lower)) return (
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] font-semibold hover:underline" style={{ color: "#EF4444" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Ouvrir le PDF
              </a>
            );
            return <img src={url} alt="" className="w-full max-h-40 object-cover rounded-xl border border-slate-100" onError={(e) => { e.currentTarget.style.display = "none"; }} />;
          })()}
          {notif.title && body && (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "#45556C" }}>{body}</p>
          )}
          <p className="text-[11px]" style={{ color: "#94A3B8" }}>{timeAgo(notif.createdAt ?? notif.date)}</p>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl border text-[13px] font-semibold hover:bg-slate-50 transition cursor-pointer" style={{ borderColor: "#E2E8F0", color: "#45556C" }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const locale = useLocale();
  const prefix = locale === "fr" ? "/fr" : "";
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    notificationsApi.getUnreadCount()
      .then((res) => {
        const count = res.data?.data?.count ?? res.data?.count ?? res.data ?? 0;
        setUnread(Number(count) || 0);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    setLoading(true);
    notificationsApi.getAll({ limit: 8 })
      .then((res) => {
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)       ? raw.items
          : Array.isArray(raw?.notifications) ? raw.notifications
          : Array.isArray(raw?.data)         ? raw.data
          : [];
        setNotifications(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, isAuthenticated]);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onScroll() { setOpen(false); }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

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

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full text-white hover:bg-white/10 transition cursor-pointer"
        aria-label="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-[14px]">Notifications</h3>
            {unread > 0 && (
              <button onClick={handleMarkAllRead} className="text-[12px] text-secondary hover:underline cursor-pointer">
                Tout marquer lu
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin w-6 h-6 text-secondary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-slate-400 text-[13px] py-8">Aucune notification</p>
            ) : (
              notifications.map((n, i) => {
                const isRead = n.read ?? n.isRead ?? false;
                return (
                  <div
                    key={n.id ?? i}
                    className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 group ${!isRead ? "bg-secondary/5" : ""}`}
                    onClick={() => !isRead && handleMarkRead(n.id)}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!isRead ? "bg-secondary" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      {(() => {
                        const title = n.title ?? null;
                        const body  = n.body ?? n.description ?? n.message ?? n.content ?? null;
                        const displayTitle = title ?? body ?? "Nouvelle notification";
                        const displayBody  = title ? body : null;
                        const bodyLong = displayBody && displayBody.length > BELL_BODY_LIMIT;
                        const hasMedia = !!n.imageUrl;
                        const showMore = bodyLong || hasMedia;
                        return (
                          <>
                            <p className={`text-[13px] leading-snug line-clamp-2 ${!isRead ? "font-semibold text-slate-800" : "font-medium text-slate-700"}`}>
                              {displayTitle}
                            </p>
                            {displayBody && (
                              <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">
                                {bodyLong ? `${displayBody.slice(0, BELL_BODY_LIMIT)}… ` : displayBody}
                              </p>
                            )}
                            {showMore && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setOpen(false); setSelectedNotif(n); }}
                                className="text-[11px] font-semibold hover:underline cursor-pointer mt-0.5"
                                style={{ color: "#3FAE8C" }}
                              >
                                Voir plus
                              </button>
                            )}
                          </>
                        );
                      })()}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[11px] text-slate-400">{timeAgo(n.createdAt ?? n.date)}</p>
                        {n.link && (
                          <a
                            href={n.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold hover:underline"
                            style={{ color: "#3FAE8C" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Lien
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="opacity-0 group-hover:opacity-100 transition text-slate-300 hover:text-red-400 shrink-0 cursor-pointer mt-0.5"
                      aria-label="Supprimer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <Link
            href={`${prefix}/notifications`}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 w-full py-3 border-t border-slate-100 text-[13px] font-semibold hover:bg-slate-50 transition"
            style={{ color: "#3FAE8C" }}
          >
            {locale === "fr" ? "Voir toutes les notifications" : "See all notifications"}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      )}
      {selectedNotif && (
        <NotifDetailModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />
      )}
    </div>
  );
}
