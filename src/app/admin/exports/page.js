import AdminShell from "@/components/admin/AdminShell";
import ExportsPage from "@/components/admin/ExportsPage";

export const metadata = {
  title: "Exports — Administration SUNAALA",
};

export default function ExportsAdminPage() {
  return (
    <AdminShell active="exports" title="Exports">
      <ExportsPage />
    </AdminShell>
  );
}
