"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, getApiError } from "@/lib/api";

const COLS = ["NOTIFICATION", "DESTINATAIRES", "ENVOYÉS", "STATUT", "DATE & HEURE"];

const TARGET_OPTIONS = [
  { value: "all",    label: "Tous les utilisateurs" },
  { value: "active", label: "Utilisateurs actifs" },
];

/* ── Badge ── */
function EnvoyéBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-normal border whitespace-nowrap w-fit"
      style={{ backgroundColor: "#ECFDF5", color: "#059669", borderColor: "#D1FAE5" }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 4L12 14.01l-3-3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Envoyé
    </span>
  );
}

/* ── Broadcast modal ── */
function BroadcastModal({ onClose, onSent }) {
  const [title, setTitle]       = useState("");
  const [message, setMessage]   = useState("");
  const [target, setTarget]     = useState("all");
  const [link, setLink]         = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSend() {
    if (!title.trim() || !message.trim()) {
      setError("Le titre et le message sont requis.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        title:       title.trim(),
        message:     message.trim(),
        targetGroup: target,
        ...(link.trim()     && { link:     link.trim() }),
        ...(imageUrl.trim() && { imageUrl: imageUrl.trim() }),
      };
      const res = await adminApi.broadcastNotification(payload);
      onSent({
        id:             res.data?.data?.id ?? Date.now(),
        title:          title.trim(),
        message:        message.trim(),
        targetGroup:    target,
        recipientCount: res.data?.data?.recipientCount ?? null,
        createdAt:      new Date().toISOString(),
        link:           link.trim() || null,
        imageUrl:       imageUrl.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,23,43,0.45)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="text-[17px] font-bold" style={{ color: "#0F172B" }}>Nouvelle notification</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#45556C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-xl px-4 py-3 text-[13px] border" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>
              {error}
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Maintenance programmée"
              className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2"
              style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contenu de la notification…"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2 resize-none"
              style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
            />
          </div>

          {/* Target */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold" style={{ color: "#0F172B" }}>Destinataires</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2 cursor-pointer"
              style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
            >
              {TARGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "#94A3B8" }}>Optionnel</p>

            {/* Link */}
            <div className="flex flex-col gap-1.5 mb-3">
              <label className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "#0F172B" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Lien
              </label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://sunalaa.com/..."
                type="url"
                className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2"
                style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
              />
            </div>

            {/* Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "#0F172B" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#3FAE8C" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="#3FAE8C" strokeWidth="2"/>
                  <path d="M21 15l-5-5L5 21" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Image (URL)
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... .jpg / .png / .webp"
                type="url"
                className="w-full px-4 py-2.5 rounded-xl border text-[14px] outline-none focus:ring-2"
                style={{ borderColor: "#E2E8F0", color: "#0F172B" }}
              />
              {imageUrl.trim() && (
                <img
                  src={imageUrl.trim()}
                  alt="preview"
                  className="mt-1 w-full max-h-40 object-cover rounded-xl border border-slate-100"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border text-[14px] font-semibold hover:bg-slate-50 transition cursor-pointer"
            style={{ borderColor: "#E2E8F0", color: "#45556C" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: "#3FAE8C" }}
          >
            {loading && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
              </svg>
            )}
            {loading ? "Envoi…" : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("fr-FR"),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function targetLabel(tg) {
  if (tg === "active") return "Utilisateurs actifs";
  return "Tous les utilisateurs";
}

const MSG_LIMIT = 120;

/* ── Detail modal ── */
function NotifDetailModal({ notif, onClose }) {
  const { date, time } = formatDate(notif.createdAt);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,23,43,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="text-[16px] font-bold leading-snug pr-4" style={{ color: "#0F172B" }}>{notif.title}</h3>
          <button onClick={onClose} className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-slate-100 transition cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#45556C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex flex-col gap-4">
          {notif.imageUrl && (
            <img
              src={notif.imageUrl}
              alt=""
              className="w-full max-h-56 object-cover rounded-xl border border-slate-100"
            />
          )}
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "#45556C" }}>{notif.message}</p>
          {notif.link && (
            <a
              href={notif.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-semibold hover:bg-slate-50 transition w-fit"
              style={{ borderColor: "#3FAE8C", color: "#3FAE8C" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {notif.link}
            </a>
          )}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wide mb-0.5" style={{ color: "#94A3B8" }}>Destinataires</p>
              <p className="text-[13px]" style={{ color: "#0F172B" }}>{targetLabel(notif.targetGroup)}</p>
            </div>
            {notif.recipientCount != null && (
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wide mb-0.5" style={{ color: "#94A3B8" }}>Envoyés</p>
                <p className="text-[13px]" style={{ color: "#0F172B" }}>{notif.recipientCount.toLocaleString("fr-FR")}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase font-bold tracking-wide mb-0.5" style={{ color: "#94A3B8" }}>Date</p>
              <p className="text-[13px]" style={{ color: "#0F172B" }}>{date} à {time}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border text-[14px] font-semibold hover:bg-slate-50 transition cursor-pointer" style={{ borderColor: "#E2E8F0", color: "#45556C" }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function NotificationsPage() {
  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getNotificationsHistory({ page: 1, limit: 50 });
      const outer = res.data?.data ?? res.data;
      const list = Array.isArray(outer) ? outer
        : Array.isArray(outer?.data)       ? outer.data
        : Array.isArray(outer?.items)      ? outer.items
        : Array.isArray(outer?.broadcasts) ? outer.broadcasts
        : [];
      setHistory(list);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  function handleSent(newEntry) {
    setHistory((prev) => [newEntry, ...prev]);
  }

  const totalSent       = history.length;
  const totalRecipients = history.reduce((acc, n) => acc + (n.recipientCount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Notifications globales</h2>
          <p className="text-[14px]" style={{ color: "#45556C" }}>Communiquer avec la communauté SUNALA</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer whitespace-nowrap shrink-0"
          style={{ backgroundColor: "#3FAE8C" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nouvelle notification
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-5 py-4 border text-[13px]" style={{ backgroundColor: "#FEF2F2", borderColor: "#FECACA", color: "#DC2626" }}>
          {error}
        </div>
      )}

      {/* Responsibility banner */}
      <div
        className="flex items-start gap-3 rounded-xl px-5 py-4 border"
        style={{ backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="text-[14px] font-bold mb-1" style={{ color: "#3B82F6" }}>Utilisation responsable</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "#1E40AF" }}>
            Les notifications sont envoyées instantanément à tous les utilisateurs sélectionnés. Assurez-vous que le message est clair, pertinent et respectueux de la communauté.
          </p>
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-[18px] font-bold mb-4" style={{ color: "#0F172B" }}>Historique des notifications</h3>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-10 flex justify-center">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#3FAE8C" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 20"/>
            </svg>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 px-6 py-10 text-center">
            <p className="text-[14px]" style={{ color: "#94A3B8" }}>Aucune notification envoyée pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
          <div className="bg-white min-w-150">
            {/* Head */}
            <div className="grid grid-cols-[3fr_1.5fr_1fr_1fr_1.2fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
              {COLS.map((col) => (
                <span key={col} className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "#45556C" }}>
                  {col}
                </span>
              ))}
            </div>

            {/* Rows */}
            {history.map((n, i) => {
              const { date, time } = formatDate(n.createdAt);
              return (
                <div
                  key={n.id}
                  className={[
                    "grid grid-cols-[3fr_1.5fr_1fr_1fr_1.2fr] px-6 py-5 items-start hover:bg-slate-50 transition-colors duration-150",
                    i < history.length - 1 ? "border-b border-slate-100" : "",
                  ].join(" ")}
                >
                  <div>
                    <p className="text-[14px] font-semibold mb-1 leading-snug" style={{ color: "#0F172B" }}>{n.title}</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "#45556C" }}>
                      {n.message?.length > MSG_LIMIT ? `${n.message.slice(0, MSG_LIMIT)}… ` : n.message}
                      {n.message?.length > MSG_LIMIT && (
                        <button
                          type="button"
                          onClick={() => setSelectedNotif(n)}
                          className="font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
                          style={{ color: "#3FAE8C" }}
                        >
                          Voir plus
                        </button>
                      )}
                    </p>
                    {(n.link || n.imageUrl) && (
                      <div className="flex items-center gap-2 mt-1.5">
                        {n.link && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F0FDF4", color: "#3FAE8C" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                            Lien
                          </span>
                        )}
                        {n.imageUrl && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2.5"/><path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                            Image
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[13px] pt-0.5" style={{ color: "#45556C" }}>{targetLabel(n.targetGroup)}</span>
                  <span className="text-[13px] pt-0.5" style={{ color: "#45556C" }}>
                    {n.recipientCount != null ? n.recipientCount.toLocaleString("fr-FR") : "—"}
                  </span>
                  <div className="pt-0.5"><EnvoyéBadge /></div>
                  <div className="pt-0.5">
                    <p className="text-[13px]" style={{ color: "#45556C" }}>{date}</p>
                    <p className="text-[13px]" style={{ color: "#45556C" }}>{time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>

      {/* Bottom mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Notifications envoyées",
            value: totalSent.toLocaleString("fr-FR"),
            iconBg: "#EFF6FF",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="22" y1="2" x2="11" y2="13" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
          },
          {
            label: "Destinataires touchés (total)",
            value: totalRecipients > 0 ? totalRecipients.toLocaleString("fr-FR") : "—",
            iconBg: "#ECFDF5",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: s.iconBg }}>
              {s.icon}
            </div>
            <div>
              <p className="text-[12px] mb-1" style={{ color: "#45556C" }}>{s.label}</p>
              <p className="text-[24px] font-bold leading-none" style={{ color: "#0F172B" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showModal && <BroadcastModal onClose={() => setShowModal(false)} onSent={handleSent} />}
      {selectedNotif && <NotifDetailModal notif={selectedNotif} onClose={() => setSelectedNotif(null)} />}

    </div>
  );
}
