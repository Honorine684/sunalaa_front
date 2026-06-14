import AdminShell from "@/components/admin/AdminShell";
import CommandesManagement from "@/components/admin/CommandesManagement";

export const metadata = {
  title: "Commandes — Administration SUNAALA",
};

export default function CommandesAdminPage() {
  return (
    <AdminShell active="commandes" title="Commandes">
      <CommandesManagement />
    </AdminShell>
  );
}
