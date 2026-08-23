import AdminShell from "@/components/admin/AdminShell";
import OnlineUsersPage from "@/components/admin/OnlineUsersPage";

export const metadata = {
  title: "Présence en direct : Administration SUNALA",
};

export default function PresencePage() {
  return (
    <AdminShell active="presence" title="Présence en direct">
      <OnlineUsersPage />
    </AdminShell>
  );
}
