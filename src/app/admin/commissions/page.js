import AdminShell from "@/components/admin/AdminShell";
import CommissionsManagement from "@/components/admin/CommissionsManagement";

export const metadata = {
  title: "Commissions — Administration SUNAALA",
};

export default function CommissionsAdminPage() {
  return (
    <AdminShell active="commissions" title="Commissions">
      <CommissionsManagement />
    </AdminShell>
  );
}
