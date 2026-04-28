import AdminShell from "@/components/admin/AdminShell";
import MissionsPage from "@/components/admin/MissionsPage";

export const metadata = {
  title: "Missions — Administration SUNAALA",
};

export default function MissionsAdminPage() {
  return (
    <AdminShell
      active="missions"
      title="Missions"
      headerRight={
        <button
          className="px-5 py-2 rounded-xl text-white text-[14px] font-semibold hover:brightness-110 transition cursor-pointer"
          style={{ backgroundColor: "#3FAE8C" }}
        >
          User Demo
        </button>
      }
    >
      <MissionsPage />
    </AdminShell>
  );
}
