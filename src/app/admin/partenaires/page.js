import AdminShell from "@/components/admin/AdminShell";
import PartnerRequestsPage from "@/components/admin/PartnerRequestsPage";

export default function AdminPartenairesPage() {
  return (
    <AdminShell active="partenaires" title="Demandes partenaires">
      <PartnerRequestsPage />
    </AdminShell>
  );
}
