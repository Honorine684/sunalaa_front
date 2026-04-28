import AdminShell from "@/components/admin/AdminShell";
import StatisticsPage from "@/components/admin/StatisticsPage";

export const metadata = {
  title: "Statistiques — Administration SUNAALA",
};

export default function StatistiquesPage() {
  return (
    <AdminShell active="stats" title="Statistiques">
      <StatisticsPage />
    </AdminShell>
  );
}
