import AdminShell from "@/components/admin/AdminShell";
import NotificationsPage from "@/components/admin/NotificationsPage";

export const metadata = {
  title: "Notifications — Administration SUNAALA",
};

export default function NotificationsAdminPage() {
  return (
    <AdminShell active="notifications" title="Notifications">
      <NotificationsPage />
    </AdminShell>
  );
}
