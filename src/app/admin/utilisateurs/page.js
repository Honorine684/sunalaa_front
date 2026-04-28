import AdminShell from "@/components/admin/AdminShell";
import UsersManagement from "@/components/admin/UsersManagement";

export const metadata = {
  title: "Utilisateurs — Administration SUNAALA",
};

export default function UsersPage() {
  return (
    <AdminShell active="users" title="Utilisateurs">
      <UsersManagement />
    </AdminShell>
  );
}
