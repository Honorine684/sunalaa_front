import AdminShell from "@/components/admin/AdminShell";
import FormationsManagement from "@/components/admin/FormationsManagement";

export const metadata = {
  title: "Formations — Administration SUNAALA",
};

export default function FormationsAdminPage() {
  return (
    <AdminShell active="formations" title="Formations">
      <FormationsManagement />
    </AdminShell>
  );
}
