import AdminShell from "@/components/admin/AdminShell";
import AuditLogs from "@/components/admin/AuditLogs";

export const metadata = {
  title: "Journaux d'audit — Administration SUNAALA",
};

export default function AuditLogsPage() {
  return (
    <AdminShell active="audit-logs" title="Journaux d'audit" backHref="/admin">
      <AuditLogs />
    </AdminShell>
  );
}
