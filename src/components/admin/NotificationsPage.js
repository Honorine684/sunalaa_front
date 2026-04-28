"use client";

/* ── Data ── */
const notifications = [
  {
    id: 1,
    title: "Nouvelle fonctionnalité disponible",
    desc: "Découvrez le système de boost quotidien et multipliez vos gains SNL !",
    recipients: "Tous les utilisateurs",
    sent: "12,847",
    status: "Envoyé",
    date: "2025-12-30",
    time: "14:30",
  },
  {
    id: 2,
    title: "Maintenance programmée",
    desc: "La plateforme sera en maintenance le 31/12 de 02h00 à 04h00. Les collectes seront suspendues.",
    recipients: "Tous les utilisateurs",
    sent: "12,847",
    status: "Envoyé",
    date: "2025-12-29",
    time: "18:00",
  },
  {
    id: 3,
    title: "Bonus parrainage doublé",
    desc: "Du 1er au 7 janvier, tous les bonus de parrainage sont doublés. Invitez vos amis !",
    recipients: "Utilisateurs actifs",
    sent: "8,432",
    status: "Envoyé",
    date: "2025-12-28",
    time: "10:15",
  },
  {
    id: 4,
    title: "Félicitations champions !",
    desc: "Vous faites partie du top 100 des utilisateurs ! Continuez comme ça pour recevoir des récompenses exclusives.",
    recipients: "Groupe personnalisé",
    sent: "100",
    status: "Envoyé",
    date: "2025-12-27",
    time: "16:45",
  },
];

const COLS = ["NOTIFICATION", "DESTINATAIRES", "ENVOYÉS", "STATUT", "DATE &\nHEURE"];

/* ── Envoyé badge ── */
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

/* ── Bottom mini stat cards ── */
const miniStats = [
  {
    label: "Notifications envoyées (30j)",
    value: "47",
    iconBg: "#EFF6FF",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <line x1="22" y1="2" x2="11" y2="13" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Destinataires touchés",
    value: "12,847",
    iconBg: "#ECFDF5",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Taux de lecture",
    value: "89.4%",
    iconBg: "#EDE9FE",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 4L12 14.01l-3-3" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

/* ── Main component ── */
export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-[20px] sm:text-[26px] font-bold mb-1" style={{ color: "#0F172B" }}>Notifications globales</h2>
          <p className="text-[14px]" style={{ color: "#45556C" }}>Communiquer avec la communauté SUNALAA</p>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer whitespace-nowrap shrink-0"
          style={{ backgroundColor: "#3FAE8C" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nouvelle notification
        </button>
      </div>

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

      {/* History section */}
      <div>
        <h3 className="text-[18px] font-bold mb-4" style={{ color: "#0F172B" }}>Historique des notifications</h3>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
        <div className="bg-white min-w-[600px]">
          {/* Head */}
          <div className="grid grid-cols-[3fr_1.5fr_1fr_1fr_1.2fr] px-6 py-3 border-b border-slate-100 rounded-t-xl" style={{ backgroundColor: "#E2E8F0" }}>
            {COLS.map((col) => (
              <span key={col} className="text-[11px] font-bold tracking-wider uppercase whitespace-pre-line" style={{ color: "#45556C" }}>
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {notifications.map((n, i) => (
            <div
              key={n.id}
              className={[
                "grid grid-cols-[3fr_1.5fr_1fr_1fr_1.2fr] px-6 py-5 items-start hover:bg-slate-50 transition-colors duration-150",
                i < notifications.length - 1 ? "border-b border-slate-100" : "",
              ].join(" ")}
            >
              {/* Notification */}
              <div>
                <p className="text-[14px] font-semibold mb-1 leading-snug" style={{ color: "#0F172B" }}>{n.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: "#45556C" }}>{n.desc}</p>
              </div>

              {/* Destinataires */}
              <span className="text-[13px] pt-0.5" style={{ color: "#45556C" }}>{n.recipients}</span>

              {/* Envoyés */}
              <span className="text-[13px] pt-0.5" style={{ color: "#45556C" }}>{n.sent}</span>

              {/* Statut */}
              <div className="pt-0.5">
                <EnvoyéBadge />
              </div>

              {/* Date & Heure */}
              <div className="pt-0.5">
                <p className="text-[13px]" style={{ color: "#45556C" }}>{n.date}</p>
                <p className="text-[13px]" style={{ color: "#45556C" }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Bottom mini stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {miniStats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-5 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: s.iconBg }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-[12px] mb-1" style={{ color: "#45556C" }}>{s.label}</p>
              <p className="text-[24px] font-bold leading-none" style={{ color: "#0F172B" }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
