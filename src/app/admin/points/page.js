import AdminShell from "@/components/admin/AdminShell";
import PointsManagement from "@/components/admin/PointsManagement";

export const metadata = {
  title: "Points SNL — Administration SUNAALA",
};

export default function PointsPage() {
  return (
    <AdminShell active="points" title="Points SNL">
      <PointsManagement />
    </AdminShell>
  );
}
