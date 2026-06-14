import AdminShell from "@/components/admin/AdminShell";
import SettingsManagement from "@/components/admin/SettingsManagement";

export const metadata = {
  title: "Paramètres — Administration SUNAALA",
};

export default function SettingsPage() {
  return (
    <AdminShell active="settings" title="Paramètres" backHref="/admin">
      <SettingsManagement />
    </AdminShell>
  );
}
