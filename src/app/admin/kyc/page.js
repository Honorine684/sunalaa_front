import AdminShell from "@/components/admin/AdminShell";
import KycManagement from "@/components/admin/KycManagement";

export const metadata = {
  title: "KYC — Administration SUNAALA",
};

export default function KycPage() {
  return (
    <AdminShell active="kyc" title="Vérification KYC" backHref="/admin">
      <KycManagement />
    </AdminShell>
  );
}
