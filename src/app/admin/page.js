import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import QuickAccessCard from "@/components/admin/QuickAccessCard";
import UserTable from "@/components/admin/UserTable";

export const metadata = {
  title: "Administration — SUNAALA",
};

const stats = [
  {
    iconBg: "#EFF6FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="#3FAE8C" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#3FAE8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    trend: "+12.5%", label: "Utilisateurs totaux", value: "12,847",
  },
  {
    iconBg: "#FEF3C7",
    icon: (
      <div className="relative w-8 h-5 shrink-0">
        <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
        <div className="absolute left-3 top-0 w-5 h-5 rounded-full bg-[#E6B84C] border-2 border-white" />
      </div>
    ),
    trend: "+8.2%", label: "Points SNL distribués", value: "2,458,921",
  },
  {
    iconBg: "#D1FAE5",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    trend: "+5.1%", label: "Collectes aujourd'hui", value: "8,432",
  },
  {
    iconBg: "#EDE9FE",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 7l-9.5 9.5-5-5L1 17" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 7h6v6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    trend: "+2.3%", label: "Taux d'activité", value: "65.6%",
  },
];

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
];

export default function AdminPage() {
  return (
    <AdminShell active="overview" title="Aperçu de l'activité" backHref="/">
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-[26px] font-bold mb-1" style={{ color: "#1F4E46" }}>Aperçu de l&apos;activite</h2>
          <p className="text-[14px]" style={{ color: "#45556C" }}>Activité de la plateforme en temps réel</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

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
