import AdminShell from "@/components/admin/AdminShell";
import LevelsPage from "@/components/admin/LevelsPage";

export const metadata = {
  title: "Niveaux — Administration SUNAALA",
};

export default function NiveauxAdminPage() {
  return (
    <AdminShell active="niveaux" title="Niveaux SNL">
      <LevelsPage />
    </AdminShell>
  );
}
