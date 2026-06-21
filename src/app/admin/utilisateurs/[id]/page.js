import AdminShell from "@/components/admin/AdminShell";
import UserDetailPage from "@/components/admin/UserDetailPage";

export default async function AdminUserDetailPage({ params }) {
  const { id } = await params;
  return (
    <AdminShell active="users" title="Détail utilisateur">
      <UserDetailPage userId={id} />
    </AdminShell>
  );
}
