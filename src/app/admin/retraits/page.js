import AdminShell from "@/components/admin/AdminShell";
import RetraitsManagement from "@/components/admin/RetraitsManagement";

export const metadata = {
  title: "Retraits — Administration SUNAALA",
};

export default function RetraitsAdminPage() {
  return (
    <AdminShell active="retraits" title="Retraits">
      <RetraitsManagement />
    </AdminShell>
  );
}
