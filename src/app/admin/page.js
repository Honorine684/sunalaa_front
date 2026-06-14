import AdminShell from "@/components/admin/AdminShell";
import QuickAccessCard from "@/components/admin/QuickAccessCard";
import UserTable from "@/components/admin/UserTable";
import AdminDashboardData from "@/components/admin/AdminDashboardData";

export const metadata = {
  title: "Administration — SUNAALA",
};

const quickAccess = [
  {
    iconBg: "#EFF6FF",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Gestion des utilisateurs",
    desc: "Consulter, modifier et modérer les comptes",
    href: "/admin/utilisateurs",
  },
  {
    iconBg: "#FEF3C7",
    icon: (
      <div className="relative w-9 h-6 shrink-0">
        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#E6B84C] border-2 border-white" />
        <div className="absolute left-3 top-0 w-6 h-6 rounded-full bg-[#E6B84C] border-2 border-white" />
      </div>
    ),
    title: "Gestion des points",
    desc: "Ajuster les soldes SNL et consulter l'historique",
    href: "/admin/points",
  },
  {
    iconBg: "#D1FAE5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Exports",
    desc: "Exporter les données de la plateforme",
    href: "/admin/exports",
  },
  {
    iconBg: "#EDE9FE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Formations",
    desc: "Créer et gérer les formations & masterclass",
    href: "/admin/formations",
  },
  {
    iconBg: "#FEF3C7",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 6h18M16 10a4 4 0 01-8 0" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Commandes",
    desc: "Gérer et suivre les commandes des formations",
    href: "/admin/commandes",
  },
  {
    iconBg: "#ECFDF5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="5" stroke="#059669" strokeWidth="2"/>
        <path d="M8.5 14.5L7 21l5-2 5 2-1.5-6.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Commissions",
    desc: "Approuver et gérer les commissions réseau",
    href: "/admin/commissions",
  },
  {
    iconBg: "#FEE2E2",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M19 12l-7 7-7-7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 5h14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Retraits",
    desc: "Traiter les demandes de retrait des membres",
    href: "/admin/retraits",
  },
  {
    iconBg: "#F0FDF4",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "KYC",
    desc: "Vérifier et approuver les identités des membres",
    href: "/admin/kyc",
  },
  {
    iconBg: "#F8FAFC",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="#64748B" strokeWidth="2"/>
        <path d="M19.07 4.93A10 10 0 115 19.07M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Paramètres",
    desc: "Configurer les paramètres de la plateforme",
    href: "/admin/settings",
  },
  {
    iconBg: "#F1F5F9",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Journaux d'audit",
    desc: "Consulter les actions de la plateforme (SUPER_ADMIN)",
    href: "/admin/audit-logs",
  },
];

export default function AdminPage() {
  return (
    <AdminShell active="overview" title="Aperçu de l'activité" backHref="/">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-[26px] font-bold mb-1" style={{ color: "#1F4E46" }}>Aperçu de l&apos;activité</h2>
          <p className="text-[14px]" style={{ color: "#45556C" }}>Activité de la plateforme en temps réel</p>
        </div>

        <AdminDashboardData />

        <div>
          <h3 className="text-[18px] font-bold mb-4" style={{ color: "#1F4E46" }}>Accès rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickAccess.map((q) => <QuickAccessCard key={q.title} {...q} />)}
          </div>
        </div>

        <UserTable />
      </div>
    </AdminShell>
  );
}
