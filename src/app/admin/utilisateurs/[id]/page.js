import AdminShell from "@/components/admin/AdminShell";
import UserDetailPage from "@/components/admin/UserDetailPage";

export default function AdminUserDetailPage({ params }) {
  return (
    <AdminShell active="users" title="Détail utilisateur">
      <UserDetailPage userId={params.id} />
    </AdminShell>
  );
}
